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
