export interface AddShotByShotRawCommand {
  externalId: number;
  xg: number;
  xgot: number;
  isHome: boolean;
  shotType: string;
  situation: string;
  bodyPart: string;
  timeSeconds: number;
  playerExternalId: number;
  goalkeeperExternalId: number | null;
  matchExternalId: number;
}
