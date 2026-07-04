import { Request, Response, NextFunction } from 'express';
import { verifyToken, createClerkClient } from '@clerk/backend';
import { Resend } from 'resend';
import { AppDataSource } from '@infrastructure/database/data-source';
import { UserEntity } from '@infrastructure/entities/UserEntity';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

function welcomeHtml(name: string, username: string): string {
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
  const portfolioUrl = `${frontendUrl}/u/${username}`;
  const dashboardUrl = `${frontendUrl}/dashboard`;
  return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8" /></head>
<body style="font-family:sans-serif;background:#05091a;color:#fff;max-width:600px;margin:0 auto;padding:32px;">
  <h1 style="color:#3b82f6;">Bienvenue ${name} 👋</h1>
  <p>Votre portfolio est prêt. Voici votre URL publique :</p>
  <a href="${portfolioUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-bottom:24px;">${portfolioUrl}</a>

  <h2 style="color:#93c5fd;">Pour un portfolio complet :</h2>
  <ol style="color:#cbd5e1;line-height:2;">
    <li>Complétez votre <strong>profil</strong> (nom, bio, photo)</li>
    <li>Ajoutez vos <strong>projets</strong> avec description, liens et stack technique</li>
    <li>Listez vos <strong>compétences</strong> par catégorie avec niveau</li>
    <li>Renseignez votre <strong>parcours</strong> (expériences + formations)</li>
    <li>Publiez des <strong>actualités</strong> pour montrer votre activité</li>
    <li>Ajoutez vos <strong>liens réseaux</strong> (GitHub, LinkedIn, Twitter…)</li>
    <li>Choisissez un <strong>thème</strong> pour personnaliser l'apparence</li>
  </ol>

  <a href="${dashboardUrl}" style="display:inline-block;background:#1d4ed8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:16px;">Accéder au dashboard →</a>

  <p style="color:#64748b;font-size:12px;margin-top:40px;">SaaS Portfolio — cet email a été envoyé suite à la création de votre compte.</p>
</body>
</html>`;
}

declare global {
  namespace Express {
    interface Request {
      user: { id: number; clerkId: string };
    }
  }
}

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY ?? '' });

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY ?? '',
    });
    const clerkId = payload.sub;

    const userRepo = AppDataSource.getRepository(UserEntity);
    let user = await userRepo.findOne({ where: { clerkId } });

    if (!user) {
      const clerkUser = await clerk.users.getUser(clerkId);
      const email = clerkUser.emailAddresses[0]?.emailAddress ?? '';

      // User might exist from the old JWT auth system — link it to Clerk
      user = await userRepo.findOne({ where: { email } });

      if (user) {
        user.clerkId = clerkId;
        await userRepo.save(user);
      } else {
        const baseUsername = (clerkUser.username ?? email.split('@')[0])
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '_')
          .slice(0, 28);

        let username = baseUsername;
        let suffix = 1;
        while (await userRepo.findOne({ where: { username } })) {
          username = `${baseUsername}_${suffix++}`;
        }

        const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;
        user = userRepo.create({
          clerkId,
          email,
          username,
          fullName,
          passwordHash: null,
        });
        await userRepo.save(user);

        // Send welcome email — fire-and-forget
        resend.emails.send({
          from: 'SaaS Portfolio <onboarding@resend.dev>',
          to: email,
          subject: `Bienvenue ${clerkUser.firstName ?? username} — votre portfolio est prêt 🎉`,
          html: welcomeHtml(clerkUser.firstName ?? username, username),
        }).then(({ error }) => {
          if (error) console.error('[welcome email] Resend error:', error);
        }).catch((err) => console.error('[welcome email] send failed:', err));
      }
    }

    req.user = { id: user.id, clerkId };
    next();
  } catch (err) {
    console.error('[authMiddleware] error:', err);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};