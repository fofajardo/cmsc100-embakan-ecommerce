import { Cart } from "../models.js";
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
        let entry = await Cart.findOne({ id }).exec();
        if (entry) {
            result = entry;
        }
        sendOk(aResponse, result);
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
        let wasUpdated = result.modifiedCount == 1;
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
        items[cartItemIndex].quantity = body.quantity;
    } else {
        items.push({
            productId: body.productId,
            variantId: body.variantId,
            quantity: body.quantity
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
