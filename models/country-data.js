const mongoose = require('mongoose')
const schema = mongoose.Schema

const countryschema = new schema({
    name:{
        type: String,
        required: true
    },
    TotalCases:{
        type: Number
    },
    NewCases:{
        type: Number
    },
    TotalDeaths:{
        type: Number
    },
    NewDeaths:{
        type: Number
    },
    TotalRecovered:{
        type: Number
    },
    ActiveCases:{
        type: Number
    },
    Serious:{
        type: Number
    },
    TotCasesper1M :{
        type: Number
    },
    Deathsper1M:{
        type: Number
    },
    TotalTests:{
        type: Number
    },
    Testsper1M:{
        type: Number
    }
},{ timestamps: true})

const Country = mongoose.model('Country', countryschema)

module.exports = Country