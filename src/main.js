"use strict"

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
require("dotenv").config();
const { EventEmitter } = require("events");
const { Connection } = require("./auth");
const { Convos } = require("./chat");

class Client extends EventEmitter{
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
    async sendMessage(id, content){
        const res = await fetch(
            `${credentials.msgHost}/v1/users/ME/conversations/${encodeURIComponent(id)}/messages`,
            {
                headers: {
                    "content-type": "application/json",
                    authentication: `skypetoken=${credentials.skypeToken}`,
                    registrationtoken: `registrationToken=${credentials.regToken};`,
                },
                body: `{"clientmessageid":"${Date.now()}","content":"${content}","messagetype":"RichText","contenttype":"text"}`,
                method: "POST",
            }
        );
    
        console.log(res.status, res.statusText);
    }
}

module.exports = {
    Client
}
