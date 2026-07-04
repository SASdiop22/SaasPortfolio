import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function welcomeHtml(name: string, username: string, frontendUrl: string): string {
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

export class WebhookController {
  async handleClerk(req: Request, res: Response): Promise<void> {
    const secret = process.env.CLERK_WEBHOOK_SECRET;
    if (!secret) {
      res.status(200).json({ received: true });
      return;
    }

    const wh = new Webhook(secret);
    let evt: { type: string; data: Record<string, unknown> };

    try {
      evt = wh.verify(req.body as Buffer, {
        'svix-id': req.headers['svix-id'] as string,
        'svix-timestamp': req.headers['svix-timestamp'] as string,
        'svix-signature': req.headers['svix-signature'] as string,
      }) as typeof evt;
    } catch {
      res.status(400).json({ error: 'Invalid webhook signature' });
      return;
    }

    if (evt.type === 'user.created' && resend) {
      const data = evt.data as {
        email_addresses?: { email_address: string }[];
        username?: string;
        first_name?: string;
      };
      const email = data.email_addresses?.[0]?.email_address;
      const username = data.username ?? 'user';
      const firstName = data.first_name ?? username;
      const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';

      if (email) {
        await resend.emails.send({
          from: 'SaaS Portfolio <onboarding@resend.dev>',
          to: email,
          subject: `Bienvenue ${firstName} — votre portfolio est prêt 🎉`,
          html: welcomeHtml(firstName, username, frontendUrl),
        });
      }
    }

    res.status(200).json({ received: true });
  }
}