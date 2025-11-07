import api from "./api";
import { CommonDTO } from "../dtos/common/commonDTO";
import { CreateCommonDTO, UpdateCommonDTO } from "@dtos/common";

export const CommonService = {
  findCommons: async (): Promise<CommonDTO[]> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.get<CommonDTO[]>("/commons");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCommon: async (
    createCommonDTO: CreateCommonDTO
  ): Promise<CommonDTO> => {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await api.post<CommonDTO>("/commons", createCommonDTO);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCommon: async (
    commonId: string,
    updateCommonDTO: UpdateCommonDTO
  ): Promise<void> => {
    // eslint-disable-next-line no-useless-catch
    try {
      await api.patch(`/commons/${commonId}`, updateCommonDTO);
    } catch (error) {
      throw error;
    }
  },

  deleteCommon: async (commonId: string): Promise<void> => {
    // eslint-disable-next-line no-useless-catch
    try {
      await api.delete(`/commons/${commonId}`);
    } catch (error) {
      throw error;
    }
  },
};
