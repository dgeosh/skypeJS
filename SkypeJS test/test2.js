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

async function test(){
    res= await fetch("https://login.live.com/ppsecure/post.srf?mkt=en-US&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&id=293290&uaid=5d2638a0c0fd4124894017600a67cf76&client_flight=ReservedFlight33,ReservedFligh&pid=0&opid=9756816B1D3B0B53&route=C107_BAY", {
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
        "cookie": "uaid=5d2638a0c0fd4124894017600a67cf76; cltm=cf:ReservedFlight33$2cReservedFligh; MSPRequ=id=293290&lt=1686519582&co=1; MSCC=76.126.229.37-US; MicrosoftApplicationsTelemetryDeviceId=21e05ebd-4ad9-4ba0-83e8-34310145e209; ai_session=BCA8HFg25PsBYCoJBLCkNR|1686519587338|1686519587338; MSFPC=GUID=c8507ec565344ef5b360ddde44df0eb0&HASH=c850&LV=202306&V=4&LU=1686519590071; wlidperf=FR=L&ST=1686519591677; __Host-MSAAUTH=-M.C107_BAY.CTESpsMmyCxkiKLdUXkY40XzdxpMN!it!XnBAemLOzWuP*8RemWhqfWGspB6dtb!T2fJRr7BmK4CuZZICBewKuz8KDr1kFsgMyyTknhyWTCigdUCc3cwLCNC91!10UaHf2YajLdTSvmwU9OurSFxL3djhuInnaB8GKcSkufxYM8Qn3Nnxz*eF54Hn2V6uUsPFtMPnU66M9CetkmfcVjJBXfKJ9tJxDE9cu*k1WLTtP*ojK0lFID79FB*KdowQxSf2Q$$; PPLState=1; MSPOK=$uuid-a07c47b0-ed8a-4d0e-954c-bda49a32bee7$uuid-056b7982-fed2-4f2f-ae62-b76f923b1af6$uuid-f678310e-eb1b-4980-b325-ccee2fb2e9e3; OParams=11O.DTj08!mYzjyA7t5jjHNf3EQLK2QugR2ErGoxL7*y7UxAWuodoR8COsWTNmPTDKLUnK8OI5r1QSYxCUTqMdQkzWFHBESCGS6Bv7ebn3m7MImPXL2IunVB9TAdjjPs0MCAEiuni9GnTlu5!XI*Kcb6XdhBkQ*!yoVuM6JS4WDSkEtUoNl!42e!kmuuWNcnxtX3O8gWYnKrQE80bJDc94u!x9kg0isUvOYJgbnuLEjj27V69IKae8jkKFG3SptIjpikdTs1QzbJdTNcDIzox2CNk5dIOFiVkV5mGntGD7opeKA51VCkShkF6mSCR0NfBK7FOyRk67qlehZ*0O53h9H1XOR0fExvrmua4PN*T1soKtFfF2RJoZyDX0VmM1r5QYQWS71rSfHE1tX9sfE7ZGlK24Onn5q4fMWBuKAV!ykFzmXSbdhABI4HlsTqSbqMuxbbigQMvygWVfRr5LXiigxxJh4XzS1fNlm1UXkdS*43XmCMQl0RAJWg7fa0iKyGc7QmsOWgs5JMgGdkOmlSUiuSeEb0EaOh1ZImOdK3iPHHDYedicYx0cpvfh3iWZ4IpVzyT1V31OomvNatII!TidJcDmhN0c3ORpcYEl9jesErTrpyvO6xzILTAjZYZuPKrZYLtuP!qO5qaiwC5eM7crz2R1emGIb5vukl!bYMIIJZvmDDSnIZ65KhkZnydh1flKx9k8Y11eA96z54G8aT6kqI5zVJO54j!W6uDXa0!EgORReVQj10Z5c2LyFSXE!dNbuUD*psD*jnw6b4xcYBqRTFEY1*GnanhUmoRcETQPTDXyq6Tk3nr7*Twjk1TymmV8Iqtw$$",
        "Referer": "https://login.live.com/ppsecure/post.srf?mkt=en-US&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&id=293290&contextid=8286587D38E0DB9A&opid=9756816B1D3B0B53&bk=1686519582&uaid=5d2638a0c0fd4124894017600a67cf76&client_flight=ReservedFlight33,ReservedFligh&pid=0",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "LoginOptions=1&type=28&ctx=&hpgrequestid=&PPFT=-Ddf7WEW1phxxKeLu*%21QaaoYxHcycfE4yHpk0jyosI1WSOSZB3vCnzWOT3jCFCGY3r4AWUK2B6IBbHEVqkphJco*3LZkb5N%21aqH*C8%21KpJo8aoTSm62*bRqd3GntVzGsouctw62SJT5Mm*meuJxMErojp0hCm6VzqYXRq9g3fhbA*XS6xZX9pWSY6Cnb82jYFRw%24%24&i19=1426",
    "method": "POST"
    });
    console.log(res);
}

