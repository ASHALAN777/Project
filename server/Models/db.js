const mongoose = require ('mongoose');

const mongo_url = process.env.MONGO_URI;

mongoose.connect(mongo_url)
.then(() => {
    console.log("Mongo connect succesfully")
})

 .catch((err) => {
    // console.log("Error connection:" , err);
})