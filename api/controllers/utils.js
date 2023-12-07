function hasNull(aTarget, aValues) {
    if (!Array.isArray(aValues)) {
        aValues = [aValues];
    }

    for (let i = 0; i < aValues.length; i++) {
        let value = aValues[i];
        if (value in aTarget && aTarget[value] != null) {
            continue;
        }
        return true;
    }

    return false;
}

function sendError(aResponse, aError, aStatus) {
    aResponse
        .status(aStatus)
        .send({
            status: "FAILED",
            data: {
                error: aError
            }
        });    
}

function sendOk(aResponse, aData) {
    aResponse.send({
        status: "OK",
        data: aData
    });
}

export { sendError, sendOk, hasNull };
