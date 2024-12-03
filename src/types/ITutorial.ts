export interface ITutorial {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  type: 'video' | 'document';
  order: number;
}
