const User = require("../models/UserModel");


const createAdmin = function () {
    const newUser = new User({
        username: "admin",
        name: "admin",
        role: "admin"
    })

    User.register(newUser, "admin", function (err) {});
}


module.exports = {
    createAdmin
}