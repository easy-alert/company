export interface IAnnexesAndImages {
  id?: string;

  name: string;
  originalName: string;
  url: string;
  type?: string;
}

export interface IAnnexesAndImagesWithActivityId extends IAnnexesAndImages {
  activityId?: string;
}
