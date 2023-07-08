const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cryptoJS = require("crypto-js");

function search(regex, data) {
    let a;
    while ((a = regex.exec(data)) !== null) {
        if (a.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        return a[1];
    }
}

function getMac256Hash(
    challenge,
    appId = "msmsgs@msnmsgr.com",
    key = "Q1P7W2E4J9R8U3S5"
) {
    function zip(a, b) {
        return a.map((x, i) => [x, b[i]]);
    }

    var cchClearText,
        clearText,
        dpos,
        macHash,
        macParts,
        pClearText,
        sha256Hash,
        hash;
    clearText = challenge + appId;
    for (let i = 0, j = 8 - (clearText.length % 8); i < j; i++) {
        clearText += "0";
    }

    function int32ToHexString(n) {
        var hexChars, hexString;
        hexChars = "0123456789abcdef";
        hexString = "";

        for (var i = 0, _pj_a = 4; i < _pj_a; i += 1) {
            hexString += hexChars[(n >> (i * 8 + 4)) & 15];
            hexString += hexChars[(n >> (i * 8)) & 15];
        }

        return hexString;
    }

    function int64Xor(inputarray) {
        let a = inputarray[0];
        let b = inputarray[1];
        var diff, sA, sB, sC, sD;
        sA = `${a.toString(2)}`;
        sB = `${b.toString(2)}`;
        sC = "";
        sD = "";
        diff = Math.abs(sA.length - sB.length);

        for (var i = 0, _pj_a = diff; i < _pj_a; i += 1) {
            sD += "0";
        }

        if (sA.length < sB.length) {
            sD += sA;
            sA = sD;
        } else {
            if (sB.length < sA.length) {
                sD += sB;
                sB = sD;
            }
        }

        for (var i = 0, _pj_a = sA.length; i < _pj_a; i += 1) {
            sC += sA[i] === sB[i] ? "0" : "1";
        }

        return Number.parseInt(sC, 2);
    }

    function cS64(pdwData, pInHash) {
        var CS64_a,
            CS64_b,
            CS64_c,
            CS64_d,
            CS64_e,
            MODULUS,
            pos,
            qwDatum,
            qwMAC,
            qwSum;
        MODULUS = 2147483647;
        CS64_a = pInHash[0] & MODULUS;
        CS64_b = pInHash[1] & MODULUS;
        CS64_c = pInHash[2] & MODULUS;
        CS64_d = pInHash[3] & MODULUS;
        CS64_e = 242854337;
        pos = 0;
        qwDatum = BigInt(0);
        qwMAC = BigInt(0);
        qwSum = BigInt(0);

        let iter = Math.floor(pdwData.length / 2);
        for (var i = 0; i < iter; i++) {
            qwDatum = Number.parseInt(pdwData[pos]);
            pos += 1;
            qwDatum = BigInt(qwDatum) * BigInt(CS64_e);
            qwDatum = BigInt(qwDatum) % BigInt(MODULUS);
            qwMAC += BigInt(qwDatum);
            qwMAC *= BigInt(CS64_a);
            qwMAC += BigInt(CS64_b);
            qwMAC = BigInt(qwMAC) % BigInt(MODULUS);
            qwSum += BigInt(qwMAC);
            qwMAC += BigInt(Number.parseInt(pdwData[pos]));
            pos += 1;
            qwMAC *= BigInt(CS64_c);
            qwMAC += BigInt(CS64_d);
            qwMAC = BigInt(qwMAC) % BigInt(MODULUS);
            qwSum += BigInt(qwMAC);
        }
        qwMAC += BigInt(CS64_b);
        qwMAC = BigInt(qwMAC) % BigInt(MODULUS);
        qwSum += BigInt(CS64_d);
        qwSum = BigInt(qwSum) % BigInt(MODULUS);

        return [qwMAC, qwSum];
    }

    cchClearText = Math.floor(clearText.length / 4);
    pClearText = new Array(cchClearText);

    for (var i = 0, _pj_a = cchClearText; i < _pj_a; i++) {
        pClearText[i] = 0;

        for (var pos = 0; pos < 4; pos++) {
            pClearText[i] +=
                clearText.charCodeAt(4 * i + pos) * Math.pow(256, pos);
        }
    }

    sha256Hash = [0, 0, 0, 0];
    hash = cryptoJS
        .SHA256((challenge + key).toString(cryptoJS.enc.Utf8))
        .toString(cryptoJS.enc.Hex)
        .toUpperCase();
    for (var i = 0, _pj_a = sha256Hash.length; i < _pj_a; i += 1) {
        sha256Hash[i] = 0;

        for (var pos = 0, _pj_b = 4; pos < _pj_b; pos += 1) {
            dpos = 8 * i + pos * 2;
            sha256Hash[i] +=
                Number.parseInt(hash.slice(dpos, dpos + 2), 16) *
                Math.pow(256, pos);
        }
    }

    macHash = cS64(pClearText, sha256Hash);
    macParts = [macHash[0], macHash[1], macHash[0], macHash[1]];
    return zip(sha256Hash, macParts)
        .map(int64Xor)
        .map(int32ToHexString)
        .join("");
}

async function s1() {
    let s1 = await fetch(
        "https://login.skype.com/login/oauth/microsoft?client_id=572381&partner=999&redirect_uri=https://web.skype.com/Auth%2FPostHandler"
    );

    s1text = await s1.text();
    s1cookies = s1.headers.get("set-cookie");

    return {
        ppft: search(/<input.*?name="PPFT".*?value="(.*?)"/gm, s1text),
        uaid: search(/uaid=(.*?);/gm, s1cookies),
        msprequ: search(/MSPRequ=(.*?);/gm, s1cookies),
        mscc: search(/MSCC=(.*?);/gm, s1cookies),
        mspok: search(/MSPOK=(.*?);/gm, s1cookies),
        oparams: search(/OParams=(.*?);/gm, s1cookies),
    };
}

async function s2(u,p) {
    var { ppft, uaid, msprequ, mscc, mspok, oparams } = await s1();

    let s2 = await fetch(
        "https://login.live.com/ppsecure/post.srf?wa=wsignin1.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D578134%26site_name%3Dlw.skype.com%26redirect_uri%3Dhttps%253A%252F%252Fweb.skype.com%252F",
        {
            headers: {
                Cookie: `uaid=${uaid}; cltm=cf:ReservedFlight33$2cReservedFligh; MSPRequ=${msprequ}; MSCC=${mscc}; MSPOK=${mspok}; OParams=${oparams}; MSPRequ=${msprequ}; MSPOK=${mspok}; CkTst=G${Date.now()}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `login=${encodeURIComponent(u)}&passwd=${encodeURIComponent(p)}&PPFT=${encodeURIComponent(ppft)}&loginoptions=3`,
            method: "POST",
        }
    );

    s2text = await s2.text();
    s2cookies = s2.headers.get("set-cookie");

    return {
        opid: search(/opid=(.*?)&/gm, s2text),
        ppft: ppft,
        uaid: search(/uaid=(.*?);/gm, s2cookies),
        msprequ: msprequ,
        mscc: mscc,
        mspok: search(/e, MSPOK=(.*?);/gm, s2cookies),
        oparams: search(/OParams=(.*?);/gm, s2cookies),
        host_msaauth: search(/__Host-MSAAUTH=(.*?);/gm, s2cookies),
    };
}

async function s3(u,p) {
    var { opid, ppft, uaid, msprequ, mscc, mspok, oparams, host_msaauth } =
        await s2(u,p);

    s3 = await fetch(
        "https://login.live.com/ppsecure/post.srf?wa=wsignin1.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D578134%26site_name%3Dlw.skype.com%26redirect_uri%3Dhttps%253A%252F%252Fweb.skype.com%252F",
        {
            headers: {
                Cookie: `uaid=${uaid}; cltm=cf:ReservedFlight33$2cReservedFligh; MSPRequ=${msprequ}; MSCC=${mscc}; MSPOK=${mspok}; OParams=${oparams}; MSPRequ=${msprequ}; MSPOK=${mspok}; __Host-MSAAUTH=${host_msaauth}; PPLState=1; MSPRequ=${msprequ}; MSPOK=${mspok}; CkTst=G${Date.now()}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `opid=${opid}&PPFT=${ppft}&site_name=lw.skype.com&oauthPartner=999&client_id=578134&redirect_uri=https%3A%2F%2Fweb.skype.com&type=28`,
            method: "POST",
        }
    );
    
    return search(/<input.*?name="t".*?value="(.*?)"/gm, await s3.text());
}

async function getSkypeToken(u,p) {
    const res = await fetch(
        "https://login.skype.com/login/microsoft?client_id=572381&redirect_uri=https%3A%2F%2Fweb.skype.com%2FAuth%2FPostHandler",
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
            },
            body: `t=${await s3(u,p)}&oauthPartner=999&client_id=572381&redirect_uri=https%3A%2F%2Fweb.skype.com%2FAuth%2FPostHandler`,
            method: "POST",
        }
    );
    
    let data = await res.text();

    return {
        token:search(/<input.*?name="skypetoken".*?value="(.*?)"/gm,data),
        expiry:search(/<input.*?name="expires_in".*?value="(.*?)"/gm,data)
    }
}

