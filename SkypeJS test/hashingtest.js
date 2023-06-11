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
const string = "test";
console.log("test".charCodeAt(50))