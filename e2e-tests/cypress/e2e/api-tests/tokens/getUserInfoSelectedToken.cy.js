import { METHOD, STATUS_CODE } from "../../../support/api/api-const";
import API from "../../../support/ApiUrls";

context("Tokens", { tags: "@tokens" }, () => {
    const authorization = Cypress.env("authorization");
    const user = Cypress.env("root_user");

    it("Get user information for the token", () => {
        cy.request({
            method: METHOD.GET,
            url: API.ApiServer + API.ListOfTokens,
            headers: {
                authorization,
            },
        }).then((resp) => {
            expect(resp.status).eql(STATUS_CODE.OK);
            expect(resp.body[0]).to.have.property("_id");
            expect(resp.body[0]).to.have.property("tokenId");
            expect(resp.body[0]).to.have.property("tokenName");

            const topicUid = resp.body[0].tokenId;

            cy.request({
                method: METHOD.GET,
                url:
                    API.ApiServer +
                    API.ListOfTokens +
                    topicUid +
                    "/" +
                    user +
                    "/info",
                headers: {
                    authorization,
                },
            }).then((resp) => {
                expect(resp.status).eql(STATUS_CODE.OK);
                expect(resp.body).to.not.be.oneOf([null, ""]);
            });
        });
    });
});
