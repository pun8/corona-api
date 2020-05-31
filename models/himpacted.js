const mongoose = require('mongoose')
const schema = mongoose.Schema

const countryschema = new schema({
    name:{
        type: String,
        required: true
    },
    TotalInfections:{
        type: Number
    },
    ActiveInfections:{
        type: Number
    },
    Recoveries:{
        type: Number
    },
    Deaths:{
        type: Number
    }
},{
    timestamps: true
})

const Impacted = mongoose.model('Impacted',countryschema)

module.exports = Impacted