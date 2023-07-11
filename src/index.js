const { Client } = require('./main.js');

c = new Client();

c.on('ready', ()=>{
    
})

c.login(process.env.USERNAME, process.env.PASSWORD)