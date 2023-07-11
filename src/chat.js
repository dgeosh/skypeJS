const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = {
    Convo: class {

    },

    Convos: class {
        constructor(auth) {
            this.auth = auth;
        }

        async sendMessage(content) {
            const res = await fetch(
                `${this.auth.msgHost}/v1/users/ME/conversations/8%3Alive%3Adimitri.chrysafis/messages`,
                {
                    headers: {
                        "content-type": "application/json",
                        authentication: `skypetoken=${this.auth.skypeToken}`,
                        registrationtoken: `registrationToken=${this.auth.regToken};`,
                    },
                    body: `{"clientmessageid":"${Date.now()}","content":"${content}","messagetype":"RichText","contenttype":"text"}`,
                    method: "POST",
                }
            );
        
            console.log(res.status, res.statusText);
        }
    }
}