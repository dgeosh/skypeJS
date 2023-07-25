"use strict"

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const { EventEmitter } = require("events");
const { Connection } = require("./auth");
const { Convos } = require("./chat");

module.exports = {
    Client: class extends EventEmitter{
        constructor (){
            super();
            this.auth = new Connection();
            this.convos;
        }
        async login(user, pass){
            this.auth.connect(user, pass).then(()=>{
                global.credentials = this.auth;
                this.convos = new Convos();
                this.emit('ready');
            })
        }
        async 
    }
}