import { League } from "@/domain/entities/league.entity";
import { LeagueDTO } from "../dtos/league.dto";
import { SeasonMapper } from "./season.mapper";

export class LeagueMapper {
  static toDTO(league: League): LeagueDTO {
    return {
      name: league.name,
      country: league.country,
      id: league.id,
      externalId: league.externalId,
      numericExternalId: league.numericExternalId,
      seasons: SeasonMapper.toDTOList(league.seasons),
    };
  }

  static toDomain(dto: LeagueDTO): League {
    return new League(
      dto.name,
      dto.country,
      SeasonMapper.toDomainList(dto.seasons),
      dto.id,
      dto.externalId,
      dto.numericExternalId
    );
  }

  static toDTOList(leagues: League[]): LeagueDTO[] {
    return leagues.map(this.toDTO);
  }

  static toDomainList(dtos: LeagueDTO[]): League[] {
    return dtos.map(this.toDomain);
  }
}
