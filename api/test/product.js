import assert from "node:assert/strict";
import needle from "needle";
import { v4 as uuidv4 } from "uuid";

const kBaseUrl = "http://localhost:3001/products/";
const kTestUserId = "29b23948-2f3c-439c-8569-2c595d604ea9";

describe("API: Products", function() {
    var testProductId = "";
    var testVariantId = "";

    it("should create the new product", async function() {
        await needle("post",
            `${kBaseUrl}`,
            {
              name: "Kalabasa",
              slug: "kalabasa",
              type: 0,
              description: "Pampalinaw ng mata",
              variants: [
                {
                  id: uuidv4(),
                  name: "San Leonardo",
                  price: 30,
                  stock: 100
                }
              ]
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            testProductId = aResponse.body.data.id;
            assert.equal(aResponse.statusCode, 200);
        });
    });

    it("should return all products", async function() {
        await needle("get",
            `${kBaseUrl}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should return 1 product", async function() {
        await needle("get",
            `${kBaseUrl}${testProductId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should modify the information of product", async function() {
        await needle("put",
            `${kBaseUrl}${testProductId}`,
            {
                name: null,
                slug: null,
                type: null,
                price: null,
                description: "desc was updated",
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should create the new product variant", async function() {
        await needle("post",
            `${kBaseUrl}${testProductId}/variants`,
            {
                name: "Upland",
                price: 30,
                stock: 100
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            let targetIndex = aResponse.body.data.variants.length - 1;
            testVariantId = aResponse.body.data.variants[targetIndex].id;
            assert.equal(aResponse.statusCode, 200);
        });
    });

    it("should modify the information of product variant", async function() {
        await needle("put",
            `${kBaseUrl}${testProductId}/variants/${testVariantId}`,
            {
                price: 35,
                stock: 90
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should delete the product variant", async function () {
        await needle("delete",
            `${kBaseUrl}${testProductId}/variants/${testVariantId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should delete the product", async function () {
        await needle("delete",
            `${kBaseUrl}${testProductId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

});
