const moment = require("moment");


const checkNull = function (object) {
    for (const property in object) {
        if (object.hasOwnProperty(property)) {
            if (object[property] === "") {
                return "Please enter '" + property + "'";
            }
        }
    }
    return null;
}


function validateEmail(userObject) {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(userObject['email'])) {
        return 'Email is not valid';
    } else {
        return null;
    }
}


const validateRole = function (userObject) {
    const possibleRoles = [
        'admin',
        'manager',
        'user'
    ]

    if (!possibleRoles.includes(userObject['role'])) {
        return "'" + userObject['role'] + "' is not a valid role";
    } else {
        return null;
    }
}


const validateNumber = function (userObject) {
    const re = /^((\+92)|(0092)|(92)|(0))(3)([0-9]{9})$/;
    if (!re.test(userObject['number'])) {
        return "Phone number is not valid"
    } else {
        return null;
    }
}


const validateMongoId = function (complaintObject) {
    const re = /^[0-9a-fA-F]{24}$/;
    if (!re.test(complaintObject['userId'])) {
        return "UserId is not valid"
    }
}


const validateAddress = function (complaintObject) {
    const length = complaintObject["address"].trim().split(" ").length;
    if (length !== 2) {
        return "Invalid number of values. Expected 2, got " + length;
    }

    const address = complaintObject["address"].trim().split(" ");
    for (let val in address) {
        if (isNaN(address[val]) || isNaN(parseFloat(address[val]))) {
            return "Address latitude or longitude is not a number";
        }
    }
    return null;
}


const validateDate = function (complaintObject) {
    const valid = moment(complaintObject["datetime"], moment.ISO_8601).isValid()
    if (!valid) {
        return "Date format not valid. Enter ISO_8601 format.";
    } else {
        return null;
    }
}


const validateIncidentCategory = function (complaintObject) {
    const possibleIncidentCategory = [
        'robbery',
        'murder',
        'harassment'
    ]

    if (!possibleIncidentCategory.includes(complaintObject['category'])) {
        return "'" + complaintObject['category'] + "' is not a valid complaint category";
    } else {
        return null;
    }
}


const checkPassword = function (password) {
    if (password === "") {
        return "Password is empty"
    }
    return null;
}

const validateUser = function (userObject) {
    const fieldIsNull = checkNull(userObject);
    const emailIdNotValid = validateEmail(userObject);
    const roleNotValid = validateRole(userObject);
    const numberNotValid = validateNumber(userObject);

    if (fieldIsNull) {
        return fieldIsNull;
    } else if (emailIdNotValid) {
        return emailIdNotValid;
    } else if (roleNotValid) {
        return roleNotValid;
    } else if (numberNotValid) {
        return numberNotValid;
    } else {
        return null;
    }
}


const validateAuthUser = function (userObject) {
    const fieldIsNull = checkNull(userObject);
    const roleNotValid = validateRole(userObject);
    const numberNotValid = validateNumber(userObject);

    if (fieldIsNull) {
        return fieldIsNull;
    } else if (roleNotValid) {
        return roleNotValid;
    } else if (numberNotValid) {
        return numberNotValid;
    } else {
        return null;
    }
}


const validateComplaint = function (complaintObject) {
    const fieldIsNull = checkNull(complaintObject);
    const userIdNotValid = validateMongoId(complaintObject);
    const addressNotValid = validateAddress(complaintObject);
    const dateNotValid = validateDate(complaintObject);
    const categoryNotValid = validateIncidentCategory(complaintObject);

    if (fieldIsNull) {
        return fieldIsNull;
    } else if (userIdNotValid) {
        return userIdNotValid;
    } else if (addressNotValid) {
        return addressNotValid
    } else if (dateNotValid) {
        return dateNotValid;
    } else if (categoryNotValid) {
        return categoryNotValid;
    } else {
        return null;
    }
}


module.exports = {
    checkNull,
    checkPassword,
    validateUser,
    validateAuthUser,
    validateComplaint
}