async function testSkypeToken(u,p) {
    let {token, expiry} = await getSkypeToken(u,p);
    const res = await fetch(
        "https://prod.registrar.skype.com/v2/registrations",
        {
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "x-skypetoken": token,
            },
            body: '{"registrationId":"07baca20-cccf-45dd-aa45-fda5cc870035","nodeId":"","clientDescription":{"appId":"com.microsoft.skype.s4l-df.web","platform":"web","languageId":"en-US","templateKey":"com.microsoft.skype.s4l-df.web:2.9","platformUIVersion":"1418/8.98.0.208/"},"transports":{"TROUTER":[{"context":"","creationTime":"","path":"https://trouter-azsc-uswe-0-a.trouter.skype.com:3443/v4/f/nPlBszDljUOure16-KLeMw/","ttl":586304}]}}',
            method: "POST",
        }
    );
    if (res.status == 202) {
        return {token,expiry};
    } else {
        console.log(res.status, res.statusText);
        process.exit("1");
    }
}

async function getRegistrationToken(u,p) {
    let {token, expiry} = await testSkypeToken(u,p);
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
    l_og = "https://client-s.gateway.messenger.live.com/v1/users/ME/endpoints";
    let res = await fetch(l_og, getInfo());
    let l_new = res.headers.get("location");
    if (l_new != l_og) {
        timenow = Math.floor(Date.now() / 1000);
        res = await fetch(l_new, getInfo());
    }
    tokencapsule = res.headers.get("set-registrationtoken");
    return {
        regToken: search(/registrationToken=(.*?);/gm, tokencapsule),
        r_expiry: search(/expires=(.*?);/gm, tokencapsule),
        skypeToken: token,
        s_expiry: expiry
    };
}

