"use strict";

const { Message } = require("./message");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { replaceAll } = require("./util");

class Convo {
    #syncState;
    constructor(id) {
        this.id = id;
        this.messages = [];
        this.icon;
    }

    async sendMessage(content) {
        const res = await fetch(
            `${
                credentials.msgHost
            }/v1/users/ME/conversations/${encodeURIComponent(
                this.id
            )}/messages`,
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

    async getMessages(pageSize = 20) {
        if (pageSize > 200) {
            pageSize = 200;
        }
        if (!this.#syncState) {
            this.#syncState = `${
                credentials.msgHost
            }/v1/users/ME/conversations/${encodeURIComponent(
                this.id
            )}/messages?view=supportsExtendedHistory%7Cmsnp24Equivalent%7CsupportsMessageProperties&pageSize=${pageSize}&startTime=1`;
        }
        const res = await await fetch(this.#syncState, {
            headers: {
                authentication: `skypetoken=${credentials.skypeToken}`,
                registrationtoken: `registrationToken=${credentials.regToken}; expires=${credentials.r_expiry}`,
            },
            method: "GET",
        });
        let data = await res.json();
        data.messages.forEach((element) => {
            let toAdd = new Message(
                element.id,
                element.originalarrivaltime,
                element.messagetype,
                element.version,
                element.composetime,
                element.clientmessageid,
                element.conversationLink,
                element.content,
                element.conversationid,
                element.from
            );
            this.messages.push(toAdd);
        });
        this.#syncState =
            credentials.msgHost +
            replaceAll(data._metadata.syncState, [
                ["|", "%7C"],
                [":", "%3A"],
            ]).split("gateway.messenger.live.com")[1];
        return this.messages;
    }
}

class SkypeDM extends Convo {
    constructor(id) {
        super();
        this.id = id;
    }
}

class SkypeGC extends Convo {
    constructor(id) {
        super();
        this.id = id;

        this.users;
    }
}

class Convos extends Map {
    #syncState;
    constructor() {
        super();
        this.arr = [];
        this.#syncState = null;
    }

    async recents(pageSize = 200) {
        if (pageSize > 200) {
            pageSize = 200;
        }
        if (!this.#syncState) {
            this.#syncState = `${credentials.msgHost}/v1/users/ME/conversations?view=supportsExtendedHistory%7Cmsnp24Equivalent&pageSize=${pageSize}&startTime=1&targetType=Passport%7CSkype%7CLync%7CThread%7CAgent%7CShortCircuit%7CPSTN%7CFlxt%7CNotificationStream%7CModernBots%7CsecureThreads%7CInviteFree`;
        }
        const res = await fetch(this.#syncState, {
            headers: {
                authentication: `skypetoken=${credentials.skypeToken}`,
                registrationtoken: `registrationToken=${credentials.regToken};`,
            },
        });
        let data = await res.json();
        try {
            data.conversations.forEach((element) => {
                if (Array.from(element.id)[0] == "8") {
                    let toAdd = new SkypeDM(element.id);
                    this.set(element.id, toAdd);
                    this.arr.push(toAdd);
                } else if (
                    Array.from(element.id)[0] + Array.from(element.id)[1] ==
                    "19"
                ) {
                    let toAdd = new SkypeGC(element.id);
                    this.set(element.id, toAdd);
                    this.arr.push(toAdd);
                }
            });
        } catch (e) {
            console.log("No retrievable conversations!");
        }
        this.#syncState = replaceAll(data._metadata.syncState, [["|", "%7C"]]);
        return data.conversations;
    }

    async addChat(id) {
        if (Array.from(element.id)[0] == "8") {
            this.set(element.id, new SkypeDM(element.id));
        } else if (
            Array.from(element.id)[0] + Array.from(element.id)[1] ==
            "19"
        ) {
            this.set(element.id, new SkypeGC(element.id));
        }
    }
}

module.exports = {
    Convo,
    Convos,
};
