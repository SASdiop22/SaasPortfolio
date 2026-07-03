import { createClient } from '@supabase/supabase-js';
import { UserEntity } from '@infrastructure/entities/UserEntity';
import { NotFoundException } from '@shared/exceptions/NotFoundException';
import { env } from '@config/env';

export interface IUserAvatarStore {
  findById(id: number): Promise<UserEntity | null>;
  save(entity: UserEntity): Promise<UserEntity>;
}

export class UploadAvatarUseCase {
  constructor(private readonly repository: IUserAvatarStore) {}

  async execute(userId: number, file: Express.Multer.File): Promise<string> {
    const user = await this.repository.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const supabase = createClient(env.supabase.url, env.supabase.serviceKey);

    const path = `${userId}/avatar/${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('portfolios')
      .upload(path, file.buffer, { contentType: file.mimetype, upsert: true });

    if (error) {
      throw new Error(`Failed to upload avatar: ${error.message}`);
    }

    const { data: urlData } = supabase.storage.from('portfolios').getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    user.avatarUrl = publicUrl;
    await this.repository.save(user);

    return publicUrl;
  }
}