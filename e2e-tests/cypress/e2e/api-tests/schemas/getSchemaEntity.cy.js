import { METHOD, STATUS_CODE } from "../../../support/api/api-const";
import API from "../../../support/ApiUrls";

context("Schemas",  { tags: '@schemas' }, () => {
    const authorization = Cypress.env("authorization");

    it("Find the schema using the schema type", () => {
        const items = [
            "STANDARD_REGISTRY",
            "USER",
            "POLICY",
            "MINT_TOKEN",
            "WIPE_TOKEN",
            "MINT_NFTOKEN",
        ];
        let randomItem = items[Math.floor(Math.random() * items.length)];
        cy.request({
            method: METHOD.GET,
            url:
            API.ApiServer +
                API.SchemasSystemEntity +
                randomItem,
            headers: {
                authorization,
            },
        }).then((resp) => {
            expect(resp.status).eql(STATUS_CODE.OK);
        });
    });
});
