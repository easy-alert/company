import type { TPlatformVideoStatus } from './TPlatformVideoStatus';
import type { TPlatformVideoType } from './TPlatformVideoType';

export interface IPlatformVideo {
  id?: string;

  title?: string;
  description?: string;
  url?: string;
  youtubeId?: string;
  thumbnail?: string;
  order?: number;

  type?: TPlatformVideoType;
  status?: TPlatformVideoStatus;

  tags?: string[];

  publishedAt?: string;

  createdAt?: string;
  updatedAt?: string;
}
