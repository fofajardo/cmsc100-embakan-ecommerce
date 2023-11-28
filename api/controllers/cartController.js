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
        let result = [];
        let entry = await Cart.findOne({ id }).exec();
        if (entry) {
            result.push(entry);
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
    if (!body.items) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }
    
    const entry = new Cart({
        id,
        items: body.items
    });

    try {
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
    if (!body.items) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }
    
    try {
        let result = await Order.updateOne({
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
        let result = await Order.deleteOne({
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
    if (!body.quantity || !body.productId) {
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
        return aElement.productId == body.productId;
    });

    var items = entry.items;
    if (cartItemIndex != -1) {
        items[cartItemIndex].quantity = quantity;
    } else {
        items.push({
            quantity: body.quantity,
            productId: body.productId
        });
    }
    aRequest.body.items = items;

    updateOneCart(aRequest, aResponse);
}

async function deleteOneCartItem(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    const { body } = aRequest;
    if (!body.productId) {
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
        return aElement.productId == body.productId;
    });

    var items = entry.items;
    if (cartItemIndex != -1) {
        items = items.splice(cartItemIndex, 1);
    } else {
        sendOk(aResponse, null);
        return;
    }
    aRequest.body.items = items;

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
