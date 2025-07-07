const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require("../models/listing.js");
const MONGOOSE_URL = "mongodb://127.0.0.1:27017/vista";

main()
.then(() => {
    console.log("connected sucessfully");
})
.catch(err => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGOOSE_URL);
}

const initDB = async () => {
    await Listing.deleteMany();
    initData.data = initData.data.map((obj) => ({...obj, owner : "68657c50e73fb89e31ebf7ea"}));
    await Listing.insertMany(initData.data);
    console.log("data is initialized");
}

initDB();