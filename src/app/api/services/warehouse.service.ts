import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfiguration } from '../api-configuration';
import { ApiServiceBase } from './api-base-service';
import { WebApiResponse } from '../models/web-api-response';
import { WarehouseResponse } from '../models/Warehouses/warehouse-response';

@Injectable()
export class WarehousesService extends ApiServiceBase {
    constructor(config: ApiConfiguration, http: HttpClient) {
        super(config, http, '');
    }

    getAll(deliveryId: string, settlementId: string, name: string, warehouseTypes: string[]): Observable<WebApiResponse<Array<WarehouseResponse>>> {
        let params = new HttpParams();
        params = params.append('name', name);

        for (let warehouseType of warehouseTypes) {
            params = params.append('warehouseTypes', warehouseType);
        }

        let baseUrl = `${this.apiEndpoint}/deliveries/${deliveryId}/settlements/${settlementId}/warehouses`;
        return this.http.get(baseUrl, { params })
            .pipe(map((response: any) => response as WebApiResponse<Array<WarehouseResponse>>));
    }
}
