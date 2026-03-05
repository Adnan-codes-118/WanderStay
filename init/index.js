const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

require("dotenv").config();
const dbURL = process.env.ATLASDB_URL;

//const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
    console.log("DB is conected");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbURL);
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"69a5e38d14c77ba62b561c0b",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised");
}

initDB();