const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const pup = require('puppeteer')
const moment = require('moment')
const num = require('numeral')


const State = require('../models/states')


const router = express.Router()

async function main(){
    // const browser =await pup.launch({headless: true, executablePath: 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'})
    const browser =await pup.launch({headless: true, args: ['--no-sandbox'] })
    console.log("i'm in main")

    try{
        const page =  await browser.newPage()
        console.log("scraping now")
        await page.goto('https://www.mohfw.gov.in/')
        await page.waitForSelector('#state-data')
        const button = await page.$('#state-data')
        
        button.click()

        const states = await page.evaluate(() => {
            let rows = document.querySelectorAll("tbody tr");
            const rowArray = Array.from(rows);
            // last time there were 35+1 states (-1 for total# and cases being reassigned is gone) 
            const objs =  rowArray.slice(0,35).map(tr => {
              const dataNodeList = tr.querySelectorAll('td');
              const dataArray = Array.from(dataNodeList);
              const [ no, name, active, cured, death, confirmed] = dataArray.map(td => td.textContent);

              return {
                 no, name, active, cured, death, confirmed
              };
            })
            return objs
        })

        return states
    }catch(error){
        console.log(error)
    }
}

async function gethtml(url){
    try{
        const result = await axios.get(url)
        return cheerio.load(result.data)
    }catch(e){
        console.log(e)
    }
}

router.post('/mohfw', async(req,res)=>{

    try{
        console.log(moment().add('6', 'hours'))
        // const nowDate = new Date();  //indian server
        const wdate = moment().add('5', 'hours').format('YYYY-M-D'); //usa server
        // const wdate = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate(); //india server
        // console.log(wdate)
        const data = await main()
        // console.log(data)
        data.forEach(async(state)=>{
            // const entry = new State({
            //     name: state.name,
            //     confirmed: state.confirmed,
            //     cured : state.cured,
            //     death: state.death
            // })
            // await entry.save()

            await State.updateOne({
                name: state.name,
                date: wdate
            },
                {
                name: state.name,
                confirmed: state.confirmed,
                cured : state.cured,
                death: state.death,
                active: state.active,
                // active: state.confirmed - state.cured - state.death,
                date: wdate
            },{new: true, useFindAndModify: false, upsert: true})
        })

        const $ = await gethtml('https://www.icmr.gov.in/')
        const tt = num($('.scf-text h2').first().text()).value()
        const tt2 = num($('.scf-text h2').last().text()).value() //last 24 hours

        try{
            await State.deleteOne({name: 'Total',date:wdate})
            await State.aggregate([{ $match: { date:wdate } },{
            $group:{_id: null, confirmed:{$sum : "$confirmed"}, cured:{$sum: "$cured"}, death:{$sum: "$death"},active:{$sum: "$active"}}}
        ]).then(async (res)=>{
            // const entry = new State({
            //         name: 'Total',
            //         confirmed: res[0].confirmed,
            //         cured : res[0].cured,
            //         death: res[0].death
            //     })
            //     await entry.save()
            await State.updateOne({
                name: 'Total',
                date: wdate
            },
                {
                    name: 'Total',
                    confirmed: res[0].confirmed,
                    cured : res[0].cured,
                    death: res[0].death,
                    active:res[0].active,
                    date:wdate,
                    tests: tt
            },{new: true, useFindAndModify: false, upsert: true})
        }) } catch {
            console.log('eh')
        }

        res.send('Its working!')
    } catch(e){
        res.send("this is not working")
    }

})

module.exports = router