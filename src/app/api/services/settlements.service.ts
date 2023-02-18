import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { ApiServiceBase } from './api-base-service';
import { WebApiResponse } from '../models/web-api-response';
import { SettlementResponse } from '../models/settlements/settlement-response';

@Injectable()
export class SettlementsService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config.rootUrl, http, '');
    }

    getAll(deliveryId: string, name: string): Observable<WebApiResponse<Array<SettlementResponse>>> {
        let params = new HttpParams();
        params = params.append('name', name);

        let baseUrl = `${this.apiEndpoint}/deliveries/${deliveryId}/settlements`;
        return this.http.get(baseUrl, { params })
            .pipe(map((response: any) => response as WebApiResponse<Array<SettlementResponse>>));
    }
}
