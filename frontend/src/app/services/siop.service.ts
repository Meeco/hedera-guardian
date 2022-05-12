import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { switchMap, retry, share, takeUntil } from 'rxjs/operators';
import { API_BASE_URL } from './api';

/**
 * Services for working from accounts.
 */
@Injectable()
export class SiopService implements OnDestroy {
    private readonly url: string = `${API_BASE_URL}/siop`;
    private status$: Observable<any>;
    private stopPolling = new Subject();

    private static MOCKED_NONCE = 'mocked-nonce';
    private static MOCKED_STATE = 'mocked-state';

    constructor(private http: HttpClient) {
        this.status$ = timer(300, 3000).pipe(
            switchMap(() =>
                this.http.post<any>(`${this.url}/status`, {
                    nonce: SiopService.MOCKED_NONCE,
                    state: SiopService.MOCKED_STATE,
                })
            ),
            retry(),
            share(),
            takeUntil(this.stopPolling)
        );
    }

    public getSIOPAuthRequestUri(): Observable<{ requestUri: string }> {
        return this.http.get<any>(`${this.url}/authenticationRequest`);
    }

    public getStatus(): Observable<any[]> {
        return this.status$;
    }

    public stopPollingStatus() {
        return this.stopPolling.next();
    }

    ngOnDestroy() {
        this.stopPolling.next();
    }
}
