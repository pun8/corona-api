const mongoose = require('mongoose')
const schema = mongoose.Schema

const stateschema = new schema({
    name:{
        type : String,
        required: true
    },
    confirmed:{
        type: Number
    },
    cured:{
        type: Number
    },
    death:{
        type: Number
    },
    active:{
        type: Number
    },
    date:{
        type: String
    },
    tests:{
        type: Number
    }
},{ timestamps: true})
const state = mongoose.model('state', stateschema)

module.exports = state