export interface Mission {
  uid?: string;
  title: string;
  brief?: string;
  missiondetails: MissionDetails[];
}

export interface MissionDetails {
  uid?: string;
  missionuid: string;
  instruction: string;
}

export interface MissionUserRelation {
  uid?: string;
  missionuid: string;
  useruid: string;
}
