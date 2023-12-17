async function base(aUrl, aOptions, aEnqueue, aSuccessMessage) {
    const errorVariant = { variant: "error" };
    const successVariant = { variant: "success" };

    try {
        const response = await fetch(aUrl, aOptions)
        const jsonResponse = await response.json()
        
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

async function get(aUrl, aData, aEnqueue, aSuccessMessage) {
    if (!aData) {
        aData = {};
    }

    return await base(aUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(aData)
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

export default { base, get, post, put, del };
