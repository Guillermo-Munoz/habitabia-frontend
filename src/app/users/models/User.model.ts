export interface UserModel {
    id: string;
    fullName: string;
    email: string;
    role: 'USER' | 'ADMIN';
    bio: string | null;
    avatarUrl: string | null;
}