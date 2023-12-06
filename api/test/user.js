import assert from "node:assert/strict";
import needle from "needle";

const kBaseUrl = "http://localhost:3001/";
const kTestUserId = "29b23948-2f3c-439c-8569-2c595d604ea9";

describe("API: Users", function() {
    it.skip("should create the new user", async function() {
        await needle("post",
            `${kBaseUrl}users/`,
            {
                firstName: "Juan",
                middleName: "Dela",
                lastName: "Cruz",
                email: "juandc@email.com",
                username: "juandc",
                password: "juandc12345"
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
        });
    });
    
    it("should return all users", async function() {
        await needle("get",
            `${kBaseUrl}users/`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should return 1 user", async function() {
        await needle("get",
            `${kBaseUrl}users/${kTestUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should modfiy the information of user", async function() {
        await needle("put",
            `${kBaseUrl}users/${kTestUserId}`,
            {
                firstName: null,
                middleName: null,
                lastName: null,
                role: null,
                email: "juandc1@email.com",
                password: "juandc123456"
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should delete the user", async function () {
        await needle("delete",
            `${kBaseUrl}users/${kTestUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should return the order history of user", async function() {
        await needle("get",
            `${kBaseUrl}users/${kTestUserId}/order-history`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

});
