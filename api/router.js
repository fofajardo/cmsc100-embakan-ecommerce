import controller from "./controller.js"

/**
 * Prepares the web application's endpoints.
 * @param {Object} aApp Express app object.
 */
function router(aApp) {
    aApp.use(corsModifier);

    // TODO: we can move app.post/app.get handling to the controller.
    aApp.get("/get-subjects", controller.getSubjects);
    aApp.post("/greet-by-post", controller.greetByPOST);
    aApp.get("/get-subject-by-code", controller.getSubjectByCode);
    aApp.post("/add-subject", controller.addSubject);
    aApp.post("/delete-subject", controller.deleteSubject);
}

function corsModifier(aRequest, aResponse, aNext) {
    aResponse.setHeader("Access-Control-Allow-Origin", "*");
    aResponse.setHeader("Access-Control-Allow-Credentials", "true");
    aResponse.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    aResponse.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    aNext();
}

export default router;
