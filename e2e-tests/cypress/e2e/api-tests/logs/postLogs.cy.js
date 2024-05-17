import { METHOD, STATUS_CODE } from "../../../support/api/api-const";
import API from "../../../support/ApiUrls";

context("Logs",  { tags: '@logs' }, () => {
    const authorization = Cypress.env("authorization");

    it("Return logs", () => {
        cy.request({
            method: METHOD.POST,
            url: API.ApiServer + API.Logs,
            headers: {
                authorization,
            },
        }).then((resp) => {
            expect(resp.status).eql(STATUS_CODE.OK);
        });
    });
});
