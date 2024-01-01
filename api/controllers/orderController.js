import { v4 as uuidv4 } from "uuid";
import { Order, Product } from "../models.js";
import { sendError, sendOk, hasNull } from "./utils.js";

async function getAllOrders(aRequest, aResponse) {
    var { groupBy } = aRequest.query;
    if (!groupBy) {
        groupBy = "groupId";
    }

    try {
        let result = await Order.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "id",
                    as: "product"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "id",
                    as: "user"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $unwind: "$user"
            },
            {
                $group: {
                    _id: `$${groupBy}`,
                    date: {
                        $first: "$date"
                    },
                    user: {
                        $first: "$user"
                    },
                    target: {
                        $first: `${groupBy}`
                    },
                    totalPayment: {
                        $sum: {
                            $cond: {
                                if: {
                                    $ne: ["$status", 2]
                                },
                                then: {
                                    $multiply: [
                                        "$price",
                                        "$quantity"
                                    ]
                                },
                                else: 0
                            }
                        }
                    },
                    children: {
                        $push: "$$ROOT"
                    }
                }
            },
            {
                $sort: {
                    date: -1
                }
            }
        ]);
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

async function modifyProductStock(aProductId, aVariantId, aQuantity, aIncrement, aResponse) {
    const productEntry = await Product.findOne({
        id: aProductId,
    }).exec();

    if (!productEntry || !productEntry?.variants) {
        return sendError(aResponse, "Missing product or product variants", 400);
    }

    const productVariantIndex = productEntry.variants.findIndex(function(aElement) {
        return aElement.id == aVariantId;
    });
    const productVariant = productEntry.variants[productVariantIndex];

    try {
        console.log("pre", productEntry.variants[productVariantIndex].stock);
        if (aIncrement) {
            productEntry.variants[productVariantIndex].stock += aQuantity;
        } else {
            productEntry.variants[productVariantIndex].stock -= aQuantity;
        }
        console.log("post", productEntry.variants[productVariantIndex].stock);
        const result = await productEntry.save();
        let wasUpdated = productEntry === result;
        if (!wasUpdated) {
            return sendError(aResponse, "Failed to update product variant stock.", 400);
        }
    } catch (e) {
        return sendError(aResponse, e, 500);
    }

    return productVariant;
}

async function createNewOrder(aRequest, aResponse, aPreventOk = false) {
    const { body } = aRequest;

    const requiredProps = [
        "productId", "variantId", "quantity", "userId", "status"
    ];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    const productVariant = await modifyProductStock(
        body.productId,
        body.variantId,
        body.quantity,
        false,
        aResponse);

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
        if (aPreventOk) {
            return result;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function createBulkOrder(aRequest, aResponse) {
    const { body } = aRequest;
    const requiredProps = ["items", "userId"];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more keys is missing or empty", 400);
        return;
    }

    try {
        const groupId = uuidv4();
        var orders = [];
        for (let i = 0; i < body.items.length; i++) {
            var item = body.items[i];
            item.groupId = groupId;
            item.userId = body.userId;
            item.status = 0;
            const result = createNewOrder({ body: item }, aResponse, true);
            if (!result) {
                return;
            }
            orders.push(result);
        }
        sendOk(aResponse, orders);
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
        let entry = await Order.findOne({ id }).exec();
        if (entry.status == 2) {
            return sendError(aResponse, "Cannot update the status of a canceled order.", 400);
        }
        entry.status = body.status;
        const result = await entry.save();

        let wasUpdated = entry === result;
        if (!wasUpdated) {
            sendError(aResponse, "Document was not updated", 400);
            return;
        }

        // Restore reserved stock.
        if (body.status == 2) {
            const productResult = await modifyProductStock(
                entry.productId,
                entry.variantId,
                entry.quantity,
                true,
                aResponse);
            if (!productResult) {
                return;
            }
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
