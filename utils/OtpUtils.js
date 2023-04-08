require("dotenv").config()
const https = require('https');
const speakeasy = require('speakeasy');


const sendOTP = function () {
    const secret = speakeasy.generateSecret({length: 20}).base32;
    const otp = speakeasy.totp({
        secret: secret,
        encoding: 'base32'
    });

    const SENDER = "InfoSMS";
    const RECIPIENT = "923099564942";
    const MESSAGE_TEXT = "Your OTP is " + otp;

    const payload1 = JSON.stringify({
        "messages": [
            {
                "from": SENDER,
                "destinations": [
                    {
                        "to": RECIPIENT
                    }
                ],
                "text": MESSAGE_TEXT
            }
        ]
    });

    const options = {
        hostname: process.env.OTP_BASE_URL,
        path: "/sms/2/text/advanced",
        method: "POST",
        headers: {
            "Authorization": "App " + process.env.OTP_API_KEY,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    };

    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        res.on("data", (d) => {
            process.stdout.write(d);
        });
    });

    req.on("error", (error) => {
        console.error(error);
    });

    req.write(payload1);
    req.end();

    return otp;
}


module.exports = {
    sendOTP
}