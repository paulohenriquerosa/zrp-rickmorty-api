import { Character } from "../entites/character.entity";
import { Episode } from "../entites/episode.entity";

interface Info {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface EpisodesResponseDTO {
  info: Info;
  results: Episode[];
}

export interface EpisodeListAllRequestDTO {
  page?: number;
  name?: string;
  episode?: string;
}

export type GetCharactersByEpisodeIdResponseDTO = Omit<Episode, "characters"> & {
  characters: Character[];
};
