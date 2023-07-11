const cryptoJS = require("crypto-js");

module.exports = {
    search: async function (regex, data) {
        let a;
        while ((a = regex.exec(data)) !== null) {
            if (a.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            return a[1];
        }
    },

    searchSync: async function (regex, data) {
        let a;
        while ((a = regex.exec(data)) !== null) {
            if (a.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            return a[1];
        }
    },

    getMac256Hash: function(
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
}