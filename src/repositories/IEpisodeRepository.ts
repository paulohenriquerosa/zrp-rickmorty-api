import { EpisodesResponseDTO } from "../dtos/episode.dto";

export interface IEpisodeRepository {
  list(page?: number): Promise<EpisodesResponseDTO>;
}