async function connect(username,password){
    return await getRegistrationToken(username,password);
}

async function sendMessage() {
    let {regToken, r_expiry, skypeToken, s_expiry} = await getRegistrationToken();
    const res = await fetch(
        "https://azwus1-client-s.gateway.messenger.live.com/v1/users/ME/conversations/8%3Alive%3A.cid.501d2901ffa9201a/messages",
        {
            headers: {
                accept: "application/json",
                "accept-language": "en-US,en;q=0.9",
                authentication: `skypetoken=${skypeToken}`,
                behavioroverride: "redirectAs404",
                clientinfo:
                    "os=Windows; osVer=10; proc=x86; lcid=en-US; deviceType=1; country=US; clientName=skype4life; clientVer=1418/8.99.0.202//skype4life; timezone=America/Los_Angeles",
                "content-type": "application/json",
                registrationtoken: `registrationToken=${regToken}; expires=1687737375; endpointId={00000000-0000-0000-0000-000000000000}`,
                "sec-ch-ua":
                    '"Opera GX";v="99", "Chromium";v="113", "Not-A.Brand";v="24"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "x-ecs-etag": '"00000000000000000000000000000000000000000000"',
                Referer: "https://web.skype.com/",
                "Referrer-Policy": "strict-origin",
            },
            body: `{\"clientmessageid\":\"${Date.now()}\",\"content\":\"test\",\"messagetype\":\"RichText\",\"contenttype\":\"text\"}`,
            method: "POST",
        }
    );

    console.log(res.status, res.statusText);
}

async function main() {
    console.log("JAVASCRIPT - LOGIN")
    connect("josht8160@gmail.com","1r4ce3y^")
}

main();
