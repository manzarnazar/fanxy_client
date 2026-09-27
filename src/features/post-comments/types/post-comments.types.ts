export interface PostComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  fullName: string;
  avatarUrl: string | null;
  text: string;
  createdAt: string;
  isMine: boolean;
}
