const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data")

main()
.then(()=>{
    console.log("Db is  connected")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/NestVibes');
}

const initDb = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"669f541a0e13cd03f2ef19ac"}))
    await Listing.insertMany(initData.data)
    console.log("data was intiliazed ")
}

initDb();