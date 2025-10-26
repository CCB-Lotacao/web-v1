import axios from "axios";

import { IBGECity, IBGEState } from "../dtos/shared";

const API_URL = "https://servicodados.ibge.gov.br/api/v1";

const ibgeApi = axios.create({
  baseURL: API_URL,
});

export const IBGEService = {
  getStates: async (): Promise<IBGEState[]> => {
    try {
      const response = await ibgeApi.get<IBGEState[]>("/localidades/estados");
      return response.data;
    } catch (error) {
      console.error("Error Fetching states: ", error);
      return [];
    }
  },

  getCitiesByUF: async (uf: string): Promise<IBGECity[]> => {
    try {
      const response = await ibgeApi.get<IBGECity[]>(
        `/localidades/estados/${uf}/municipios`
      );
      return response.data;
    } catch (error) {
      console.error("Error Fetching cities: ", error);
      return [];
    }
  },
};
