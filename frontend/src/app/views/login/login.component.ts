import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRole } from 'interfaces';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { Subscription } from 'rxjs';
import { AuthenticationRequest, RP } from '@sphereon/did-auth-siop';
import {
    PassBy,
    SubjectIdentifierType,
    CredentialFormat,
    PresentationLocation,
} from '@sphereon/did-auth-siop/dist/main/types/SIOP.types';

/**
 * Login page.
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
    loading: boolean = false;
    errorMessage: string = '';
    qrCodeURI: string = '';

    loginForm = this.fb.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
    });

    private _subscriptions: Subscription[] = [];

    constructor(
        private authState: AuthStateService,
        private auth: AuthService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    async ngOnInit() {
        this.loading = false;
        this._subscriptions.push(
            this.authState.credentials.subscribe((credentials) =>
                this.setLogin(credentials.login, credentials.password)
            ),
            this.authState.login.subscribe((credentials) =>
                this.login(credentials.login, credentials.password)
            )
        );

        this.qrCodeURI = await this.generateQRCodeURI();
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach((sub) => sub.unsubscribe());
    }

    onLogin() {
        this.errorMessage = '';
        if (this.loginForm.valid) {
            const d = this.loginForm.value;
            this.login(d.login, d.password);
        }
    }

    login(login: string, password: string) {
        this.loading = true;
        this.auth.login(login, password).subscribe(
            (result) => {
                console.log(result);
                this.auth.setAccessToken(result.accessToken);
                this.auth.setUsername(login);
                this.authState.updateState(true);
                if (result.role == UserRole.ROOT_AUTHORITY) {
                    this.router.navigate(['/config']);
                } else {
                    this.router.navigate(['/']);
                }
            },
            (error) => {
                this.loading = false;
                this.errorMessage = error.message;
            }
        );
    }

    setLogin(login: string, password: string) {
        this.loginForm.setValue({
            login: login,
            password: password,
        });
    }

    async generateQRCodeURI() {
        const rpKeys = {
            hexPrivateKey:
                'a1458fac9ea502099f40be363ad3144d6d509aa5aa3d17158a9e6c3b67eb0397',
            did: 'did:ethr:ropsten:0x028360fb95417724cb7dd2ff217b15d6f17fc45e0ffc1b3dce6c2b8dd1e704fa98',
            didKey: 'did:ethr:ropsten:0x028360fb95417724cb7dd2ff217b15d6f17fc45e0ffc1b3dce6c2b8dd1e704fa98#controller',
        };
        const rp = RP.builder()
            .redirect(
                'https://verifier-simulator-stage.meeco.me/requests/dc36aef7-fa5a-4672-8d73-aa116441e493/presentations'
            )
            .requestBy(PassBy.VALUE)
            .internalSignature(rpKeys.hexPrivateKey, rpKeys.did, rpKeys.didKey)
            .addDidMethod('ethr')
            .registrationBy(PassBy.VALUE)
            .addPresentationDefinitionClaim({
                definition: {
                    id: '26127da0-e837-4a3b-89f6-74e2627fe646',
                    input_descriptors: [
                        {
                            id: 'IdCredential',
                            schema: [
                                {
                                    uri: 'https://vc-schemas.meeco.me/credentials/id/1.0/schema.json',
                                },
                            ],
                        },
                    ],
                },
                location: PresentationLocation.VP_TOKEN, // Toplevel vp_token response expected. This also can be ID_TOKEN
            })
            .build();

        const reqURI = await rp.createAuthenticationRequest({
            nonce: 'qBrR7mqnY3Qr49dAZycPF8FzgE83m6H0c2l0bzP4xSg',
            state: 'b32f0087fc9816eb813fd11f',
        });

        console.log(reqURI.encodedUri);
        return reqURI.encodedUri;
    }
}
