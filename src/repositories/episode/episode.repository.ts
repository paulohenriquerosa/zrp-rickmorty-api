import { AxiosError } from "axios";
import { EpisodeListAllRequestDTO, EpisodesResponseDTO } from "../../dtos/episode.dto";
import { AppError } from "../../errors";
import { api } from "../../lib/api";
import { IEpisodeRepository } from "./IEpisodeRepository";
import { Episode } from "../../entites/episode.entity";

export class EpisodeRepository implements IEpisodeRepository {
  async list({ page, name, episode }: EpisodeListAllRequestDTO): Promise<EpisodesResponseDTO> {
    try {
      const response = await api.get<EpisodesResponseDTO>("/episode", {
        params: {
          page,
          name,
          episode,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AppError(error.status || 500, error.message);
      }
      throw error;
    }
  }

  async getById(id: number): Promise<Episode> {
    try {
      const response = await api.get<Episode>(`/episode/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AppError(error.status || 500, error.message);
      }
      throw error;
    }
  }
}
