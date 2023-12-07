import assert from "node:assert/strict";
import needle from "needle";

const kBaseUrl = "http://localhost:3001/users/";
const kTestUserId = "29b23948-2f3c-439c-8569-2c595d604ea9";

describe("API: Users", function() {
    var testUserId = "";
    it("should create the new user", async function() {
        await needle("post",
            `${kBaseUrl}`,
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
            testUserId = aResponse.body.data.id;
            assert.equal(aResponse.statusCode, 200);
        });
    });
    
    it("should return all users", async function() {
        await needle("get",
            `${kBaseUrl}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should return 1 user", async function() {
        await needle("get",
            `${kBaseUrl}${testUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should modfiy the information of user", async function() {
        await needle("put",
            `${kBaseUrl}${testUserId}`,
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
            `${kBaseUrl}${testUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it.skip("should return the order history of user", async function() {
        await needle("get",
            `${kBaseUrl}${kTestUserId}/order-history`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

});
