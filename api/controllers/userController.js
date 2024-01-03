import { v4 as uuidv4 } from "uuid";
import { User, Order } from "../models.js";
import { sendError, sendOk, hasNull } from "./utils.js";

import * as emailValidator from "email-validator";
import bcrypt from "bcrypt";

/*
 * User
 */

const SALT_ROUNDS = 10;

async function getAllUsers(aRequest, aResponse) {
    try {
        let result = await User.find({});
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function getOneUser(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let user = await User.findOne({ id }).exec();
        if (user) {
            result = user;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function createNewUser(aRequest, aResponse) {
    const { body } = aRequest;
    const requiredProps = [
        "firstName", "lastName", "email", "username", "password"
    ];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more fields is missing or empty", 400);
        return;
    }

    try {
        const emailExists = await User.exists({ email: body.email });
        const usernameExists = await User.exists({ username: body.username });
        if (emailExists) {
            sendError(aResponse, "An account with this email address already exists.", 400);
            return;
        }

        if (usernameExists) {
            sendError(aResponse, "Please use a different username.", 400);
            return;
        }

        if (!emailValidator.validate(body.email)) {
            sendError(aResponse, "Please use a valid email address.", 400);
            return;
        }

        const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

        const user = new User({
            id: uuidv4(),
            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName,
            role: 0,
            email: body.email,
            username: body.username,
            password: hashedPassword,
            address: ""
        });
        const result = await user.save();

        let wasInserted = user === result;
        if (!wasInserted) {
            sendError(aResponse, "New user was not created", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

async function updateOneUser(aRequest, aResponse) {
    var fieldsUpdated = [];
    const { id } = aRequest.params;
    const { body } = aRequest;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }
    else {
        let found = await User.findOne({ id: id});
        if (!found) {
            sendError(aResponse, "User not found", 400);
            return;
        }
        else {
            if (body.firstName) {
                let result = await User.updateOne({
                    id
                }, {
                    $set: {
                        firstName: body.firstName
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    fieldsUpdated.push("firstName");
                }
            }
            if (body.middleName) {
                let result = await User.updateOne({
                    id
                }, {
                    $set: {
                        middleName: body.middleName
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    fieldsUpdated.push("middleName");
                }
            }
            if (body.lastName) {
                let result = await User.updateOne({
                    id
                }, {
                    $set: {
                        lastName: body.lastName
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    fieldsUpdated.push("lastName");
                }
            }
            if (body.role) {
                let result = await User.updateOne({
                    id
                }, {
                    $set: {
                        role: body.role
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    fieldsUpdated.push("role");
                }
            }
            if (body.email) {
                const emailExists = await User.exists({ email: body.email });
                if (emailExists) {
                    return sendError(aResponse, "An account with this email address already exists.", 400);
                }

                if (!emailValidator.validate(body.email)) {
                    return sendError(aResponse, "Please use a valid email address.", 400);
                }

                let result = await User.updateOne({
                    id
                }, {
                    $set: {
                        email: body.email
                    }
                });

                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    fieldsUpdated.push("email");
                }
            }
            if (body.password) {
                const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS);

                let result = await User.updateOne({
                    id
                }, {
                    $set: {
                        password: hashedPassword
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    fieldsUpdated.push("password");
                }
            }
            if (body.address) {
                let result = await User.updateOne({
                    id
                }, {
                    $set: {
                        address: body.address
                    }
                });
                let wasUpdated = result.modifiedCount == 1;
                if (wasUpdated) {
                    fieldsUpdated.push("address");
                }
            }
            sendOk(aResponse, fieldsUpdated);
        }
    }
}


async function deleteOneUser(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = await User.deleteOne({
            id
        });
        let wasDeleted = result.deletedCount == 1;
        if (!wasDeleted) {
            sendError(aResponse, "User was not deleted", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
        return;
    }
}

async function getUserOrderHistory(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }
    try {
        let result = Order.find({ userId: id });
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}

export default {
    getAllUsers,
    getOneUser,
    createNewUser,
    updateOneUser,
    deleteOneUser,
    getUserOrderHistory
};
