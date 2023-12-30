import { v4 as uuidv4 } from "uuid";
import { Order, Product } from "../models.js";
import { sendError, sendOk, hasNull } from "./utils.js";

async function getAllOrders(aRequest, aResponse) {
    try {
        let result = await Order.find({});
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function getOneOrder(aRequest, aResponse) {
    const { id } = aRequest.params;

    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = [];
        let entry = await Order.findOne({ id }).exec();
        if (entry) {
            result.push(entry);
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function createNewOrder(aRequest, aResponse) {
    const { body } = aRequest;

    const requiredProps = [
        "productId", "variantId", "quantity", "userId", "status"
    ];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    const productEntry = await Product.findOne({
        id: body.productId,
    }).exec();

    if (!productEntry || !productEntry?.variants) {
        sendError(aResponse, "Missing product or product variants", 400);
        return;
    }

    const productVariant = productEntry.variants.find(function (aElement) {
        return aElement.id == body.variantId;
    });

    const priceAtCheckout = body.quantity * productVariant.price;

    const entry = new Order({
        id: uuidv4(),
        productId: body.productId,
        variantId: body.variantId,
        groupId: body.groupId ? body.groupId : uuidv4(),
        quantity: body.quantity,
        price: priceAtCheckout,
        userId: body.userId,
        status: body.status,
        date: new Date()
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

async function createBulkOrder(aRequest, aResponse) {
    const { body } = aRequest;
    const requiredProps = ["items"];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    try {
        const groupId = uuidv4();
        for (let i = 0; i < body.items.length; i++) {
            var item = body.items[i];
            item.groupId = groupId;
            createNewOrder({ body: item }, aResponse);
        }
    } catch (e) {
        sendError(aResponse, e.message, 500);
    }
}

async function updateOneOrder(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    const { body } = aRequest;
    if (!body.status) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }
    
    try {
        let result = await Order.updateOne({
            id
        }, {
            $set: {
                status: body.status
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

async function deleteOneOrder(aRequest, aResponse) {
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

export default {
    getAllOrders,
    getOneOrder,
    createNewOrder,
    createBulkOrder,
    updateOneOrder,
    deleteOneOrder
};
