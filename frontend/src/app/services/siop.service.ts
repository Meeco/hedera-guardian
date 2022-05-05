import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api';

/**
 * Services for working from accounts.
 */
@Injectable()
export class SiopService {
    private readonly url: string = `${API_BASE_URL}/siop`;

    constructor(private http: HttpClient) {}

    public getSIOPAuthRequestUri(): Observable<{ requestUri: string }> {
        return this.http.get<any>(`${this.url}/authenticationRequest`);
    }
}
