/* importing dependencies */
const express = require('express')
const app = express()
const sendMessage = require("./queries/sendMessage")
const env = require("dotenv").config()



app.use(express.json()) /* parsing */


/* api route */
app.use("/send-message",sendMessage)


app.listen(process.env.PORT, () => {
    console.log("app running")
})






