var ecparams = getSECCurveByName("secp256k1");
function btcaddr(mpk, n, c) {
    var curve = ecparams.getCurve();
    var pubkey_point = curve.decodePointHex("04" + mpk);
    var z = new BigInteger(sequence(mpk, n, c), 16);
    var pubkey_point2 = pubkey_point.add(ecparams.getG().multiply(z));
    var pk2 = curve.encodePointHex(pubkey_point2);
    return h160toAddr(h160(pk2));
}
function sequence(mpk, n, c) {
    var n_str = n.toString();
    var c_str = c ? "1" : "0";
    var seq = CryptoJS.enc.Utf8.parse(n_str + ":" + c_str + ":");
    seq.concat(CryptoJS.enc.Hex.parse(mpk));
    var hash = CryptoJS.SHA256(CryptoJS.SHA256(seq));
    return hash.toString(CryptoJS.enc.Hex);
}
function h160toAddr(hash, addrtype) {
    if(addrtype == null) addrtype = 0;
    else if(addrtype > 255) addrtype = 255;
    var addr = (addrtype < 16 ? "0" : "");
    addr += addrtype.toString(16) + hash;
    var cs = h256(addr);
    addr += cs.substr(0, 8);
    return toB64(addr);
}
function h160(hexmsg) {
    msg = CryptoJS.enc.Hex.parse(hexmsg);
    hash = CryptoJS.RIPEMD160(CryptoJS.SHA256(msg));
    return hash.toString(CryptoJS.enc.Hex);
}
function h256(hexmsg) {
    msg = CryptoJS.enc.Hex.parse(hexmsg);
    hash = CryptoJS.SHA256(CryptoJS.SHA256(msg));
    return hash.toString(CryptoJS.enc.Hex);
}
function toB64(hexstr) {
    var val = new BigInteger(hexstr, 16);
    var bInt58 = new BigInteger("58", 10)
    var b58chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".split("");
    var b58 = "";
    while(val.bitLength() > 0) {
        var x = val.modInt(58);
        val = val.divide(bInt58);
        b58 = b58chars[x] + b58;
    }
    var pad = "";
    for(var i = 0; i < hexstr.length; i += 2) {
        if(hexstr.substr(i, 2) != "00") break;
        pad += b58chars[0];
    }
    return pad + b58;
}