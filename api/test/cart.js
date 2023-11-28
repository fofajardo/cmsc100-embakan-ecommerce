import assert from "node:assert/strict";
import needle from "needle";

const kBaseUrl = "http://localhost:3001/";
const kTestUserId = "29b23948-2f3c-439c-8569-2c595d604ea9";
const kTestProductId = "298f5fa5-d1ea-4bfc-ac54-e2e642d63334";

describe("API: Carts", function() {
    it("should create the new cart", async function() {
        await needle("post",
            `${kBaseUrl}carts/${kTestUserId}`,
            {
                items: JSON.stringify(
                    [{
                        productId: kTestProductId,
                        quantity: 10
                    }]
                )
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
        });
    });

    it("should return the cart", async function() {
        await needle("get",
            `${kBaseUrl}carts/${kTestUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should remove all items from the cart", async function() {
        await needle("put",
            `${kBaseUrl}carts/${kTestUserId}`,
            {
                items: JSON.stringify([])
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.equal(aResponse.body.data.modifiedCount, 1);
        });
    });

    it("should return the cart with no items", async function() {
        await needle("get",
            `${kBaseUrl}carts/${kTestUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
            assert.equal(aResponse.body.data.items.length, 0);
        });
    });

    it("should insert an item to the cart", async function() {
        await needle("post",
            `${kBaseUrl}carts/${kTestUserId}/items`,
            {
                productId: kTestProductId,
                quantity: 5
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.equal(aResponse.body.data.modifiedCount, 1);
        });
    });

    it("should return the cart with a test product of quantity 5", async function() {
        await needle("get",
            `${kBaseUrl}carts/${kTestUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
            assert.equal(aResponse.body.data.items.length, 1);
            assert.equal(aResponse.body.data.items[0].productId, kTestProductId);
            assert.equal(aResponse.body.data.items[0].quantity, 5);
        });
    });

    it("should modify the quantity of the test product in the cart", async function() {
        await needle("post",
            `${kBaseUrl}carts/${kTestUserId}/items`,
            {
                productId: kTestProductId,
                quantity: 350
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.equal(aResponse.body.data.modifiedCount, 1);
        });
    });

    it("should return the cart with a test product of quantity 350", async function() {
        await needle("get",
            `${kBaseUrl}carts/${kTestUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
            assert.equal(aResponse.body.data.items.length, 1);
            assert.equal(aResponse.body.data.items[0].productId, kTestProductId);
            assert.equal(aResponse.body.data.items[0].quantity, 350);
        });
    });

    it("should delete the test product from the cart", async function () {
        await needle("delete",
            `${kBaseUrl}carts/${kTestUserId}/items`,
            {
                productId: kTestProductId
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
        });
    });

    it("should not delete anything from the cart (product ID not in cart)", async function () {
        await needle("delete",
            `${kBaseUrl}carts/${kTestUserId}/items`,
            {
                productId: kTestProductId
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 400);
        });
    });

    it("should return the cart with no items (after deletion from /items)", async function() {
        await needle("get",
            `${kBaseUrl}carts/${kTestUserId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
            assert.equal(aResponse.body.data.items.length, 0);
        });
    });

    it("should delete the cart", async function() {
        await needle("delete",
            `${kBaseUrl}carts/${kTestUserId}`
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
        });
    });
});
