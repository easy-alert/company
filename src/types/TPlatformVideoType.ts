export const PLATFORM_VIDEO_TYPE_VALUES = ['tutorial', 'news', 'feature'] as const;
export type TPlatformVideoType = (typeof PLATFORM_VIDEO_TYPE_VALUES)[number];
