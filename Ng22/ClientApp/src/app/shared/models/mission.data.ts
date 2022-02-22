export interface Mission {
  uid?: string;
  title: string;
  brief?: string;
  alive: boolean;
  isAssigned: boolean;
  missionDetails: MissionDetails[];
}

export interface MissionDetails {
  uid?: string;
  missionUid: string;
  instruction: string;
  updatedOn?: string;
}

export interface MissionUserRelation {
  uid?: string;
  missionuid: string;
  useruid: string;
}
