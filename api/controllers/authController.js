import { User } from "../models.js";
import { sendError, sendOk, hasNull } from "./utils.js";

import bcrypt from "bcrypt";

async function signIn(aRequest, aResponse) {
    const { body } = aRequest;

    const requiredProps = [
        "usernameOrEmail", "password"
    ];

    if (hasNull(body, requiredProps)) {
        sendError(aResponse, "One or more fields is missing or empty", 400);
        return;
    }

    const { usernameOrEmail, password } = body;

    let user = await User.findOne({ email: usernameOrEmail }).exec();
    if (!user) {
        user = await User.findOne({ username: usernameOrEmail }).exec();
    }
    if (!user) {
        sendError(aResponse, "Incorrect username or email." , 400);
        return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
        aRequest.session.regenerate(function(aError) {
            if (aError) {
                sendError(aResponse, "Failed to regenerate session.", 500);
                return;
            }
            aRequest.session.user = user;
            aRequest.session.isAuthenticated = true;
            aRequest.session.save(function(aError) {
                if (aError) {
                    sendError(aResponse, "Failed to save session.", 500);
                    return;
                }
                sendOk(aResponse, true);
            });
        });
        return;
    }

    sendError(aResponse, "Incorrect username, email, or password.");
}

async function signOut(aRequest, aResponse, aNext) {
    aRequest.session.user = null;
    aRequest.session.isAuthenticated = false;
    aRequest.session.save(function(aError) {
        if (aError) {
            sendError(aResponse, "Failed to save session.", 500);
            return;
        }
        aRequest.session.regenerate(function(aError) {
            if (aError) {
                sendError(aResponse, "Failed to regenerate session.", 500);
                return;
            }
            sendOk(aResponse, true);
        });
    });
}

async function signedInUser(aRequest, aResponse) {
    console.log("taking");
    console.log(aRequest.session);
    if (aRequest.session.isAuthenticated) {
        sendOk(aResponse, aRequest.session.user);
        return;
    }
    sendOk(aResponse, false);
}

async function dumpSession(aRequest, aResponse) {
    console.log(aRequest.session);
    sendOk(aResponse, aRequest.session);
}

export default { signIn, signOut, signedInUser, dumpSession };
