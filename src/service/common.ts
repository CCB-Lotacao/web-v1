import api from "./api";
import { CommonDTO } from "../dtos/common/commonDTO";

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
};
