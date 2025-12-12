import { EpisodesResponseDTO } from "../dtos/episode.dto";
import { IEpisodeRepository } from "../repositories/IEpisodeRepository";

export class EpisodeService {
  constructor(private readonly episodeRepository: IEpisodeRepository) {}

  public async list(page?: number): Promise<EpisodesResponseDTO> {
    const result = await this.episodeRepository.list(page);
    return result;
  }
}
