import { v4 as uuidv4 } from "uuid";
import { Product } from "../models.js";
import { sendError, sendOk } from "./utils.js";

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


async function createNewProduct(aRequest, aResponse) {
    const { body } = aRequest;
    if (!body.name ||
        !body.slug ||
        !body.type ||
        !body.description ||
        !body.stock ||
        !body.variants) {
        sendError(aResponse, "One or more fields is missing or empty", 400);
        return;
    }
    else {
    	try {
	    	const slugExists = await Product.exists({ body.slug });
	        if (emailExists || usernameExists) {
	            sendError(aResponse, "Product already exists", 400);
	            return;
	        }

	        const product = new Product({
	        	id: uuidv4(),
	            name: body.name,
			    slug: body.slug,
			    type: body.type,
			    description: body.description,
			    stock: body.stock,
			    variants: body.variants
	        });
	        const result = await user.save();

	        let wasInserted = user === result;
	        if (!wasInserted) {
	            sendError(aResponse, "New product was not added", 400);
	            return;
	        }
        	sendOk(aResponse, result);
    	} catch (e) {
        	sendError(aResponse, e, 500);
    }
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
    	let found = await Product.findOne({ id: id});
    	if(!found) {
    	    sendError(aResponse, "Product not found", 400);
        	return;
    	}
    	else {
    		if(body.name) {
		        let result = await Product.updateOne({
			            id
			        }, {
			            $set: {
			                name: body.name
			            }
			        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            productDataUpdated.push({ name: success });
		        }
    		}
    		else if(body.slug) {
		        let result = await Product.updateOne({
			            id
			        }, {
			            $set: {
			                slug: body.slug
			            }
			        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            productDataUpdated.push({ slug: success });
		        }
    		}
    		else if(body.type) {
		        let result = await Product.updateOne({
			            id
			        }, {
			            $set: {
			                type: body.type
			            }
			        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            productDataUpdated.push({ type: success });
		        }
    		}
    		else if(body.price) {
		        let result = await Product.updateOne({
			            id
			        }, {
			            $set: {
			                price: body.price
			            }
			        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            productDataUpdated.push({ price: success });
		        }
    		}
    		else if(body.stock) {
		        let result = await Product.updateOne({
			            id
			        }, {
			            $set: {
			                stock: body.stock
			            }
			        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            productDataUpdated.push({ stock: success });
		        }
    		}
    		else if(body.variants) {
		        let result = await Product.updateOne({
			            id
			        }, {
			            $set: {
			                variants: body.variants
			            }
			        });
		        let wasUpdated = result.modifiedCount == 1;
		        if (wasUpdated) {
		            productDataUpdated.push({ variants: success });
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


async function getOneProductVariant(aRequest, aResponse) {
    const { id } = aRequest.params;
    if (!id) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }

    try {
        let result = null;
        let productVariant = await Product.findOne({ variants.id: id }).exec();
        if (productVariant) {
            result = productVariant;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}


async function updateOneProductVariant(aRequest, aResponse) {
    const { productId } = aRequest.params.id;
    const { variantId } = aRequest.params.variantId;
    const { body } = aRequest;
    if (!productId) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }
    else if (!variantId) {
        sendError(aResponse, "Parameter ':variantId' cannot be empty", 400);
        return;
    }

    try {
        let result = await Product.findOneAndUpdate({
        	{ id: productId, variants.id: variantId },
			$set: {
		    	variants.$.name: body.name,
		        variants.$.price: body.price
		    },
			{ new: true }
        });
        let wasUpdated = result.nModified == 1;
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
    const { productId } = aRequest.params.id;
    const { variantId } = aRequest.params.variantId;
    if (!productId) {
        sendError(aResponse, "Parameter ':id' cannot be empty", 400);
        return;
    }
    else if (!variantId) {
        sendError(aResponse, "Parameter ':variantId' cannot be empty", 400);
        return;
    }

    try {
        let result = await Product.findOneAndUpdate({
        	{ id: productId, variants.id: variantId },
			{ $pull: { variants: { id: variantId } } },
			{ new: true }
        });
        let wasDeleted = result.deletedCount == 1;
        if (!wasDeleted) {
            sendError(aResponse, "Product variant was not deleted", 400);
            return;
        }
        sendOk(aResponse, result);
    } catch (e) {
        sendError(aResponse, e, 500);
    }
}