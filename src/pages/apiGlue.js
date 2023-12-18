async function base(aUrl, aOptions, aEnqueue, aSuccessMessage) {
    if (!aEnqueue) {
        aEnqueue = console.log;
    }
    const errorVariant = { variant: "error" };
    const successVariant = { variant: "success" };

    try {
        const response = await fetch(aUrl,
        {
            ...aOptions,
            credentials: "include"
        });
        const jsonResponse = await response.json();
        
        if (response.ok) {
            if (aSuccessMessage) {
                aEnqueue(aSuccessMessage, successVariant);                        
            }
            return jsonResponse;
        } else if (jsonResponse?.data?.error) {
            aEnqueue(jsonResponse.data.error, errorVariant);
        } else {
            aEnqueue("Unknown API error.", errorVariant);
        }
    } catch (e) {
        aEnqueue(e.message, errorVariant);
    }
    return false;
}

async function get(aUrl, aEnqueue, aSuccessMessage) {
    return await base(aUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }, aEnqueue, aSuccessMessage);
}

//Return ay raw response. Will use json
// a and ques
// aurl: URL of the API (e.g. kroute)
// aData : the datea (e.g. string) that will be submitted
//e.g. "statusL order"
// aEnqueue: for the snack bar creation
// aSuccessMEssage: nagpapakita


//aData: {compete}
async function post(aUrl, aData, aEnqueue, aSuccessMessage) {
    if (!aData) {
        aData = {};
    }

    return await base(aUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(aData)
    }, aEnqueue, aSuccessMessage);
}


//this is for the update
async function put(aUrl, aData, aEnqueue, aSuccessMessage) {
    if (!aData) {
        aData = {};
    }

    return await base(aUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(aData)
    }, aEnqueue, aSuccessMessage);
}

async function del(aUrl, aData, aEnqueue, aSuccessMessage) {
    if (!aData) {
        aData = {};
    }

    return await base(aUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(aData)
    }, aEnqueue, aSuccessMessage);
}

const kUserInfoUrl = "http://localhost:3001/auth/signed-in-user";

async function identify() {
    const response = await get(kUserInfoUrl);
    return response;
}

const kSignedInRoute = "/";
const kSignedOutRoute = "/sign-in";

async function blockSignedIn(aNavigate) {
    const user = await identify()
    if (user.data) {
        aNavigate(kSignedInRoute);
        return true;
    }
    return false;
}

async function blockSignedOut(aNavigate) {
    const user = await identify()
    if (!user.data) {
        aNavigate(kSignedOutRoute);
        return true;
    }
    return false;
}

const kCartUrl = "http://localhost:3001/carts/";

async function handleCart(aProductId, aVariantId, aQuantity, aIsRelative) {
    const user = await identify();
    if (!user.data) {
        return;
    }

    const cartBaseUrl = `${kCartUrl}${user?.data?.id}`;
    var cart = await get(cartBaseUrl);
    if (cart.data == null) {
        cart = await post(cartBaseUrl, { items: JSON.stringify([]) });
    }
    
    const cartItemsUrl = `${cartBaseUrl}/items`;
    var result = null;
    if (aQuantity <= 0) {
        result = await del(cartItemsUrl,
            {
                productId: aProductId,
                variantId: aVariantId
            });
    } else {
        result = await post(cartItemsUrl,
            {
                productId: aProductId,
                variantId: aVariantId,
                quantity: aQuantity,
                relative: aIsRelative
            });
    }

    cart = await get(cartBaseUrl);

    return cart;
}

export default { base, get, post, put, del, identify, blockSignedIn, blockSignedOut, handleCart };
