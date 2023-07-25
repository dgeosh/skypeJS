"use strict";

const { Client } = require('./main.js');
require('dotenv').config();

let c = new Client();

c.on('ready', ()=>{
    c.convos.sendMessage("testing testing 123")
    //c.getConvo().sendMessage();
})


c.login(`${process.env.EMAIL}`,`${process.env.PASSWORD}`)