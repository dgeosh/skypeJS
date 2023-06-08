const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cryptoJS = require("crypto-js");

function search(regex, data){
    let a;
    while ((a = regex.exec(data)) !== null) {
        if (a.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        return a[1];
    }
}

function zip (a, b) {
    return a.map((x, i) => [x, b[i]])
}

function getMac256Hash(challenge, appId = "msmsgs@msnmsgr.com", key = "Q1P7W2E4J9R8U3S5") {
    /*
    Generate the lock-and-key response, needed to acquire registration tokens.
    */
    var cchClearText, clearText, dpos, macHash, macParts, pClearText, sha256Hash, hash;
    clearText = challenge + appId;
    for (let i = 0, j = 8-clearText.length % 8; i < j; i++){
        clearText += "0";
    }

    function int32ToHexString(n) {
        var hexChars, hexString;
        hexChars = "0123456789abcdef";
        hexString = "";

        for (var i = 0, _pj_a = 4; i < _pj_a; i += 1) {
            hexString += hexChars[n >> i * 8 + 4 & 15];
            hexString += hexChars[n >> i * 8 & 15];
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
        var CS64_a, CS64_b, CS64_c, CS64_d, CS64_e, MODULUS, pos, qwDatum, qwMAC, qwSum;
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
        for (var i = 0; i<iter; i++) {
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
            pClearText[i] += (clearText.charCodeAt(4 * i + pos)) * Math.pow(256, pos);
        }
    }

    sha256Hash = [0, 0, 0, 0];
    hash = cryptoJS.SHA256((challenge+key).toString(cryptoJS.enc.Utf8)).toString(cryptoJS.enc.Hex).toUpperCase();   
    for (var i = 0, _pj_a = sha256Hash.length; i < _pj_a; i += 1) {
        sha256Hash[i] = 0;

        for (var pos = 0, _pj_b = 4; pos < _pj_b; pos += 1) {
            dpos = 8 * i + pos * 2;
            sha256Hash[i] += Number.parseInt(hash.slice(dpos, dpos + 2), 16) * Math.pow(256, pos);
        }
    }

    macHash = cS64(pClearText, sha256Hash);
    macParts = [macHash[0], macHash[1], macHash[0], macHash[1]];
    return zip(sha256Hash, macParts).map(int64Xor).map(int32ToHexString).join("");
}
  

async function test(){
    var res = await fetch("https://web.skype.com/", {
        "headers": {
            "Cache-Control": "no-cache",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari 537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "en-US,en;q=0.9",
            "Sec-Ch-Ua": "\"Google Chrome\";v=\"113\", \"Chromium\";v=\"113\", \"Not-A.Brand\";v=\"24\"",
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "\"Windows\"",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1"

        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        redirect: 'manual',
        "method": "GET"
    });
    console.log(res);
    console.log(res.headers.get("set-cookie"));
    
    const regex_PPFT = /<input.*?name="PPFT".*?value="(.*?)"/gm;
    
}
//test();

//NEED TO GET: 
//   1. OPID
//   2. __Host-MSAAUTH
//   3. MSPOK
//   4. OParams
//   5. PPFT



async function test2(){
    const res = await fetch("https://login.live.com/ppsecure/post.srf?opid=4D8381037CADC697", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Not_A Brand\";v=\"24\", \"Opera GX\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": "uaid=74bc2e7b402b445b92aeafd7a39ee132; cltm=cf:ReservedFlight33$2cReservedFligh; MSPRequ=id=293290&lt=1686135924&co=1; MSCC=76.126.229.37-US; MicrosoftApplicationsTelemetryDeviceId=1a90ef0c-4faa-41e0-9dc1-41caf82926bb; ai_session=roARc946dtFy53KNs6NhOi|1686135927205|1686135927205; MSFPC=GUID=a82d2b8c35d340069669bbe6b7474433&HASH=a82d&LV=202306&V=4&LU=1686135929331; wlidperf=FR=L&ST=1686135931083; __Host-MSAAUTH=-M.C107_BL2.CUInNtDiTTITPtjZLgtVMeWv64Rvwb7NBCmrG3r37roit1CkLa6X55rpMY0TmnHcu*NobQrnHhiIPnyUAzSwlAZMhmBbfUdH2BoN30JHSyJA9h*dq8pt14BpGVSha*u2TDFxuwffBxGATWAo2wnbgFEcAnmLgmbwEm4cu3ouq9du!SG2mHocjyCaeAMCKW5xtECgqrYiU6fbU8AyfUNPoG1JIDpehpYE11BZFVFD!tkD; PPLState=1; MSPOK=$uuid-2c6c482c-4496-417b-8066-0fadc4b3daa0$uuid-db38a352-a24b-422b-8089-deca2bcb613f$uuid-685f3b4d-ad63-42f2-b33c-e1ea7a5db561; OParams=11O.DYrdAkpxq6NQk7m56xR42Tinm!E206vWn6zIqKlhCRB4W*u2hZ!Y30juRSEwLTyx9Yna9X0ORRiExpLvD1IMLCNHibOBqTwqIpTUBTR6!T9fTkfCvBZl9cPdzaAXtB11LJZ20nbvYi4ClKLrsBOHRQ9p1JRMqDhNV9g72gJ*2jAHeuJ2eyNBWFc2pPMtL5aox7nuNdTqOLRhSS1owvN2aOKEiqo0JufBhGMeDgsdgSLJ2M2vQifhKu46W3l7umW0yvjXho9yylPvftQW9IEj3EgAjkPhvCjRK!SmaKkHcaxS0FYZrC1T3t8Qfx1m5nMRZpuAQyyF0k1RRpY0RTvxtKczf*9Zks!4dlMrDk7czLuKiuKkMIbqUvPVN5mGeNl4J2lDZO1F*K*5TBSO*EIBoMDJAfeqWAlyDvFgLAKNrUsQRBKgDW3x50SN7Mjafq7JUDNRNXb5MQqUY8YcV8H6*LZopUxyEO6DhlkxH2PwVyNI9sVBwKKlkuCwiguCbcZUY0MnATDlX1tW2IdOvnTn45F8X!0n*vMq6Ldl9kevZLeugVu!1XP9!eGsgvEtJjcnnqzO624*UBpN41bUrY77QH1TShdcE2uEEnCB9VDHu62Ngj0XX20u8e8DoEZU5osHVu5PHdD8nOTTXHGKUuz9klYKARQSV17tUTJNWeD4JuFvj5MPoGBBDFt*2RISFrypHzSKMmm*pixuj4YnhdfQQkiAfLpXmzNYoRpRRah*zhgyY5mgyv5VVezPkTYYy0Ot7p4CGdJrB4xUBKmPtSvnj0kKK0NE76TE!oSxXwIM2XHqehN3XEpFkjaN8hA0nrLl2g$$",
            "Referer": "https://login.live.com/ppsecure/post.srf?mkt=en-US&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&id=293290&contextid=6E66C046CF0A6181&opid=FDA9BCD29FC14E59&bk=1685956125&uaid=bb176a45af1f470488ad3b5879db7184&client_flight=ReservedFlight33,ReservedFligh&pid=0",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "type=28&PPFT=-DYL5XqQT8AxFH10QFy5D2FyNy2BtCyrTsgptoDxPulBVU24yPe3q5eZkl8edh91k5wTRxDjmOQu*77tq2KJrKfa1mN4blZUfnl*brarWxcYXvOEc7ljnw0EjysQ6mqUAxUjn8HC08moa2*V6QouDf9aXRfnbEmdrVlf1CZkmXqOp!jyyZH9Hn5lp8vB6QubhWrUIew6G7BefqYEivfn7L2o$",
        "method": "POST"
    })
    
    return search(/<input.*?name="t".*?value="(.*?)"/gm, await res.text());
}


async function getSkypeToken(){
    const res = await fetch("https://login.skype.com/login/microsoft?client_id=572381&redirect_uri=https%3A%2F%2Fweb.skype.com%2FAuth%2FPostHandler", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Not_A Brand\";v=\"24\", \"Opera GX\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-site",
            "upgrade-insecure-requests": "1"
        },
        "referrer": "https://lw.skype.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `t=${await test2()}&oauthPartner=999&client_id=572381&redirect_uri=https%3A%2F%2Fweb.skype.com%2FAuth%2FPostHandler`,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      })
      data = await res.text();
      
      const regex_skype = /<input.*?name="skypetoken".*?value="(.*?)"/gm;
      skypetoken = search(regex_skype, data);
      return skypetoken;
}

async function testSkypeToken() {
    token = await getSkypeToken();
    const res = await fetch("https://prod.registrar.skype.com/v2/registrations", {
        "headers": {
          "accept": "application/json",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/json",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-site",
          "x-skypetoken": token,
          "Referer": "https://web.skype.com/",
          "Referrer-Policy": "strict-origin"
        },
        "body": "{\"registrationId\":\"07baca20-cccf-45dd-aa45-fda5cc870035\",\"nodeId\":\"\",\"clientDescription\":{\"appId\":\"com.microsoft.skype.s4l-df.web\",\"platform\":\"web\",\"languageId\":\"en-US\",\"templateKey\":\"com.microsoft.skype.s4l-df.web:2.9\",\"platformUIVersion\":\"1418/8.98.0.208/\"},\"transports\":{\"TROUTER\":[{\"context\":\"\",\"creationTime\":\"\",\"path\":\"https://trouter-azsc-uswe-0-a.trouter.skype.com:3443/v4/f/nPlBszDljUOure16-KLeMw/\",\"ttl\":586304}]}}",
        "method": "POST"
    });
    if (res.status==202){
        return {status: res.status, text: res.statusText, token: token};
    }else{
        return {status: res.status, text: res.statusText};
    }
}

async function getRegistrationToken(){
    secs = Math.floor(Date.now() / 1000);
    hash = getMac256Hash(secs.toString());
    tokens = await testSkypeToken();
    var info = {
        "headers": {
            "LockAndKey": `appId=msmsgs@msnmsgr.com; time=${secs}; lockAndKeyResponse=${hash}`,
            "Authentication": `skypetoken=${tokens.token}`,
            "BehaviorOverride":"redirectAs404"
        },
        "body": JSON.stringify({"endpointFeatures": "Agent"}),
        "method": "POST",
    }
    var res = await fetch(`https://client-s.gateway.messenger.live.com/v1/users/ME/endpoints`, info);
    location = res.headers.get("location");
    if(location == "https://azwcus1-client-s.gateway.messenger.live.com/v1/users/ME/endpoints"){
        res = await fetch(location,info);
    }
    tokencapsule = res.headers.get("set-registrationtoken");
    regtokenregex = /registrationToken=(.*?);/gm;
    regToken = search(regtokenregex, tokencapsule);
    return {time: secs, hash: hash, regToken: regToken, skypeToken: tokens.token};
}

async function main() {
    results = await getRegistrationToken();
    console.log(results.time + " " + results.hash + " " + results.regToken);
}

main();