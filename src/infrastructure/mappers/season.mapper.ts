import { Season } from "@/domain/entities/season.entity";
import { SeasonDTO } from "../dtos/season.dto";
import { SeasonYear } from "@/domain/value-objects/season-year.value";

export class SeasonMapper {
  static toDTO(season: Season): SeasonDTO {
    return {
      name: season.name,
      year: season.year.value,
      id: season.id,
      externalId: season.externalId,
    };
  }

  static toDomain(dto: SeasonDTO): Season {
    return new Season(
      dto.name,
      new SeasonYear(dto.year),
      dto.id,
      dto.externalId
    );
  }

  static toDTOList(seasons: Season[]): SeasonDTO[] {
    return seasons.map(this.toDTO);
  }

  static toDomainList(dtos: SeasonDTO[]): Season[] {
    return dtos.map(this.toDomain);
  }
}
