import { AxiosError } from "axios";
import { Character } from "../../entites/character.entity";
import { api } from "../../lib/api";
import { ICharacterRepository } from "./ICharacterRepository";
import { AppError } from "../../errors";
import { redis } from "../../lib/redis";
import { REDIS_EXPIRATION_TIME } from "../../constants";

export class CharacterRepository implements ICharacterRepository {
  async listCharactersByIds(ids: string[]): Promise<Character[]> {
    try {
      const sortedIds = [...ids].sort();

      const cacheKey = `characters:listCharactersByIds:${sortedIds.join(",")}`;

      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached) as Character[];
      }

      const response = await api.get<Character[]>(`character/${ids.join(",")}`);

      await redis.setEx(cacheKey, REDIS_EXPIRATION_TIME, JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AppError(error.status || 500, error.message);
      }
      throw error;
    }
  }
}
