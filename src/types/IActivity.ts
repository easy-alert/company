export interface IActivity {
  id: string;
  createdAt: string;
  title: string;
  content: string | null;
  type: 'comment' | 'notification';

  images: {
    id: string;
    url: string;
    name: string;
  }[];
}
