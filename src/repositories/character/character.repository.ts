import { AxiosError } from "axios";
import { Character } from "../../entites/character.entity";
import { api } from "../../lib/api";
import { ICharacterRepository } from "./ICharacterRepository";
import { AppError } from "../../errors";

export class CharacterRepository implements ICharacterRepository {
  async listCharactersByIds(ids: string[]): Promise<Character[]> {
    try {
      const response = await api.get<Character[]>(`character/${ids.join(",")}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AppError(error.status || 500, error.message);
      }
      throw error;
    }
  }
}
