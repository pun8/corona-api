const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const num = require('numeral')
const Impacted = require('../models/himpacted')
const router = express.Router()

async function gethtml(url){
    try{
        const result = await axios.get(url)
        
        return cheerio.load(result.data)
    }catch(e){
        console.log(e.message)
    }
}

// Number of coronavirus (COVID-19) cases, recoveries, and deaths among the most impacted countries worldwide as of April 13, 2020
router.patch('/statista-deaths',async(req,res)=>{
    try{
        const $ = await gethtml("https://www.statista.com/statistics/1105235/coronavirus-2019ncov-cases-recoveries-deaths-most-affected-countries-worldwide/")
        
        await Impacted.deleteMany({})
        
        $('table[id="statTableHTML"]> tbody> tr').each(async(i,el)=>{
            const sel = $(el).find('td')

            const desh = new Impacted({
                name: $(sel[0]).text(),
                TotalInfections: num($(sel[1]).text()).value(),
                ActiveInfections: num($(sel[2]).text()).value(),
                Recoveries: num($(sel[3]).text()).value(),
                Deaths: num($(sel[4]).text()).value(),
            })
            await desh.save()
         })
        res.send("done")
    }catch(e){
        res.sendStatus(400)
    }
})


module.exports= router