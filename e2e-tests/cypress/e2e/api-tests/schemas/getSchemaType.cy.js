import { METHOD, STATUS_CODE } from "../../../support/api/api-const";
import API from "../../../support/ApiUrls";

context("Schemas", { tags: '@schemas' }, () => {
    const authorization = Cypress.env("authorization");

    it("Get the schema using the json document type", () => {
        cy.request({
            method: METHOD.GET,
            url: API.ApiServer + API.SchemasType,
            headers: { authorization, type: "array" },
        }).then((resp) => {
            expect(resp.status).eql(STATUS_CODE.OK);
        });
    });
});
