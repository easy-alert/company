export const FEED_ITEM_TYPE_VALUES = ['alert', 'announcement', 'promotion'] as const;
export type TFeedItemType = (typeof FEED_ITEM_TYPE_VALUES)[number];
