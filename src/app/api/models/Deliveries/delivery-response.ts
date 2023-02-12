import { WarehouseTypeResponse } from "./warehouse-type-response";

export interface DeliveryResponse {
    id: string;
    name: string;
    warehouseTypes: WarehouseTypeResponse[];
}
