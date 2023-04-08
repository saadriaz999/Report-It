function deg2rad(deg) {
    return deg * (Math.PI/180);
}


function getDistanceFromLatLonInKm(address1, address2) {
    const lat1 = address1.trim().split(" ")[0]
    const lon1 = address1.trim().split(" ")[1]
    const lat2 = address2.trim().split(" ")[0]
    const lon2 = address2.trim().split(" ")[1]

    const earthRadius = 6371; // in km
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return earthRadius * c;
}


const filterComplaints = function (data, role, managerLocation) {
    if (role === "admin") {
        return data;
    } else if (role === "manager") {
        let locations = []
        for (const complaint in data) {
            const distance = getDistanceFromLatLonInKm(managerLocation, data[complaint]["address"])
            if (distance < 10) {
                locations.push(data[complaint])
            } else {
                locations.push({"address": data[complaint]["address"]})
            }
        }
        return locations
    } else {
        let locations = []
        for (const complaint in data) {
            locations.push({"address": data[complaint]["address"]})
        }
        return locations
    }
}

// const x = [
//     {
//         "_id": "6421456b1abf2ad9710badaa",
//         "userId": "642144e21abf2ad9710bad9e",
//         "category": "harassment",
//         "description": "a",
//         "address": "24.94102323318071 67.11382959362989",
//         "datetime": "2023-03-27T07:27:00.000Z",
//         "__v": 0
//     },
//     {
//         "_id": "64257e5bcbee75fc4bffa611",
//         "userId": "641ef2914eb6391d2103f3eb",
//         "category": "murder",
//         "description": "abc",
//         "address": "24.933995540841106 67.07453196577683",
//         "datetime": "2023-03-30T12:19:00.000Z",
//         "__v": 0
//     }
// ]

// filterComplaints(x, 'admin')
// filterComplaints(x, 'address')
// filterComplaints(x, 'manager', "24.933995540841106 67.07453196577683")
// console.log(getDistanceFromLatLonInKm("24.94102323318071 67.11382959362989", "24.8668346513 67.0255540504"))

module.exports = {
    filterComplaints
}