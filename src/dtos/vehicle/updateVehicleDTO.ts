import { VehicleType } from "axios/types/axios";

export interface UpdateVehicleDTO {
  name?: string;
  type?: VehicleType;
  modelId?: string;
}
