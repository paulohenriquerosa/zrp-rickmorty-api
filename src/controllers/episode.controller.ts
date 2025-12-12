import { Get, Query, Route, Tags } from "tsoa";
import { EpisodeRepository } from "../repositories/episode.repository";
import { EpisodeService } from "../services/episode.servie";
import { EpisodesResponseDTO } from "../dtos/episode.dto";

const episodeRepository = new EpisodeRepository();
const episodeService = new EpisodeService(episodeRepository);

@Route("episodes")
@Tags("Episodes")
export class EpisodeController {
  @Get("/")
  public async list(@Query() page?: number): Promise<EpisodesResponseDTO> {
    const result = await episodeService.list(page);
    return result;
  }
}
