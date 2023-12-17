function corsModifier(aRequest, aResponse, aNext) {
    aResponse.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    aResponse.setHeader("Access-Control-Allow-Credentials", "true");
    aResponse.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    aResponse.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    aNext();
}

export default corsModifier;