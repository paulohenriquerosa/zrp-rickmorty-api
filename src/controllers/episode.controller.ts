import { Get, Query, Route, Tags } from "tsoa";
import { EpisodeRepository } from "../repositories/episode/episode.repository";
import { EpisodeService } from "../services/episode.servie";
import { EpisodesResponseDTO, GetCharactersByEpisodeIdResponseDTO } from "../dtos/episode.dto";
import { Episode } from "../entites/episode.entity";
import { CharacterRepository } from "../repositories/character/character.repository";

const episodeRepository = new EpisodeRepository();
const characterRepository = new CharacterRepository();
const episodeService = new EpisodeService(episodeRepository, characterRepository);

@Route("episodes")
@Tags("Episodes")
export class EpisodeController {
  @Get("/")
  public async list(
    @Query() page?: number,
    @Query() name?: string,
    @Query() episode?: string
  ): Promise<EpisodesResponseDTO> {
    const result = await episodeService.list({
      page,
      name,
      episode,
    });
    return result;
  }

  @Get("/{id}")
  public async get(id: number): Promise<Episode> {
    const result = await episodeService.getById(id);
    return result;
  }

  @Get("/{id}/characters")
  public async getCharactersByEpisodeId(id: number): Promise<GetCharactersByEpisodeIdResponseDTO> {
    const result = await episodeService.getCharactersByEpisodeId(id);
    return result;
  }
}
