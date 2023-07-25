"use strict";

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
    Convo: class {
        constructor(id, auth){
            this.id;
        }

        async sendMessage(content) {
            const res = await fetch(
                `${credentials.msgHost}/v1/users/ME/conversations/8%3Alive%3Adimitri.chrysafis/messages`,
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
    },

    Convos: class {
        constructor() {
        }
    }
}