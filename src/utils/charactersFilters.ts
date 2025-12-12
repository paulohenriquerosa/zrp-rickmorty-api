import { Character } from "../entites/character.entity";
import { GetCharactersByEpisodeIdRequestDTO } from "../dtos/episode.dto";

export function filterCharacters(
  characters: Character[],
  { name, status, species, type, gender }: GetCharactersByEpisodeIdRequestDTO
): Character[] {
  return characters.filter((c) => {
    if (name && !c.name.toLowerCase().includes(name.toLowerCase())) return false;

    if (status && c.status.toLowerCase() !== status.toLowerCase()) return false;

    if (species && !c.species.toLowerCase().includes(species.toLowerCase())) return false;

    if (type && !c.type.toLowerCase().includes(type.toLowerCase())) return false;

    if (gender && c.gender.toLowerCase() !== gender.toLowerCase()) return false;

    return true;
  });
}

export function sortCharactersByName(characters: Character[]): Character[] {
  return [...characters].sort((a, b) => a.name.localeCompare(b.name));
}
