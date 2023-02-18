import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { ApiServiceBase } from './api-base-service';
import { CreateOrderRequest } from '../models/orders/create-order-request';
import { OrderCreationResponse } from '../models/orders/order-creation-response';
import { WebApiResponse } from '../models/web-api-response';

@Injectable()
export class OrdersService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config.rootUrl, http, '/orders');
    }

    create(request: CreateOrderRequest): Observable<WebApiResponse<OrderCreationResponse>> {
        return this.http.post(this.apiEndpoint, request)
            .pipe(map((response: any) => response as WebApiResponse<OrderCreationResponse>));
    }
}
