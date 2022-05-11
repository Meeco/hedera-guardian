import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SiopService } from '../../../services/siop.service';
// import { RP } from '@sphereon/did-auth-siop';
// import {
//     PassBy,
//     PresentationLocation,
// } from '@sphereon/did-auth-siop/dist/main/types/SIOP.types';

@Component({
    selector: 'app-wallet-login-dialog',
    templateUrl: './wallet-login-dialog.component.html',
    styleUrls: ['./wallet-login-dialog.component.css'],
})
export class WalletLoginDialog implements OnInit, OnDestroy {
    qrCodeURI: string = '';

    constructor(
        private siop: SiopService,
        public dialogRef: MatDialogRef<WalletLoginDialog>
    ) {}

    async ngOnInit() {
        this.siop.getSIOPAuthRequestUri().subscribe((result) => {
            console.log(result);
            this.qrCodeURI = result.requestUri;

            // start polling
            this.siop.getStatus().subscribe((status) => {
                console.log(status);
            });
        });
    }

    ngOnDestroy() {
        this.siop.stopPollingStatus();
    }
}
