import { v4 as uuidv4 } from "uuid";
import { Order } from "../models.js";
import { sendError, sendOk } from "./utils.js";

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
    if (!body.productId ||
        !body.quantity ||
        !body.userId ||
        !body.status) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }
    
    const entry = new Order({
        id: uuidv4(),
        productId: body.productId,
        quantity: body.quantity,
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
    updateOneOrder,
    deleteOneOrder
};
