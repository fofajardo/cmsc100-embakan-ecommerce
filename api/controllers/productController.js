import { v4 as uuidv4 } from "uuid";
import { Product } from "../models.js";
import { sendError, sendOk, hasNull } from "./utils.js";

/*
 * Product
 */

async function getAllProducts(aRequest, aResponse) {
    try {
        let result = await Product.find({});
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function getOneProduct(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let product = await Product.findOne({ id }).exec();
        if (product) {
            result = product;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function getOneProductBySlug(aRequest, aResponse) {
    const { slug } = aRequest.params;
    if (!slug) {
        sendError(aResponse, "Parameter ':slug' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let product = await Product.findOne({ slug }).exec();
        if (product) {
            result = product;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function createNewProduct(aRequest, aResponse) {
    const { body } = aRequest;
    const requiredProps = [
        "name", "slug", "type", "description"
    ];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more fields is missing or empty", 400);
        return;
    }

    try {
        const slugExists = await Product.exists({ slug: body.slug });
        if (slugExists) {
            sendError(aResponse, "Product already exists", 400);
            return;
        }

        const product = new Product({
            id: uuidv4(),
            name: body.name,
            slug: body.slug,
            type: body.type,
            description: body.description,
            variants: body.variants
        });
        const result = await product.save();

        let wasInserted = product === result;
        if (!wasInserted) {
            sendError(aResponse, "New product was not added", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function updateOneProduct(aRequest, aResponse) {
    var productDataUpdated = [];
    const { id } = aRequest.params;
    const { body } = aRequest;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }
    else {
        let productFound = await Product.findOne({ id: id});
        if (!productFound) {
            sendError(aResponse, "Product not found", 400);
            return;
        }
        else {
            if (body.name) {
                let result = await Product.updateOne({
                    id
                }, {
                    $set: {
                        name: body.name
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    productDataUpdated.push("name");
                }
            }
            if (body.slug) {
                let result = await Product.updateOne({
                    id
                }, {
                    $set: {
                        slug: body.slug
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    productDataUpdated.push("slug");
                }
            }
            if (body.type) {
                let result = await Product.updateOne({
                    id
                }, {
                    $set: {
                        type: body.type
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    productDataUpdated.push("type");
                }
            }
            if (body.description) {
                let result = await Product.updateOne({
                    id
                }, {
                    $set: {
                        description: body.description
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    productDataUpdated.push("description");
                }
            }
            if (body.price >= 0) {
                let result = await Product.updateOne({
                    id
                }, {
                    $set: {
                        price: body.price
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    productDataUpdated.push("price");
                }
            }
            if (body.variants) {
                let result = await Product.updateOne({
                    id
                }, {
                    $set: {
                        variants: body.variants
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    productDataUpdated.push("variants");
                }
            }
            sendOk(aResponse, productDataUpdated);
        }
    }
}


async function deleteOneProduct(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = await Product.deleteOne({
            id
        });
        let wasDeleted = result.deletedCount == 1;
        if (!wasDeleted) {
            sendError(aResponse, "Product was not deleted", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function createNewProductVariant(aRequest, aResponse) {
    const { id } = aRequest.params; 
    const { body } = aRequest;

    const requiredProps = [
        "name", "price", "stock"
    ];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more fields is missing or empty", 400);
        return;
    }
    else {
        try {
            let product = await Product.findOne({ id });
            if (!product) {
                sendError(aResponse, "Product not found", 400);
                return;
            }

            let productVariantIndex = product.variants.findIndex(function (aElement) {
                return (aElement.name == body.name);
            });
            
            if (productVariantIndex != -1) {
                sendError(aResponse, "Product already exists", 400);
                return;
            }

            product.variants.push({
                id: uuidv4(),
                name: body.name,
                price: body.price,
                stock: body.stock,
                imageUrl: body.imageUrl
            });

            let result = await product.save();

            let wasUpdated = product === result;
            if (!wasUpdated) {
                sendError(aResponse, "Product variant was not added", 400);
                return;
            }
            sendOk(aResponse, result);
        } catch (e) {
            sendError(aResponse, e.message, 500);
        }
    }
}


async function getOneProductVariant(aRequest, aResponse) {
    const { id, variantId } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let product = await Product.findOne({ id }).exec();

        let productVariantIndex = product.variants.findIndex(function (aElement) {
            return (aElement.id == variantId);
        });
        
        if (productVariantIndex != -1) {
            result = product.variants[productVariantIndex];
        }

        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function updateOneProductVariant(aRequest, aResponse) {
    const { id, variantId } = aRequest.params;
    const { body } = aRequest;

    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }
    else if (!variantId) {
        sendError(aResponse, "Parameter ':variantId' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let product = await Product.findOne({ id }).exec();
        let productVariantIndex = product.variants.findIndex(function (aElement) {
            return (aElement.id == variantId);
        });

        if (productVariantIndex != -1) {
            if (body.name) {
                product.variants[productVariantIndex].name = body.name;
            }
            if (body.price) {
                product.variants[productVariantIndex].price = body.price;
            }
            if (body.stock) {
                product.variants[productVariantIndex].stock = body.stock;
            }
            if (body.imageUrl) {
                product.variants[productVariantIndex].imageUrl = body.imageUrl;
            }
        }

        result = await product.save();

        let wasUpdated = product === result;
        if (!wasUpdated) {
            sendError(aResponse, "Product variant was not updated", 400);
            return;
        }

        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function deleteOneProductVariant(aRequest, aResponse) {
    const { id, variantId } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }
    
    if (!variantId) {
        sendError(aResponse, "Parameter ':variantId' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let product = await Product.findOne({ id }).exec();

        let productVariantIndex = product.variants.findIndex(function (aElement) {
            return (aElement.id == variantId);
        });

        if (productVariantIndex != -1) {
            product.variants.splice(productVariantIndex, 1);
        } else {
            sendError(aResponse, "Product variant not in product", 400);
            return;
        }

        result = await product.save();

        let wasDeleted = product === result;
        if (!wasDeleted) {
            sendError(aResponse, "Product variant was not deleted", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

export default {
    getAllProducts,
    getOneProduct,
    getOneProductBySlug,
    createNewProduct,
    updateOneProduct,
    deleteOneProduct,
    createNewProductVariant,
    getOneProductVariant,
    updateOneProductVariant,
    deleteOneProductVariant
};