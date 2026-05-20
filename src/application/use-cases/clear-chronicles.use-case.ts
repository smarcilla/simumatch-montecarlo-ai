import { ChronicleRepository } from "@/domain/repositories/chronicle.repository";

export class ClearChroniclesUseCase {
  constructor(private readonly chronicleRepository: ChronicleRepository) {}

  async execute(): Promise<void> {
    await this.chronicleRepository.deleteAll();
  }
}
