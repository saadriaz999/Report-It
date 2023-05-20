const Complaint = require('./models/ComplaintModel')
const validationUtils = require("./utils/ValidationUtils");
const filterUtils = require("./utils/FilterUtils")


function generateRandomCoordinate(latitude, longitude, maxDistanceInKm) {
    const earthRadiusInKm = 6371; // Radius of the Earth in kilometers

    // Convert latitude and longitude to radians
    const latInRadians = latitude * (Math.PI / 180);
    const lonInRadians = longitude * (Math.PI / 180);

    // Generate random distance in kilometers within the given range
    const randomDistanceInKm = Math.random() * maxDistanceInKm;

    // Generate random bearing (direction) in radians
    const randomBearingInRadians = Math.random() * 2 * Math.PI;

    // Calculate the new latitude
    const newLatInRadians = Math.asin(
        Math.sin(latInRadians) * Math.cos(randomDistanceInKm / earthRadiusInKm) +
        Math.cos(latInRadians) *
        Math.sin(randomDistanceInKm / earthRadiusInKm) *
        Math.cos(randomBearingInRadians)
    );

    // Calculate the new longitude
    const newLonInRadians =
        lonInRadians +
        Math.atan2(
            Math.sin(randomBearingInRadians) *
            Math.sin(randomDistanceInKm / earthRadiusInKm) *
            Math.cos(latInRadians),
            Math.cos(randomDistanceInKm / earthRadiusInKm) -
            Math.sin(latInRadians) * Math.sin(newLatInRadians)
        );

    // Convert new latitude and longitude back to degrees
    const newLatitude = newLatInRadians * (180 / Math.PI);
    const newLongitude = newLonInRadians * (180 / Math.PI);

    return { latitude: newLatitude, longitude: newLongitude };
}


const LUCKYONE_LAT = 24.9324 ;
const LUCKYONE_LONG = 67.0873;
const DISTANCE = 50;

for (let i = 0; i < 20; i++) {
    const temp = generateRandomCoordinate(LUCKYONE_LAT, LUCKYONE_LONG, DISTANCE);

    const complaint = new Complaint({
        userId: "6427c6ec67fe7e76bd6f0926",
        category: "harassment",
        description: "complaint " + i,
        address: temp.latitude + " " + temp.longitude,
        datetime: "2023-04-01T06:00:00.000+00:00",
    })

    const err = validationUtils.validateComplaint(complaint.toObject());
    if (err) {
        console.log("problem with input")
    } else {
        // save complaint to database
        complaint.save(function (err, complaint) {
            if (err) {
                console.log("error in server")
            } else {
                console.log("complaint " + i + " saved");
            }
        })
    }
}