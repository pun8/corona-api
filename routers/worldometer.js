const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios')
const num = require('numeral')
const Country = require('../models/country-data')
const router = express.Router()


async function gethtml(url){
    try{
        const result = await axios.get(url)
        return cheerio.load(result.data)
    }catch(e){
        console.log(e)
    }
}

//TO MAKE NEW ENTRIES IN TABLE
// router.get('/worldometer',async (req,res)=>{
//     try{
//     const $ = await gethtml('https://www.worldometers.info/coronavirus/')

//     $("#main_table_countries_today> tbody:nth-child(2)> tr").each(async(i,el)=>{
//         const sel = ($(el).find("td"))

//         if(i < 7){
//             return true
//         }
        
//         const desh = new Country({
//             name: $(sel[0]).text(),
//             TotalCases: num($(sel[1]).text()).value(),
//             NewCases: num($(sel[2]).text()).value(),
//             TotalDeaths: num($(sel[3]).text()).value(),
//             NewDeaths: num($(sel[4]).text()).value(),
//             TotalRecovered: num($(sel[5]).text()).value(),
//             ActiveCases: num($(sel[6]).text()).value(),
//             Serious: num($(sel[7]).text()).value(),
//             TotCasesper1M: num($(sel[8]).text()).value(),
//             Deathsper1M: num($(sel[9]).text()).value(),
//             TotalTests: num($(sel[10]).text()).value(),
//             Testsper1M: num($(sel[11]).text()).value()
//         })
//         await desh.save()
//         res.send("DONE!")
//     })}catch(e){
//         res.send(e.message)
//     }
// })

router.patch('/worldometer',async(req,res)=>{
    try{
    const $ = await gethtml('https://www.worldometers.info/coronavirus/')

    $("#main_table_countries_today> tbody:nth-child(2)> tr").each(async(i,el)=>{
        const sel = ($(el).find("td"))

        if(i < 7){
            return true
        }
        try{
            await Country.updateOne({name :$(sel[0]).text() },
            {TotalCases: num($(sel[1]).text()).value(),
                NewCases: num($(sel[2]).text()).value(),
                TotalDeaths: num($(sel[3]).text()).value(),
                NewDeaths: num($(sel[4]).text()).value(),
                TotalRecovered: num($(sel[5]).text()).value(),
                ActiveCases: num($(sel[6]).text()).value(),
                Serious: num($(sel[7]).text()).value(),
                TotCasesper1M: num($(sel[8]).text()).value(),
                Deathsper1M: num($(sel[9]).text()).value(),
                TotalTests: num($(sel[10]).text()).value(),
                Testsper1M: num($(sel[11]).text()).value()},
                {new: true, useFindAndModify: false, upsert: true})
            }catch(e){
                console.log(e)
            }
        })
    }catch(e){
        res.send(e.message)
    }
        
    res.send("done")
})

module.exports = router