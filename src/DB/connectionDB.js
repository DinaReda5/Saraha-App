import mongoose from "mongoose";
const connectionDB = async() => {
    await mongoose.connect(process.env.URI_ONLINE).then(() => {
        console.log(`connected successfully to DB ${process.env.URI_ONLINE}`);    
    }).catch((err) => {
        console.log("failed to connect to DB",err);
    })
}

export default connectionDB