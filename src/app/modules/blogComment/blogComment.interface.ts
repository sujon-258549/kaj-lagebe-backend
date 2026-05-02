export type IBlogComment = {
  blogId: string;
  comment: string;
  name: string;
  email?: string;
  phone: string;
  saveInfo?: boolean;
  userId?: string;
  status?: boolean;
  isDeleted?: boolean;
};
