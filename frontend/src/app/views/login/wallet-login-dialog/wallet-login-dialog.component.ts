import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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

    constructor(public dialogRef: MatDialogRef<WalletLoginDialog>) {}

    async ngOnInit() {
        this.qrCodeURI = await this.generateQRCodeURI();

        /**
         * Start some sort of polling or whatever to check if user has submitted token to the backend
         */
    }

    ngOnDestroy() {
        console.log('dialog closed #onDestroy');
        /**
         * Stop polling
         */
    }

    async generateQRCodeURI() {
        // const rpKeys = {
        //     hexPrivateKey:
        //         'a1458fac9ea502099f40be363ad3144d6d509aa5aa3d17158a9e6c3b67eb0397',
        //     did: 'did:ethr:ropsten:0x028360fb95417724cb7dd2ff217b15d6f17fc45e0ffc1b3dce6c2b8dd1e704fa98',
        //     didKey: 'did:ethr:ropsten:0x028360fb95417724cb7dd2ff217b15d6f17fc45e0ffc1b3dce6c2b8dd1e704fa98#controller',
        // };
        // const rp = RP.builder()
        //     .redirect(
        //         'https://verifier-simulator-stage.meeco.me/requests/dc36aef7-fa5a-4672-8d73-aa116441e493/presentations'
        //     )
        //     .requestBy(PassBy.VALUE)
        //     .internalSignature(rpKeys.hexPrivateKey, rpKeys.did, rpKeys.didKey)
        //     .addDidMethod('ethr')
        //     .registrationBy(PassBy.VALUE)
        //     .addPresentationDefinitionClaim({
        //         definition: {
        //             id: '26127da0-e837-4a3b-89f6-74e2627fe646',
        //             input_descriptors: [
        //                 {
        //                     id: 'IdCredential',
        //                     schema: [
        //                         {
        //                             uri: 'https://vc-schemas.meeco.me/credentials/id/1.0/schema.json',
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //         location: PresentationLocation.VP_TOKEN, // Toplevel vp_token response expected. This also can be ID_TOKEN
        //     })
        //     .build();

        // const reqURI = await rp.createAuthenticationRequest({
        //     nonce: 'qBrR7mqnY3Qr49dAZycPF8FzgE83m6H0c2l0bzP4xSg',
        //     state: 'b32f0087fc9816eb813fd11f',
        // });

        // console.log(reqURI.encodedUri);
        // return reqURI.encodedUri;

        return 'openid://?response_type=id_token&scope=openid&client_id=did%3Akey%3Az6MkicfnX9jNJB7whQJoMeqwgYmLerKphQDwwtTzRBf4KCVQ&redirect_uri=localhost%3A4200%2Fhome.html&iss=did%3Akey%3Az6MkicfnX9jNJB7whQJoMeqwgYmLerKphQDwwtTzRBf4KCVQ&response_mode=post&response_context=rp&nonce=w-3X9xSDDdqG_00OxMj1FQjIxlbLRIuoELVoHhKHuv8&state=18a4ce20df90d63799df40b7&registration=%7B%22did_methods_supported%22%3A%5B%22did%3Akey%3A%22%5D%2C%22subject_identifiers_supported%22%3A%22did%22%2C%22credential_formats_supported%22%3A%5B%5D%7D&claims=%7B%22vp_token%22%3A%7B%22presentation_definition%22%3A%7B%22id%22%3A%229a809146-4ea5-4bd4-bcd8-4e6c28c347af%22%2C%22input_descriptors%22%3A%5B%7B%22id%22%3A%228d78910f-d5b5-4db5-81fe-44dfabd5559a%22%2C%22schema%22%3A%5B%7B%22uri%22%3A%22https%3A%2F%2Fdid.itsourweb.org%3A3000%2Fsmartcredential%2FOntario-Health-Insurance-Plan%22%7D%5D%7D%5D%7D%7D%7D&request=eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa2ljZm5YOWpOSkI3d2hRSm9NZXF3Z1ltTGVyS3BoUUR3d3RUelJCZjRLQ1ZRI3o2TWtpY2ZuWDlqTkpCN3doUUpvTWVxd2dZbUxlcktwaFFEd3d0VHpSQmY0S0NWUSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTE2NDEyODYsImV4cCI6MTY1MTY0MTg4NiwicmVzcG9uc2VfdHlwZSI6ImlkX3Rva2VuIiwic2NvcGUiOiJvcGVuaWQiLCJjbGllbnRfaWQiOiJkaWQ6a2V5Ono2TWtpY2ZuWDlqTkpCN3doUUpvTWVxd2dZbUxlcktwaFFEd3d0VHpSQmY0S0NWUSIsInJlZGlyZWN0X3VyaSI6ImxvY2FsaG9zdDo0MjAwL2hvbWUuaHRtbCIsImlzcyI6ImRpZDprZXk6ejZNa2ljZm5YOWpOSkI3d2hRSm9NZXF3Z1ltTGVyS3BoUUR3d3RUelJCZjRLQ1ZRIiwicmVzcG9uc2VfbW9kZSI6InBvc3QiLCJyZXNwb25zZV9jb250ZXh0IjoicnAiLCJub25jZSI6InctM1g5eFNERGRxR18wME94TWoxRlFqSXhsYkxSSXVvRUxWb0hoS0h1djgiLCJzdGF0ZSI6IjE4YTRjZTIwZGY5MGQ2Mzc5OWRmNDBiNyIsInJlZ2lzdHJhdGlvbiI6eyJkaWRfbWV0aG9kc19zdXBwb3J0ZWQiOlsiZGlkOmtleToiXSwic3ViamVjdF9pZGVudGlmaWVyc19zdXBwb3J0ZWQiOiJkaWQiLCJjcmVkZW50aWFsX2Zvcm1hdHNfc3VwcG9ydGVkIjpbXX0sImNsYWltcyI6eyJ2cF90b2tlbiI6eyJwcmVzZW50YXRpb25fZGVmaW5pdGlvbiI6eyJpZCI6IjlhODA5MTQ2LTRlYTUtNGJkNC1iY2Q4LTRlNmMyOGMzNDdhZiIsImlucHV0X2Rlc2NyaXB0b3JzIjpbeyJpZCI6IjhkNzg5MTBmLWQ1YjUtNGRiNS04MWZlLTQ0ZGZhYmQ1NTU5YSIsInNjaGVtYSI6W3sidXJpIjoiaHR0cHM6Ly9kaWQuaXRzb3Vyd2ViLm9yZzozMDAwL3NtYXJ0Y3JlZGVudGlhbC9PbnRhcmlvLUhlYWx0aC1JbnN1cmFuY2UtUGxhbiJ9XX1dfX19fQ.MQdmgJU2wGUNlhJBQYRGI3rQn6EgcL9oHzUV-WxaPZ_ld_LjJ8lwRZ0f5hCQKFBhY8EUfM0O38DCfnpW556CAg';
    }
}
