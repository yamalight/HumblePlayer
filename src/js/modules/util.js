// request
var request = nodeRequire('request');

// add cookies to request
exports.fillRequestWithCookies = function(cookies) {
    var j = request.jar();
    var i, len = cookies.length;

    // fill container with cookies
    for(i = 0; i < len; i++) {
        j.setCookie(request.cookie(cookies[i]), 'http://www.humblebundle.com');
    }

    // replace default request with new one with cookies
    return request.defaults({jar: j, followAllRedirects: true});
};
