import {
  Chronicle,
  ChronicleGenerationContext,
} from "@/domain/entities/chronicle.entity";

export interface ChronicleGenerator {
  generate(input: ChronicleGenerationContext): Promise<Chronicle>;
}
