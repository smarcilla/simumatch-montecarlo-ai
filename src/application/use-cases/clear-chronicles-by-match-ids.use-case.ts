import { ChronicleRepository } from "@/domain/repositories/chronicle.repository";

export class ClearChroniclesByMatchIdsUseCase {
  constructor(private readonly chronicleRepository: ChronicleRepository) {}

  async execute(matchIds: string[]): Promise<void> {
    await this.chronicleRepository.deleteByMatchIds(matchIds);
  }
}
