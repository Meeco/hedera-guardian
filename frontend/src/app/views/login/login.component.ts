import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserRole } from 'interfaces';
import { Subscription } from 'rxjs';
import { AuthStateService } from 'src/app/services/auth-state.service';
import { AuthService } from '../../services/auth.service';
import { WalletLoginDialog } from './wallet-login-dialog/wallet-login-dialog.component';


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
    

    loginForm = this.fb.group({
        login: ['', Validators.required],
        password: ['', Validators.required],
    });

    private _subscriptions: Subscription[] = [];

    constructor(
        private authState: AuthStateService,
        private auth: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private dialog: MatDialog
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

    loginWithWallet() {
        let dialogRef = this.dialog.open(WalletLoginDialog, {});

        // dialogRef.afterClosed().subscribe(result => {
        //     console.log(`Modal result: ${result}`);
        // });
    }

}
