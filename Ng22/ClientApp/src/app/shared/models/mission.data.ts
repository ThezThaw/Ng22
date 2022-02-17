export interface Mission {
  uid?: string;
  title: string;
  brief?: string;
  alive: boolean;
  isAssigned: boolean;
  missiondetails: MissionDetails[];
}

export interface MissionDetails {
  uid?: string;
  missionUid: string;
  instruction: string;
  updatedDt?: string;
}

export interface MissionUserRelation {
  uid?: string;
  missionuid: string;
  useruid: string;
}
