require("express");
const passport = require("passport");
const User = require('../models/UserModel');
const utils = require("../utils/ValidationUtils");
const otpUtils = require("../utils/OtpUtils");


const post_register = function (req, res) {

    const newUser = new User({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        number: req.body.number,
        role: "user"
    })

    const err1 = utils.validateUser(newUser.toObject());
    const err2 = utils.checkPassword(req.body.password);

    if (err1) {
        res.status(400).redirect("/user/register/" + err1);
    } else if (err2) {
        res.status(400).redirect("/user/register/" + err2);
    } else {
        User.register(newUser, req.body.password, function (err, user) {
            if (err) {
                res.status(400).redirect("/user/register");
            } else {
                passport.authenticate("local")(req, res, function () {
                    res.status(200).redirect("/user/dashboard");
                });
            }
        });
    }
}


const verify_otp = function (req, res) {
    const otp = otpUtils.sendOTP();
    console.log(otp);
    res.send("OTP sent");
}


const post_login = function (req, res) {
    const user = User({
        username: req.body.username,
        password: req.body.password
    })

    const err = utils.checkNull(user.toObject())
    if (err) {
        res.status(400).redirect("/user/login/" + err);
    } else {
        req.login(user, function (err) {
            if (err) {
                console.log(err);
            } else {
                passport.authenticate("local")(req, res, function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).redirect("/user/dashboard");
                    }
                });
            }
        });
    }
}


const google_auth = passport.authenticate("google", { scope: ["profile"] })


const google_auth_redirect = passport.authenticate('google', { failureRedirect: '/user/login' })


const googleAuthLogin = function(req, res) {
    User.findOne({_id: res.req.user._id}, function(err, user) {
        if (err) {
            req.status(500).redirect("/");
        } else {
            if (!user.toObject().hasOwnProperty("username")) {
                res.status(200).redirect('/user/auth/google/register/' + res.req.user._id);
            } else {
                res.status(200).redirect("/user/dashboard");
            }
        }
    })
}

const googleAuthRegister = function (req, res) {
    const userId = req.params.userId;

    const userDetails = {
        name: req.body.name,
        username: req.body.username,
        number: req.body.number,
        role: "user"
    }

    const err = utils.validateAuthUser(userDetails);
    if (err) {
        res.status(200).redirect("/user/auth/google/register/" + req.params.userId + "/" + err);
    } else {
        User.updateOne({_id: userId}, userDetails, function (err, user) {
            if (err) {
                res.status(500).send(err.message);
            } else if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).redirect("/user/dashboard");
            }
        })
    }
}


const logout = function(req, res) {
    if (req.isAuthenticated()) {
        req.logout(function(err) {
            if (err) {
                console.log(err);
            } else {
                res.status(200).redirect("/user/login");
            }
        });
    } else {
        res.status(400).redirect("/user/login");
    }
}


const read = function (req, res) {
    if (req.isAuthenticated()) {
        User.findById(req.params.userId, function(err, user) {
            if (err) {
                return res.status(500).send(err.message);
            } else if (!user) {
                return res.status(404).send(err.message);
            } else {
                res.status(200).send(user);
            }
        });
    } else {
        res.status(400).redirect("/user/login");
    }
}


const update = function (req, res) {
    if (req.isAuthenticated()) {
        const userId = req.params.userId;

        User.updateOne({_id: userId}, req.body, function (err, user) {
            if (err) {
                res.status(500).send(err.message);
            } else if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).send('User updated successfully');
            }
        })
    } else {
        res.status(400).redirect("/user/login");
    }
}


const del = function (req, res) {
    if (req.isAuthenticated()) {
        const userId = req.params.userId;

        User.findOneAndDelete({_id: userId}, function (err, user) {
            if (err) {
                res.status(500).send(err.message);
            } else if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).redirect("/");
            }
        })
    } else {
        res.status(400).redirect("/user/login");
    }
}


const promoteUser = function (req, res) {
    if (req.isAuthenticated()) {
        const username = req.body.username;

        const updatedDetails = {
            role: "manager",
            area: req.body.area
        }

        if (req.user.role === 'admin') {
            User.updateOne({username: username}, updatedDetails, function (err, user) {
                if (err) {
                    res.status(500).send(err.message);
                } else if (user.matchedCount === 0) {
                    res.status(404).send('User not found');
                } else {
                    res.status(200).redirect('/user/dashboard');
                }
            })
        } else {
            res.status(200).redirect('/user/dashboard');
        }
    } else {
        res.status(400).redirect("/user/login");
    }
}


const get_register = function(req, res) {
    res.status(200).render("register.ejs", {err: null});
}


const get_register_with_error = function(req, res) {
    res.status(200).render("register.ejs", {err: req.params.err});
}


const get_login = function(req, res) {
    res.status(200).render("login.ejs", {err: null});
}


const get_login_with_error = function(req, res) {
    res.status(200).render("login.ejs", {err: req.params.err});
}


const get_google_auth_register = function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).render("auth_register.ejs", {userId: req.params.userId, err: null});
    } else {
        res.status(400).redirect("/user/login");
    }
}


const get_google_auth_register_with_err = function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).render("auth_register.ejs", {userId: req.params.userId, err: req.params.err});
    } else {
        res.status(400).redirect("/user/login");
    }
}


const get_dashboard = function(req, res) {
    if (req.isAuthenticated()) {
        res.status(200).render("dashboard.ejs");
    } else {
        res.status(400).redirect("/user/login");
    }
}


const getPromoteUser = function (req, res) {
    if (req.isAuthenticated()) {
        if (req.user.role === "admin") {
            res.status(200).render("promote_user.ejs");
        } else {
            res.status(400).redirect("/user/dashboard");
        }
    } else {
        res.status(400).redirect("/user/login");
    }
}



module.exports = {
    post_register,
    post_login,
    get_register,
    get_register_with_error,
    get_login,
    get_login_with_error,
    get_dashboard,
    google_auth,
    google_auth_redirect,
    googleAuthLogin,
    googleAuthRegister,
    verify_otp,
    promoteUser,
    getPromoteUser,
    get_google_auth_register,
    get_google_auth_register_with_err,
    logout,
    read,
    update,
    del
};
