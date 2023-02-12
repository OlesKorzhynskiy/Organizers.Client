import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { ApiServiceBase } from './api-base-service';
import { BaseWebApiResponse } from '../models/base-web-api-response';
import { CreateOrderRequest } from '../models/Orders/create-order-request';

@Injectable()
export class OrdersService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '/orders');
    }

    create(request: CreateOrderRequest): Observable<BaseWebApiResponse> {
        return this.http.post(this.apiEndpoint, request)
            .pipe(map((response: any) => response as BaseWebApiResponse));
    }
}
