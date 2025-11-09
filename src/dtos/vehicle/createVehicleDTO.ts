import { VehicleType } from "axios/types/axios";

export interface CreateVehicleDTO {
  name: string;
  type: VehicleType;
  modelId: string;
}
