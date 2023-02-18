import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ApiConfiguration {
    rootUrl: string = '';
    paymentRootUrl: string = '';
}

export interface ApiConfigurationParams {
    rootUrl: string;
    paymentRootUrl: string;
}
