const express = require('express')
require('./db/mongoose')
const worldometerrouter = require('./routers/worldometer')
const statistarouter = require('./routers/statista')
const mohfwrouter = require('./routers/mohfw')
// const icmrrouter = require('./routers/icmr')

const app = express()

app.use(express.json())
app.use(worldometerrouter)
app.use(statistarouter)
app.use(mohfwrouter)
// app.use(icmrrouter)

const port = process.env.PORT

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})