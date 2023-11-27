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

export { sendError, sendOk };
