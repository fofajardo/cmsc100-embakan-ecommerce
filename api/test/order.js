import { v4 as uuidv4 } from "uuid";
import assert from "node:assert/strict";
import needle from "needle";

const kBaseUrl = "http://localhost:3001/orders/";
const kTestUserId = "29b23948-2f3c-439c-8569-2c595d604ea9";
const kTestProductId = "298f5fa5-d1ea-4bfc-ac54-e2e642d63334";

function getRandomQuantity() {
  return Math.floor(Math.random()
    * (Math.floor(50) - Math.ceil(1) + 1)
    + Math.ceil(1));
}

describe("API: Orders", function() {
    var productIds = [];
    var variantIds = [];
    var orderIds = [];
    
    it.skip("should create 5 dummy products (dependency)", async function() {
        // TODO: missing API for products.
    });
    
    it("should create 5 orders", async function() {
        for (let i = 0; i < 5; i++) {
            productIds.push(uuidv4());
            variantIds.push(uuidv4());
            await needle(
                "post",
                kBaseUrl,
                {
                    productId: productIds[i],
                    variantId: variantIds[i],
                    quantity: getRandomQuantity(),
                    userId: kTestUserId,
                    status: 0
                },
                {
                    json: true
                })
                .then(function(aResponse) {
                    assert.equal(aResponse.statusCode, 200);
                });
        }
    });
    
    it("should return 5 orders", async function() {
        await needle("get", kBaseUrl)
            .then(function(aResponse) {
                assert.notEqual(aResponse.body.data, null);
                assert.equal(aResponse.body.data.length, 5);
                for (let i = 0; i < 5; i++) {
                    assert.equal(
                        aResponse.body.data[i].productId, productIds[i]);
                    assert.equal(
                        aResponse.body.data[i].variantId, variantIds[i]);
                    assert.equal(
                        aResponse.body.data[i].userId, kTestUserId);
                    assert.equal(
                        aResponse.body.data[i].status, 0);
                    orderIds.push(aResponse.body.data[i].id);
                }
            });
    });
    
    it("should return 1 order", async function() {
        await needle("get", `${kBaseUrl}${orderIds[0]}`)
            .then(function(aResponse) {
                assert.notEqual(aResponse.body.data, null);
                assert.equal(
                    aResponse.body.data[0].productId, productIds[0]);
                assert.equal(
                    aResponse.body.data[0].variantId, variantIds[0]);
                assert.equal(
                    aResponse.body.data[0].userId, kTestUserId);
                assert.equal(
                    aResponse.body.data[0].status, 0);
            });
    });

    
    it("should modify the status of 1 order", async function() {
        await needle(
            "put",
            `${kBaseUrl}${orderIds[0]}`,
            {
                status: 1
            })
            .then(function(aResponse) {
                assert.equal(aResponse.statusCode, 200);
                assert.notEqual(aResponse.body.data, null);
                assert.equal(aResponse.body.data.modifiedCount, 1);
            });
    });
    
    it("should delete 5 orders", async function() {
        for (let i = 0; i < 5; i++) {
            await needle("delete", `${kBaseUrl}${orderIds[i]}`)
                .then(function(aResponse) {
                    assert.equal(aResponse.statusCode, 200);
                });
        }
    });
});
