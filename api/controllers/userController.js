import { v4 as uuidv4 } from "uuid";
import { User, Order } from "../models.js";
import { sendError, sendOk } from "./utils.js";

/*
 * User
 */

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
    if (!body.firstName ||
        !body.middleName ||
        !body.lastName ||
        !body.email ||
        !body.username ||
        !body.password) {
        sendError(aResponse, "One or more fields is missing or empty", 400);
        return;
    }
    else {
    	try {
	    	const emailExists = await User.exists({ email: body.email });
	    	const usernameExists = await User.exists({ username: body.username });
	        if (emailExists || usernameExists) {
	            sendError(aResponse, "User already exists", 400);
	            return;
	        }

	        const user = new User({
	        	id: uuidv4(),
	            firstName: body.firstName,
			    middleName: body.middleName,
			    lastName: body.lastName,
			    role: 0,
			    email: body.email,
			    username: body.username,
			    password: body.password
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
    	if(!found) {
    	    sendError(aResponse, "User not found", 400);
        	return;
    	}
    	else {
    		if(body.firstName) {
		        let result = await User.updateOne({
		            id
		        }, {
		            $set: {
		                firstName: body.firstName
		            }
		        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            fieldsUpdated.push({ firstName: success });
		        }
    		}
    		if(body.middleName) {
		        let result = await User.updateOne({
		            id
		        }, {
		            $set: {
		                middleName: body.middleName
		            }
		        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            fieldsUpdated.push({ middleName: success });
		        }
    		}
    		if(body.lastName) {
		        let result = await User.updateOne({
		            id
		        }, {
		            $set: {
		                lastName: body.lastName
		            }
		        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            fieldsUpdated.push({ lastName: success });
		        }
    		}
    		if(body.role) {
		        let result = await User.updateOne({
		            id
		        }, {
		            $set: {
		                role: body.role
		            }
		        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            fieldsUpdated.push({ role: success });
		        }
    		}
    		if(body.email) {
		        let result = await User.updateOne({
		            id
		        }, {
		            $set: {
		                email: body.email
		            }
		        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            fieldsUpdated.push({ email: success });
		        }
    		}
    		if(body.password) {
		        let result = await User.updateOne({
		            id
		        }, {
		            $set: {
		                password: body.password
		            }
		        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            fieldsUpdated.push({ password: success });
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