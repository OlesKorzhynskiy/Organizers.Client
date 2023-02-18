import { HttpClient } from '@angular/common/http';

export class ApiServiceBase {
    readonly apiEndpoint: string;

    constructor(protected rootUrl: string, protected http: HttpClient, apiUrl: string = '') {
        this.apiEndpoint = `${rootUrl}${apiUrl}`;
    }
}
