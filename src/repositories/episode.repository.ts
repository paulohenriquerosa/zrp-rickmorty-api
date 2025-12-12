import { AxiosError } from "axios";
import { EpisodesResponseDTO } from "../dtos/episode.dto";
import { AppError } from "../errors";
import { api } from "../lib/api";
import { IEpisodeRepository } from "./IEpisodeRepository";

export class EpisodeRepository implements IEpisodeRepository {
  async list(page?: number): Promise<EpisodesResponseDTO> {
    try {
      const response = await api.get<EpisodesResponseDTO>("/episode", {
        params: {
          page,
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
}
