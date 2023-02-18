import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { ApiServiceBase } from './api-base-service';
import { WebApiResponse } from '../models/web-api-response';
import { DeliveryResponse } from '../models/deliveries/delivery-response';

@Injectable()
export class DeliveriesService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config.rootUrl, http, '/deliveries');
    }

    getAll(): Observable<WebApiResponse<Array<DeliveryResponse>>> {
        return this.http.get(this.apiEndpoint)
            .pipe(map((response: any) => response as WebApiResponse<Array<DeliveryResponse>>));
    }
}
