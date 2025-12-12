import { EpisodeListAllRequestDTO, EpisodesResponseDTO } from "../../dtos/episode.dto";
import { Episode } from "../../entites/episode.entity";

export interface IEpisodeRepository {
  list(params: EpisodeListAllRequestDTO): Promise<EpisodesResponseDTO>;
  getById(id: number): Promise<Episode>;
}
