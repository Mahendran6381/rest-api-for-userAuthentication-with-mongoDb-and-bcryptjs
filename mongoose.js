const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    name:String
})

module.exports = mongoose.model("Users",UserSchema)