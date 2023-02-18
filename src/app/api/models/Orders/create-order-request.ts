import { Contact } from "./contact";
import { OrderItemRequest } from './order-item-request';
import { PaymentType } from "./payment-type";

export interface CreateOrderRequest {
    contact: Contact;
    settlementId: string;
    warehouseId: string;
    paymentType: PaymentType;
    items: OrderItemRequest[];
}
