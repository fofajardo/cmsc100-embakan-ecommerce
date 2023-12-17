import { User } from "../models.js";
import { sendError, sendOk, hasNull } from "./utils.js";

import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

function testUser(aPassword, aUser, aDone) {
    if (!aUser) {
        return aDone(null, false, { message: "Incorrect username or email." });
    }

    const match = bcrypt.compareSync(aPassword, aUser.password);
    if (match) {
        return aDone(null, aUser);
    }

    return aDone(null, false, { message: "Incorrect username, email, or password." });
}

passport.use(new LocalStrategy(function verify(username, password, done) {
    return User.findOne({ email: username }, function(aError, aUser) {
        if (aError) {
            return User.findOne({ username: username }, function(aError, aUser) {
                if (aError) {
                    return done(null, false, { message: "Incorrect username or email." });
                }
                return testUser(password, aUser, done);
            });
        }
        return testUser(password, aUser, done);
    });

}));

passport.serializeUser(function (aUser, aCallback) {
    process.nextTick(function () {
        aCallback(null, aUser);
    });
});

passport.deserializeUser(function (aUser, aCallback) {
    process.nextTick(function () {
        return aCallback(null, aUser);
    });
});

const signIn = passport.authenticate("local");

function signOut(aRequest, aResponse, aNext) {
    aRequest.logout(function(aError) {
        if (aError) {
            return aNext(aError);
        }
        sendOk(aResponse, true);
    });
}

function dumpSession(aRequest, aResponse) {
    console.log(aRequest.session);
    sendOk(aResponse, aRequest.session);
}

export default { signIn, signOut, dumpSession };
