import { VehicleType } from "axios/types/axios";

export interface VehicleDTO {
  id: string;
  name: string;
  type: VehicleType;
  modelId: string;
}
