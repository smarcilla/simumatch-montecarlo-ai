export class Player {
  constructor(
    readonly id: string,
    readonly externalId: number,
    readonly name: string,
    readonly slug: string,
    readonly shortName: string,
    readonly position: string,
    readonly jerseyNumber: string
  ) {}

  equals(other: Player): boolean {
    return this.externalId === other.externalId;
  }
}
