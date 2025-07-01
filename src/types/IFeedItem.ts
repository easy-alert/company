import type { TFeedItemType } from './TFeedItemType';

export interface IFeedItem {
  id?: string;

  title?: string;
  description?: string;

  imageUrl?: string;
  videoUrl?: string;

  ctaLink?: string;
  ctaText?: string;

  type?: TFeedItemType;

  isPinned?: boolean;
  order?: number;

  startsAt?: string;
  expiresAt?: string;

  createdAt?: string;
  updatedAt?: string;
}
