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

export default { base, get, post, put, del, identify, blockSignedIn, blockSignedOut };
