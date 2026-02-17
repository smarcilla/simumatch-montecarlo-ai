import { Color } from "../value-objects/color.value";

export class Team {
  constructor(
    readonly id: string,
    readonly externalId: number,
    readonly name: string,
    readonly slug: string,
    readonly shortName: string,
    readonly primaryColor: Color,
    readonly secondaryColor: Color
  ) {}

  //   equals(other: Team): boolean {
  //     return this.id === other.id && this.externalId === other.externalId;
  //   }
}
