import { IdGeneratorService } from "@/domain/services/id-generator.service";
import { Types } from "mongoose";

export class MongooseIdGeneratorService implements IdGeneratorService {
  generateId(): string {
    return new Types.ObjectId().toString();
  }
}
