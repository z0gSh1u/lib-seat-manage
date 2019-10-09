const siteUrl = "http://localhost:8888";

function _pathJoin(dotLashPath) {
    var t = dotLashPath.substring(1, dotLashPath.length);
    return siteUrl + t;
}