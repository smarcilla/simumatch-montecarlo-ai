import { ShotRepository } from "@/domain/repositories/shot.repository";

export class ClearShotsUseCase {
  constructor(private readonly shotRepository: ShotRepository) {}

  async execute(): Promise<void> {
    await this.shotRepository.deleteAll();
  }
}
