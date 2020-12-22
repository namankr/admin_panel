// server/roles.js
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
    ac.grant("Mentor")
        .readOwn("profile")
        .updateOwn("profile")


    ac.grant("Admin")
        .extend("Mentor")
        .updateAny("profile")
        .createAny("profile")
        .deleteAny("profile")
        .readAny("profile")

    return ac;
})();