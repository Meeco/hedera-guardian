import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { QRCodeModule } from 'angularx-qrcode';
import { ToastrModule } from 'ngx-toastr';
import {
    AppRoutingModule,
    AuditorGuard,
    RootAuthorityGuard,
    UserGuard,
} from './app-routing.module';
import { AppComponent } from './app.component';
import { IconPreviewDialog } from './components/icon-preview-dialog/icon-preview-dialog.component';
import { TokenDialog } from './components/token-dialog/token-dialog.component';
import { MaterialModule } from './material.module';
import { NewPolicyDialog } from './policy-engine/helpers/new-policy-dialog/new-policy-dialog.component';
import { PolicyEngineModule } from './policy-engine/policy-engine.module';
import { AuditService } from './services/audit.service';
import { AuthInterceptor, AuthService } from './services/auth.service';
import { DemoService } from './services/demo.service';
import { HandleErrorsService } from './services/handle-errors.service';
import { IPFSService } from './services/ipfs.service';
import { LoggerService } from './services/logger.service';
import { PolicyEngineService } from './services/policy-engine.service';
import { PolicyHelper } from './services/policy-helper.service';
import { ProfileService } from './services/profile.service';
import { SchemaService } from './services/schema.service';
import { SettingsService } from './services/settings.service';
import { TokenService } from './services/token.service';
import { SiopService } from './services/siop.service';
import { AdminHeaderComponent } from './views/admin/admin-header/admin-panel.component';
import { DetailsLogDialog } from './views/admin/details-log-dialog/details-log-dialog.component';
import { LogsViewComponent } from './views/admin/logs-view/logs-view.component';
import { ServiceStatusComponent } from './views/admin/service-status/service-status.component';
import { SettingsViewComponent } from './views/admin/settings-view/settings-viewcomponent';
import { AuditComponent } from './views/audit/audit.component';
import { HeaderComponent } from './views/header/header.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { WalletLoginDialog } from './views/login/wallet-login-dialog/wallet-login-dialog.component';
import { RegisterComponent } from './views/register/register.component';
import { RootConfigComponent } from './views/root-config/root-config.component';
import { SchemaConfigComponent } from './views/schema-config/schema-config.component';
import { TokenConfigComponent } from './views/token-config/token-config.component';
import { TrustChainComponent } from './views/trust-chain/trust-chain.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';

@NgModule({
    declarations: [
        AppComponent,
        UserProfileComponent,
        LoginComponent,
        HomeComponent,
        HeaderComponent,
        RegisterComponent,
        RootConfigComponent,
        TokenConfigComponent,
        TokenDialog,
        SchemaConfigComponent,
        AuditComponent,
        TrustChainComponent,
        NewPolicyDialog,
        LogsViewComponent,
        SettingsViewComponent,
        AdminHeaderComponent,
        WalletLoginDialog,
        IconPreviewDialog,
        DetailsLogDialog,
        ServiceStatusComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        MaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ToastrModule.forRoot(),
        PolicyEngineModule,
        QRCodeModule,
    ],
    exports: [],
    providers: [
        UserGuard,
        RootAuthorityGuard,
        AuditorGuard,
        AuthService,
        ProfileService,
        TokenService,
        SchemaService,
        AuditService,
        PolicyEngineService,
        PolicyHelper,
        IPFSService,
        SettingsService,
        LoggerService,
        DemoService,
        SiopService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HandleErrorsService,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
