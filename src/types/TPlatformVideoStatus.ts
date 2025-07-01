export const PLATFORM_VIDEO_STATUS_VALUES = ['draft', 'published', 'archived'] as const;
export type TPlatformVideoStatus = (typeof PLATFORM_VIDEO_STATUS_VALUES)[number];
