import { Cart, Product } from "../models.js";
import { sendError, sendOk } from "./utils.js";

/*
 * Cart
 */

async function getOneCart(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let baseEntry = await Cart.findOne({ id }).exec();
        // Perform aggregation only if the cart is not empty.
        if (baseEntry.items.length > 0) {
            let entry = await Cart.aggregate([
                // Match cart with the provided ID (same as user).
                {
                    $match: { id }
                },
                // Unwind array of cart items.
                {
                    $unwind: "$items"
                },
                // Take products matching the product ID of the cart item.
                {
                    $lookup: {
                        from: "products",
                        localField: "items.productId",
                        foreignField: "id",
                        as: "items.product"
                    }
                },
                // Unwind array of matching products.
                // This should only be one (1) element.
                {
                    $unwind: "$items.product"
                },
                // Unwind array of product variants.
                {
                    $unwind: "$items.product.variants"
                },
                // Remove product variants that don't match the cart item's
                // target product variant ID.
                {
                    $redact: {
                        $cond: {
                            if: {
                                $eq: ["$items.variantId", "$items.product.variants.id"]
                            },
                            then: "$$KEEP",
                            else: "$$PRUNE"
                        }
                    }
                },
                // Re-group the cart items into an array.
                {
                    $group: {
                        _id: "$id",
                        // Cart/user ID.
                        id: {
                            $first: "$id"
                        },
                        // Compute for total payment based on cart items.
                        totalPayment: {
                            $sum: {
                                $multiply: [
                                    "$items.product.variants.price",
                                    "$items.quantity"
                                ]
                            }
                        },
                        // Push cart item information.
                        items: {
                            $push: {
                                productId: "$items.productId",
                                product: "$items.product",
                                variantId: "$items.variantId",
                                quantity: "$items.quantity"
                            }
                        }
                    }
                },
            ]);
            // Take the first element since this should match a single and unique
            // cart owned by a user only.
            if (entry.length > 0) {
                result = entry[0];
            }
        } else {
            // Aggregation does not return anything if the cart is empty,
            // so catch that case here and return the "base" cart entry.
            result = baseEntry;
        }
        return sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function createNewCart(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    const { body } = aRequest;
    if (!body.wasParsed) {
        body.items = JSON.parse(body.items);
    }
    if (!body.items) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    try {
        const cartExists = await Cart.exists({ id });
        if (cartExists) {
            sendError(aResponse, "Document already exists", 400);
            return;
        }

        const entry = new Cart({
            id,
            items: body.items
        });
        const result = await entry.save();

        let wasInserted = entry === result;
        if (!wasInserted) {
            sendError(aResponse, "Document was not inserted", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function updateOneCart(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    const { body } = aRequest;
    if (!body.wasParsed) {
        body.items = JSON.parse(body.items);
    }
    if (!body.items) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    try {
        let result = await Cart.updateOne({
            id
        }, {
            $set: {
                items: body.items
            }
        });
        let wasUpdated = result.modifiedCount == 1 || result.matchedCount == 1;
        if (!wasUpdated) {
            sendError(aResponse, "Document was not updated", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function deleteOneCart(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = await Cart.deleteOne({
            id
        });
        let wasDeleted = result.deletedCount == 1;
        if (!wasDeleted) {
            sendError(aResponse, "Document was not deleted", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

/*
 * Cart Items
 */

async function addOrCreateCartItem(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    const { body } = aRequest;
    if (!body.quantity || !body.productId || !body.variantId) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    if (body.quantity <= 0) {
        sendError(aResponse, "Cart item quantity must be greater than zero", 400);
        return;
    }

    var productVariant = null;
    try {
        let product = await Product.findOne({ id: body.productId }).exec();

        let productVariantIndex = product.variants.findIndex(function (aElement) {
            return (aElement.id == body.variantId);
        });
        
        if (productVariantIndex != -1) {
            productVariant = product.variants[productVariantIndex];
        }
    } catch (e) {
        return sendError(aResponse, "Invalid product or product variant", 400);
    }

    var entry = null;
    try {
        entry = await Cart.findOne({ id }).exec();
    } catch (e) {
        sendError(aResponse, e, 500);
        return;
    }

    let cartItemIndex = entry.items.findIndex(function (aElement) {
        return (aElement.productId == body.productId) &&
               (aElement.variantId == body.variantId);
    });

    var items = entry.items;
    var finalQuantity = parseInt(body.quantity);
    if (cartItemIndex != -1) {
        if (body.relative) {
            finalQuantity += items[cartItemIndex].quantity;
        }
        if (finalQuantity > productVariant.stock) {
            return sendError(aResponse, "Cannot add more than the available stock.", 400);
        }
        items[cartItemIndex].quantity = finalQuantity;
    } else {
        if (finalQuantity > productVariant.stock) {
            return sendError(aResponse, "Cannot add more than the available stock.", 400);
        }
        items.push({
            productId: body.productId,
            variantId: body.variantId,
            quantity: finalQuantity
        });
    }
    aRequest.body.items = items;
    aRequest.body.wasParsed = true;

    updateOneCart(aRequest, aResponse);
}

async function deleteOneCartItem(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    const { body } = aRequest;
    if (!body.productId || !body.variantId) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    var entry = null;
    try {
        entry = await Cart.findOne({ id }).exec();
    } catch (e) {
        sendError(aResponse, e, 500);
        return;
    }

    let cartItemIndex = entry.items.findIndex(function (aElement) {
        return (aElement.productId == body.productId) &&
               (aElement.variantId == body.variantId);
    });

    var items = entry.items;
    if (cartItemIndex != -1) {
        items.splice(cartItemIndex, 1);
    } else {
        sendError(aResponse, "Product not in cart", 400);
        return;
    }
    aRequest.body.items = items;
    aRequest.body.wasParsed = true;

    updateOneCart(aRequest, aResponse);
}

export default {
    getOneCart,
    createNewCart,
    updateOneCart,
    deleteOneCart,
    addOrCreateCartItem,
    deleteOneCartItem
};
