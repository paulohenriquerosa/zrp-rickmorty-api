import { Character } from "../../entites/character.entity";

export interface ICharacterRepository {
  listCharactersByIds(ids: string[]): Promise<Character[]>;
}
