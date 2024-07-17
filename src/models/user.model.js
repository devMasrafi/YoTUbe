import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username:{
        reqired: true,
        type: String,
        unique: true
    },
    fullName: {
        requierd: true,
        type: String
    },
    email:{
        reqired: true,
        type: String,
        unique: true
    },
    password: {
        requierd: true,
        type: String
    },
    avatar: {
        type: String
    },
    coverPhoto:{
        type: String
    },
    videos:[
        {type: Schema.Types.ObjectId,
        ref: "Videos"}
    ],
    history: [
        {type: Schema.Types.ObjectId,
        ref: "History"}
    ],
    playlist:[
        {type: Schema.Types.ObjectId,
        ref: "Playlist"}
    ],
    refreshToken:{
        type: String
    }
}, {
    timestamps:true
})


userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        next()
    }
    else{
        return next()
    }
})



userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(myPlaintextPassword, this.password);
}

userSchema.methods.generateAccessToken = function(password){
    const accessToken = jwt.sign({ _id:this._id, username:this.username, email: this.email }, process.env.ACCESS_TOKEN_SECRECT, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    });
    return accessToken
}
 

userSchema.methods.generateAccessToken = function(password){
    const refreshToken = jwt.sign({ _id:this._id, username:this.username, email: this.email }, process.env.REFRESH_TOKEN_SECRECT, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    });
    return refreshToken
}


export const User = mongoose.models.User ?? mongoose.model("User", userSchema)