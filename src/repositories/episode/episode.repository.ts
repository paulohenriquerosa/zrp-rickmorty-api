import { AxiosError } from "axios";
import { EpisodeListAllRequestDTO, EpisodesResponseDTO } from "../../dtos/episode.dto";
import { AppError } from "../../errors";
import { api } from "../../lib/api";
import { IEpisodeRepository } from "./IEpisodeRepository";
import { Episode } from "../../entites/episode.entity";
import { redis } from "../../lib/redis";
import { REDIS_EXPIRATION_TIME } from "../../constants";

export class EpisodeRepository implements IEpisodeRepository {
  async list({ page, name, episode }: EpisodeListAllRequestDTO): Promise<EpisodesResponseDTO> {
    try {
      const cacheKey = `episodes:list:${page}:${name}:${episode}`;

      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached) as EpisodesResponseDTO;
      }

      const response = await api.get<EpisodesResponseDTO>("/episode", {
        params: {
          page,
          name,
          episode,
        },
      });

      await redis.setEx(cacheKey, REDIS_EXPIRATION_TIME, JSON.stringify(response.data));

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
      const cacheKey = `episode:get:${id}`;

      const cached = await redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached) as Episode;
      }

      const response = await api.get<Episode>(`/episode/${id}`);

      await redis.setEx(cacheKey, REDIS_EXPIRATION_TIME, JSON.stringify(response.data));

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new AppError(error.status || 500, error.message);
      }
      throw error;
    }
  }
}
