import { METHOD, STATUS_CODE } from "../../../support/api/api-const";
import API from "../../../support/ApiUrls";

context("Logs",  { tags: '@logs' }, () => {
    const authorization = Cypress.env("authorization");

    it("Returns logs attributes", () => {
        cy.request({
            method: METHOD.GET,
            url: API.ApiServer + API.LogsAttributes,
            headers: {
                authorization,
            },
        }).then((resp) => {
            expect(resp.status).eql(STATUS_CODE.OK);
            expect(resp.body).to.not.be.oneOf([null, ""]);
        });
    });
});
