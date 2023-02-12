import { Contact } from "./contact";

export interface CreateOrderRequest {
    contact: Contact;
    settlementId: string;
    warehouseId: string;
    paymentType: number;
}
