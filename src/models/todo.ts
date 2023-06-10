export enum ProjectStatus {
  Active,
  Finished,
}
export class Project {
  constructor(
    public id: string,
    public description: string,
    public quantity: number,
    public status: ProjectStatus
  ) {}
}
