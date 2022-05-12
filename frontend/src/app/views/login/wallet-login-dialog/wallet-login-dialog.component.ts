import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthStateService } from '../../../services/auth-state.service';
import { AuthService } from '../../../services/auth.service';
import { SiopService } from '../../../services/siop.service';
@Component({
    selector: 'app-wallet-login-dialog',
    templateUrl: './wallet-login-dialog.component.html',
    styleUrls: ['./wallet-login-dialog.component.css'],
})
export class WalletLoginDialog implements OnInit, OnDestroy {
    qrCodeURI: string = '';

    constructor(
        private siop: SiopService,
        public dialogRef: MatDialogRef<WalletLoginDialog>,
        private auth: AuthService,
        private authState: AuthStateService,
        private router: Router
    ) {}

    async ngOnInit() {
        this.siop.getSIOPAuthRequestUri().subscribe(
            (result) => {
                console.log(result);
                this.qrCodeURI = result.requestUri;

                // start polling
                this.siop.getStatus().subscribe(
                    (status: any) => {
                        console.log(status);
                        // if status has a username & access token navigate to profile page
                        if (status && status.username && status.accessToken) {
                            this.auth.setAccessToken(status.accessToken);
                            this.auth.setUsername(status.username);
                            this.authState.updateState(true);
                            this.siop.stopPollingStatus();
                            this.dialogRef.close();
                            this.router.navigate(['/']);
                        }
                    },
                    () => this.siop.stopPollingStatus()
                );
            },
            () => this.siop.stopPollingStatus()
        );
    }

    ngOnDestroy() {
        this.siop.stopPollingStatus();
    }
}
