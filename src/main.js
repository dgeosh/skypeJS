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
            this.conv = null;
        }
        async login(user, pass){
            this.auth.connect(user, pass).then(()=>{
                this.conv = new Convos(this.auth.authInfo());
                this.emit('ready');
            })
        }
    }
}