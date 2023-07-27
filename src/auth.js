"use strict";

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const { search, getMac256Hash } = require("./util");

class Connection {
    constructor(user, pass){
        if (user && pass){
            this.connect(user, pass);
        }
        this.stage = 0;
    }

    async s1() {
        const s1 = await fetch(
            "https://login.skype.com/login/oauth/microsoft?client_id=572381&partner=999&redirect_uri=https://web.skype.com/Auth%2FPostHandler",
        ).then(console.log("0%"))

        let s1text = await s1.text();
        let s1cookies = s1.headers.get("set-cookie");

        return {
            ppft: await search(/<input.*?name="PPFT".*?value="(.*?)"/gm, s1text),
            uaid: await search(/uaid=(.*?);/gm, s1cookies),
            msprequ: await search(/MSPRequ=(.*?);/gm, s1cookies),
            mscc: await search(/MSCC=(.*?);/gm, s1cookies),
            mspok: await search(/MSPOK=(.*?);/gm, s1cookies),
            oparams: await search(/OParams=(.*?);/gm, s1cookies),
        };
    }

    async s2() {
        let { ppft, uaid, msprequ, mscc, mspok, oparams } = await this.s1();
        
        const s2 = await fetch(
            "https://login.live.com/ppsecure/post.srf?wa=wsignin1.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D578134%26site_name%3Dlw.skype.com%26redirect_uri%3Dhttps%253A%252F%252Fweb.skype.com%252F",
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': `uaid=${uaid}; cltm=cf:ReservedFlight33$2cReservedFligh; MSPRequ=${msprequ}; MSCC=${mscc}; MSPOK=${mspok}; OParams=${oparams}; MSPRequ=${msprequ}; MSPOK=${mspok}; CkTst=G${Date.now()}`,
                },
                body: `login=${encodeURIComponent(this.username)}&passwd=${encodeURIComponent(this.password)}&PPFT=${encodeURIComponent(ppft)}&loginoptions=3`,
                method: "POST",
            }
        ).then(console.log("16.7%"))

        let s2text = await s2.text();
        let s2cookies = s2.headers.get("set-cookie");

        return {
            opid: await search(/opid=(.*?)&/gm, s2text),
            ppft: ppft,
            uaid: await search(/uaid=(.*?);/gm, s2cookies),
            msprequ: msprequ,
            mscc: mscc,
            mspok: '$uuid'+await search(/, MSPOK=\$uuid(.*?);/gm, s2cookies),
            oparams: await search(/OParams=(.*?);/gm, s2cookies),
            host_msaauth: await search(/__Host-MSAAUTH=(.*?);/gm, s2cookies),
        };
    }

    async s3() {
        let { opid, ppft, uaid, msprequ, mscc, mspok, oparams, host_msaauth } =
            await this.s2();

        const s3 = await fetch(
            "https://login.live.com/ppsecure/post.srf?wa=wsignin1.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D578134%26site_name%3Dlw.skype.com%26redirect_uri%3Dhttps%253A%252F%252Fweb.skype.com%252F",
            {
                headers: {
                    "Cookie": `uaid=${uaid}; cltm=cf:ReservedFlight33$2cReservedFligh; MSPRequ=${msprequ}; MSCC=${mscc}; MSPOK=${mspok}; OParams=${oparams}; MSPRequ=${msprequ}; MSPOK=${mspok}; __Host-MSAAUTH=${host_msaauth}; PPLState=1; MSPRequ=${msprequ}; MSPOK=${mspok}; CkTst=G${Date.now()}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `opid=${opid}&PPFT=${ppft}&site_name=lw.skype.com&oauthPartner=999&client_id=578134&redirect_uri=https%3A%2F%2Fweb.skype.com&type=28`,
                method: "POST",
            }
        ).then(console.log("33.3%"))
        
        return await search(/<input.*?name="t".*?value="(.*?)"/gm, await s3.text());
    }

    async getSkypeToken() {
        const res = await fetch(
            "https://login.skype.com/login/microsoft?client_id=572381&redirect_uri=https%3A%2F%2Fweb.skype.com%2FAuth%2FPostHandler",
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `t=${await this.s3()}&oauthPartner=999&client_id=572381&redirect_uri=https%3A%2F%2Fweb.skype.com%2FAuth%2FPostHandler`,
                method: "POST",
            }
        ).then(console.log("50.0%"))
        
        let data = await res.text();

        return {
            token:await search(/<input.*?name="skypetoken".*?value="(.*?)"/gm,data),
            expiry:await search(/<input.*?name="expires_in".*?value="(.*?)"/gm,data)
        }
    }

    async testSkypeToken(token) {
        const res = await fetch(
            "https://prod.registrar.skype.com/v2/registrations",
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-skypetoken": token,
                },
                body: '{"registrationId":"07baca20-cccf-45dd-aa45-fda5cc870035","nodeId":"","clientDescription":{"appId":"com.microsoft.skype.s4l-df.web","platform":"web","languageId":"en-US","templateKey":"com.microsoft.skype.s4l-df.web:2.9","platformUIVersion":"1418/8.98.0.208/"},"transports":{"TROUTER":[{"context":"","creationTime":"","path":"https://trouter-azsc-uswe-0-a.trouter.skype.com:3443/v4/f/nPlBszDljUOure16-KLeMw/","ttl":586304}]}}',
                method: "POST",
            }
        ).then(console.log("66.7%"))
        if (res.status != 202) {
            console.log(res.status, res.statusText);
            process.exit("1");
        }
    }

    async getRegistrationToken() {
        let {token, expiry} = await this.getSkypeToken();
        this.testSkypeToken(token);
        function getInfo() {
            let timenow = Math.floor(Date.now() / 1000);
            return {
                headers: {
                    LockAndKey: `appId=msmsgs@msnmsgr.com; time=${timenow}; lockAndKeyResponse=${getMac256Hash(
                        timenow.toString()
                    )}`,
                    Authentication: `skypetoken=${token}`,
                    BehaviorOverride: "redirectAs404",
                },
                body: JSON.stringify({ endpointFeatures: "Agent" }),
                method: "POST",
            };
        }
        let l_og = "https://client-s.gateway.messenger.live.com/v1/users/ME/endpoints";
        let res = await fetch(l_og, getInfo()).then(console.log("83.3%"))
        let l_new = res.headers.get("location");
        if (l_new != l_og) {
            res = await fetch(l_new, getInfo()).then(console.log("100%"))
        }
        let tokencapsule = res.headers.get("set-registrationtoken") + ";";
        let location = await search(/https(.*?)\.com/gm, res.headers.get("location"));
        let returnVals = {
            msgHost: "https"+location+".com",
            regToken: await search(/registrationToken=(.*?);/gm, tokencapsule),
            r_expiry: await search(/expires=(.*?);/gm, tokencapsule),
            skypeToken: token,
            s_expiry: expiry
        };
        if (!location) {
            res = await fetch("https://client-s.gateway.messenger.live.com/v1/users/ME/endpoints", {
                "headers": {
                    "authentication": token,
                    "content-type": "application/json",
                    "registrationtoken": `registrationToken=${returnVals.regToken}; expires=${returnVals.r_expiry}`,
                },
                "body": "{}",
                "method": "POST"
            });
            location = await search(/https(.*?)\.com/gm, res.headers.get("location"));
            returnVals.msgHost = "https"+location+".com";
        }
        return returnVals;
    }

    async connect (user, pass){
        this.username = user;
        this.password = pass;
        let { msgHost, regToken, r_expiry, skypeToken, s_expiry } = await this.getRegistrationToken();
        this.msgHost = msgHost;
        this.regToken = regToken;
        this.r_expiry = r_expiry;
        this.skypeToken = skypeToken;
        this.s_expiry = s_expiry;
        console.log("Login complete!")
        return;
    }

    authInfo () {
        return {
            msgHost: this.msgHost,
            regToken: this.regToken,
            r_expiry: this.r_expiry,
            skypeToken: this.skypeToken,
            s_expiry: this.s_expiry
        }
    }
}

module.exports = {
    Connection
}
