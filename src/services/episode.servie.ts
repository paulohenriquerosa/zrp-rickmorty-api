import {
  EpisodeListAllRequestDTO,
  EpisodesResponseDTO,
  GetCharactersByEpisodeIdRequestDTO,
  GetCharactersByEpisodeIdResponseDTO,
} from "../dtos/episode.dto";
import { Episode } from "../entites/episode.entity";
import { NotFoundError } from "../errors";
import { ICharacterRepository } from "../repositories/character/ICharacterRepository";
import { IEpisodeRepository } from "../repositories/episode/IEpisodeRepository";
import { filterCharacters, sortCharactersByName } from "../utils/charactersFilters";

export class EpisodeService {
  constructor(
    private readonly episodeRepository: IEpisodeRepository,
    private readonly characterRepository: ICharacterRepository
  ) {}

  public async list(params: EpisodeListAllRequestDTO): Promise<EpisodesResponseDTO> {
    const result = await this.episodeRepository.list(params);
    return result;
  }

  public async getById(id: number): Promise<Episode> {
    const result = await this.episodeRepository.getById(id);
    return result;
  }

  public async getCharactersByEpisodeId(
    id: number,
    params: GetCharactersByEpisodeIdRequestDTO
  ): Promise<GetCharactersByEpisodeIdResponseDTO> {
    const episode = await this.episodeRepository.getById(id);

    if (!episode) {
      throw new NotFoundError(`Episode with id ${id} not found`);
    }

    const { characters: episodeCharacters } = episode;

    if (episodeCharacters.length === 0) {
      throw new NotFoundError(`Episode with id ${id} has no characters`);
    }

    const charactersIds = episodeCharacters
      .map((character) => character.split("/").pop())
      .filter((id): id is string => !!id);

    const characters = await this.characterRepository.listCharactersByIds(charactersIds);

    const filtered = filterCharacters(characters, params);
    const ordered = sortCharactersByName(filtered);

    return {
      ...episode,
      characters: ordered,
    };
  }
}
