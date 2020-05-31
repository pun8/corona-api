const mongoose = require('mongoose')

const url = process.env.MONGODB_URL2

mongoose.connect(url,{
    useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex : true
})
