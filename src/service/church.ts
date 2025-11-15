import api from "./api";
import { ChurchDTO, CreateChurchDTO, UpdateChurchDTO } from "@dtos/church";

export const ChurchService = {
  findChurchs: async (): Promise<ChurchDTO[]> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.get<ChurchDTO[]>("/churchs");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createChurch: async (
    createChurchDTO: CreateChurchDTO
  ): Promise<ChurchDTO> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post<ChurchDTO>("/churchs", createChurchDTO);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateChurch: async (
    churchId: string,
    updateChurchDTO: UpdateChurchDTO
  ): Promise<void> => {
    // eslint-disable-next-line no-useless-catch
    try {
      await api.patch(`/churchs/${churchId}`, updateChurchDTO);
    } catch (error) {
      throw error;
    }
  },

  deleteChurch: async (churchId: string): Promise<void> => {
    // eslint-disable-next-line no-useless-catch
    try {
      await api.delete(`/churchs/${churchId}`);
    } catch (error) {
      throw error;
    }
  },
};
