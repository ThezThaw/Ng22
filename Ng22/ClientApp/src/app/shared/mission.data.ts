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
  updatedOn?: string;
}




