import assert from "node:assert/strict";
import needle from "needle";

const kBaseUrl = "http://localhost:3001/";
const kTestUserId = "29b23948-2f3c-439c-8569-2c595d604ea9";
const kTestProductId = "298f5fa5-d1ea-4bfc-ac54-e2e642d63334";
const kTestVariant1Id = "4a96ba74-a1b0-4a39-9958-85a0a1b3242a";

describe("API: Products", function() {
    it("should return all products", async function() {
        await needle("get",
            `${kBaseUrl}products/`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should return 1 product", async function() {
        await needle("get",
            `${kBaseUrl}products/${kTestProductId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should create the new product", async function() {
        await needle("post",
            `${kBaseUrl}products/`,
            {
                name: "",
                slug: "",
                type: 0,
                price: 0,
                description: "",
                stock: 0,
                variants: [{
                    id: "",
                    name: "",
                    price: 0
                }]
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
        });
    });

    it("should modfiy the information of product", async function() {
        await needle("post",
            `${kBaseUrl}products/${kTestProductId}`,
            {
                name: "Kangkong",
                slug: null,
                type: null,
                price: null,
                description: null,
                stock: 10,
                variants: [{
                    id: "",
                    name: "",
                    price: 0
                }]
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should delete the product", async function () {
        await needle("delete",
            `${kBaseUrl}products/${kTestProductId}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

    it("should create the new product variant", async function() {
        await needle("post",
            `${kBaseUrl}products/variants/${kTestVariant1Id}`,
            {
                name: "",
                price: 0
            },
            {
                json: true
            }
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
        });
    });

    it("should modify the information of product variant", async function() {
        await needle("post",
            `${kBaseUrl}products/variants/${kTestVariant1Id}`,
            {
                name: "Variant 1",
                price: 20
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
            `${kBaseUrl}products/variants/${kTestVariant1Id}`,
        ).then(function(aResponse) {
            assert.equal(aResponse.statusCode, 200);
            assert.notEqual(aResponse.body.data, null);
        });
    });

});
