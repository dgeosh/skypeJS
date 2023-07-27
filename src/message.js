"use strict";

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

class Message {
    constructor(
        id,
        arrivalTime,
        messageType,
        version,
        composeTime,
        clientMessageID,
        conversationLink,
        content,
        conversationID,
        from
    ) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.messageType = messageType;
        this.version = version;
        this.composeTime = composeTime;
        this.clientMessageID = clientMessageID;
        this.conversationLink = conversationLink;
        this.content = content;
        this.conversationID = conversationID;
        this.from = from;
    }

    async edit(content) {
        const res = await fetch(
            `${credentials.msgHost}/v1/users/ME/conversations/${encodeURIComponent(this.conversationID)}/messages/${this.id}`,
            {
                headers: {
                    authentication: `skypetoken=${credentials.skypeToken}`,
                    "content-type": "application/json",
                    registrationtoken: `registrationToken=${credentials.regToken}; expires=${credentials.r_expiry}`,
                },
                body: `{"messagetype":"RichText","content":"${content}"}`,
                method: "PUT",
            }
        );
        console.log("Edit -", res.statusText, res.status);
    }

    async delete() {
        const res = await fetch(
            `${credentials.msgHost}/v1/users/ME/conversations/${encodeURIComponent(this.conversationID)}/messages/${this.id}`,
            {
                headers: {
                    authentication: `skypetoken=${credentials.skypeToken}`,
                    registrationtoken: `registrationToken=${credentials.regToken}; expires=${credentials.r_expiry}`,
                },
                method: "DELETE",
            }
        );
        console.log("Delete -", res.statusText, res.status);
    }
}

module.exports = {
    Message,
};
