const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

function search(regex, data){
    let a;
    while ((a = regex.exec(data)) !== null) {
        if (a.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        return a[1];
    }
}

async function getImportantInformation(client_id, redirect_uri){
    const res = await fetch(`https://login.skype.com/login/oauth/microsoft?client_id=${client_id}&redirect_uri=${redirect_uri}`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Not_A Brand\";v=\"24\", \"Opera GX\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": ""
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET"
    });
    data = await res.text();
    console.log(data)
    const regex_PPFT = /<input.*?name="PPFT".*?value="(.*?)"/gm;
    const regex_MSPOK = /MSPOK=(.*?);/gm;
    const regex_OPID = /&opid=(.*?)&/gm;
    const regex_MSPRequ = /MSPRequ=(.*?);/gm;

    var ppft = search(regex_PPFT, data);
    var MSPOK = search(regex_MSPOK, res.headers.get("set-cookie"));
    var OPID = search(regex_OPID, data);
    var MSPRequ = search(regex_MSPRequ, res.headers.get("set-cookie"));
    /*
    console.log(data);
    console.log(ppft);
    console.log(MSPOK);
    console.log(MSPRequ);
    */

    return {ppft: ppft, MSPOK: MSPOK, OPID:OPID, MSPRequ: MSPRequ};
}

//getImportantInformation("578134", "https://web.skype.com")

async function checkExists(email){
    var tokens = await getImportantInformation("578134", "https://web.skype.com")
    const res = await fetch("https://login.live.com/GetCredentialType.srf", {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json; charset=UTF-8",
        "hpgact": "0",
        "hpgid": "33",
        "sec-ch-ua": "\"Chromium\";v=\"112\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": `uaid=; cltm=; MSPRequ=; MSCC=; MSPOK=${tokens.MSPOK}; OParams=; MicrosoftApplicationsTelemetryDeviceId=`,
        "Referer": "https://login.live.com/login.srf",
        "Referrer-Policy": "strict-origin-when-cross-origin"
      },
      "body": `{\"username\":\"${email}\",\"uaid\":\"\",\"isOtherIdpSupported\":false,\"checkPhones\":true,\"isRemoteNGCSupported\":true,\"isCookieBannerShown\":false,\"isFidoSupported\":true,\"forceotclogin\":false,\"otclogindisallowed\":false,\"isExternalFederationDisallowed\":false,\"isRemoteConnectSupported\":false,\"federationFlags\":3,\"isSignup\":false,\"flowToken\":\"${tokens.ppft}\"}`,
      "method": "POST"
    });
    
    const data = await res.json();
    
    if(!data.IfExistsResult){
        console.log(email+" exists");
    }else{
        console.log(email+" does not exist");
    }
}

//checkExists("email@gmail.com");

async function getToken(email, password){
    console.log("LOGIN STAGE 01");
    tokens = await getImportantInformation("578134", "https://web.skype.com");

    let data;

    console.log("LOGIN STAGE 02");
    const res_stage2 = await fetch(`https://login.live.com/ppsecure/post.srf?wa=wsignin1.0&wp=MBI_SSL&wreply=https://lw.skype.com/login/oauth/proxy?client_id=578134&site_name=lw.skype.com&redirect_uri=https%3A%2F%2Fweb.skype.com%2F`, {
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
            "cookie": `MSPRequ=${tokens.MSPRequ}; MSPOK=${tokens.MSPOK}; CkTst=G${Date.now()}`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": {
            "login":email,
            "passwd":password,
            "PPFT":tokens.ppft,
            "loginoptions":"3"
        },
        "method": "POST"
    });

    data = await res_stage2.text();
    console.log(tokens.OPID);
    console.log(tokens.MSPOK);
    console.log(tokens.ppft);
    console.log(tokens.MSPRequ)
    console.log(res_stage2.headers.get("set-cookie"))
    const regex_OPID = /&opid=(.*?)&/gm;
    const regex_MSPOK = /MSPOK=(.*?);/gm;
    tokens.OPID = search(regex_OPID, data);
    tokens.MSPOK = search(regex_MSPOK, res_stage2.headers.get("set-cookie"));

    console.log("LOGIN STAGE 03");
    console.log(tokens.OPID);
    res_stage3 = await fetch(`https://login.live.com/ppsecure/post.srf?wa=wsignin1.0&wp=MBI_SSL&wreply=https://lw.skype.com/login/oauth/proxy?client_id=578134&site_name=lw.skype.com&redirect_uri=https%3A%2F%2Fweb.skype.com%2F`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "cache-control": "max-age=0",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Not_A Brand\";v=\"24\", \"Opera GX\";v=\"98\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "cookie": `MSPRequ=${tokens.MSPRequ}; MSPOK=${tokens.MSPOK}; CkTst=G${Date.now()}`,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": JSON.stringify({
            "opid":tokens.OPID,
            "PPFT":tokens.ppft,
            "site_name":"lw.skype.com",
            "oauthPartner": "999",
            "client_id": "578134",
            "redirect_uri": "https://web.skype.com",
            "type": "28"
        }),
        "method": "POST"
    });

    //console.log(await res_stage3.text())
    const regex_token = /id="t" value="(.*?)"/gm;
    let token = search(regex_token, data);
    console.log(tokens.MSPOK);
    console.log(tokens.ppft);
    console.log(tokens.MSPRequ)
    console.log(token)
}

getToken("josht8160@gmail.com","&pxk%8Yy");