async function test2(){
    res = await fetch("https://login.skype.com/login/oauth/microsoft?client_id=572381&redirect_uri=https://web.skype.com", {
        method: "GET"
    });
    
    data = await res.text();
    setcookie = res.headers.get("Set-Cookie");

    ppft = search(/<input.*?name="PPFT".*?value="(.*?)"/gm, data);
    mspok = search(/MSPOK=(.*?);/gm, setcookie);
    msprequ = search(/MSPRequ=(.*?);/gm, setcookie);
    //console.log(mspok);
    //console.log(msprequ);
    //console.log(ppft)

    res2 = await fetch("https://login.live.com/ppsecure/post.srf?wa=wsignin1.0&wp=MBI_SSL&wreply=https://lw.skype.com/login/oauth/proxy?client_id=578134&site_name=lw.skype.com&redirect_uri=https%3A%2F%2Fweb.skype.com%2F",{
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
            "cookie": `MSPRequ=${msprequ}; MSPOK=${mspok}; CkTst=G${Date.now()}`,
            //"Referer": "https://login.live.com/ppsecure/post.srf?opid=FDA9BCD29FC14E59",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": `login=josht8160@gmail.com&passwd=1r4ce3y^&PPFT=${ppft}&loginoptions=3`,
        "method": "POST"
        
    });
    data2 = await res2.text();
    console.log(data2)
    return {OPID: search(/&opid=(.*?)&/gm, data2), PPFT: ppft};
}

//test2();

async function test3(){
    res = await fetch("https://login.live.com/ppsecure/post.srf?mkt=en-US&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&id=293290&contextid=8286587D38E0DB9A&opid=9756816B1D3B0B53&bk=1686519582&uaid=5d2638a0c0fd4124894017600a67cf76&client_flight=ReservedFlight33,ReservedFligh&pid=0", {
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
          "cookie": "uaid=5d2638a0c0fd4124894017600a67cf76; cltm=cf:ReservedFlight33$2cReservedFligh; MSPRequ=id=293290&lt=1686519582&co=1; MSCC=76.126.229.37-US; OParams=11O.DYF3DUXI8RPdsi4TGLhfuZqvLqdANLD40YbJuc*zVQxGJ7CfOZbEkyuDqecM5!mTx!J4rpVcuPUYrlg0UxcKoNQlRnxFUv8ZlNPhkLoy0u*VAzphm!EI5yFPEeuyAdN5!qPg6Jvqxzj!yfV7ss5AvXgE1RK9JaF5xSp4Vee76VAjrrDxaZR8bhLDfFOfvE4ld9dOZovC17SSp1VtBZBfL2R1jIX2!80l0MpjOed7sW*TMDG!t*yoDxzhzdroZGLfnBIVqpwlnrseyGPUfZouhHdl1azGGdewrYdtF4KBk2Oiv21efjzPLjAH7Q*iZfB3n8WKvZEsZnfu0beFY1hWkUCZ6QFTAna3Tz4cKzwL3i6vbB0KLh4LbTWQaRsYhdyG!URMWPe0q*5MEOvovA*DaNjptg2zvqaLi!HzmiB0X*6rHvIFCGM0xkeoNRUyF*jOTnb9Px5Vd6qhHVucETJF2NT3UI7ljaz39zIkpS1VU8dLnHFw0UYz0gT0YP*vUzl2tZ3HxktUAcpZ3F!Sm8dGyV8$; MicrosoftApplicationsTelemetryDeviceId=21e05ebd-4ad9-4ba0-83e8-34310145e209; MSPOK=$uuid-a07c47b0-ed8a-4d0e-954c-bda49a32bee7$uuid-056b7982-fed2-4f2f-ae62-b76f923b1af6; ai_session=BCA8HFg25PsBYCoJBLCkNR|1686519587338|1686519587338; MSFPC=GUID=c8507ec565344ef5b360ddde44df0eb0&HASH=c850&LV=202306&V=4&LU=1686519590071; wlidperf=FR=L&ST=1686519591677",
          "Referer": "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1686519582&rver=7.1.6819.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D572381%26redirect_uri%3Dhttps%253A%252F%252Fweb.skype.com%252FAuth%252FPostHandler%26state%3D4b83ea3a-fb4f-412c-989c-63952043c58c&lc=1033&id=293290&mkt=en-US&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=ReservedFlight33%2CReservedFlight67",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "i13=0&login=josht8160%40gmail.com&loginfmt=josht8160%40gmail.com&type=11&LoginOptions=3&lrt=&lrtPartition=&hisRegion=&hisScaleUnit=&passwd=1r4ce3y%5E&ps=2&psRNGCDefaultType=&psRNGCEntropy=&psRNGCSLK=&canary=&ctx=&hpgrequestid=&PPFT=-DUt3iZ0LmfTNVx3FliqJ*0uV90vEulAgG2Jb27O%21Ddz0uJDpMs3sOpSS6l0szgsFFjl52IAWoDGoQMnMFCkQHsFA9uNrxuoVSvl4u5ft9Xsy15BjwblU8xtT%21l%2153YV917zqOrtepIW4Sm0AvY2QJTNdAnYwROaVqjLUe0Vte6BnkbFyuJfqNyEDtlxJEkbo14CL7rCaCazwKPbd3hk8DbE%24&PPSX=Passp&NewUser=1&FoundMSAs=&fspost=0&i21=0&CookieDisclosure=0&IsFidoSupported=1&isSignupPost=0&isRecoveryAttemptPost=0&i19=8257",
        "method": "POST"
      });
    console.log(await res.text());
}
test3();

