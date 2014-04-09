var fs = nodeRequire('fs');
var request = nodeRequire('request');
var progress = nodeRequire('request-progress');
// use cookies
customRequest = request.defaults({jar: true});
// URLs
var loginURL = 'https://www.humblebundle.com/login';
var musicURL = 'https://www.humblebundle.com/home';

// cookies container
var cookies = null;

// add cookies to request
var fillRequestWithCookies = function(cookies) {
    var j = request.jar();
    var i, len = cookies.length;

    // fill container with cookies
    for(i = 0; i < len; i++) {
        j.setCookie(request.cookie(cookies[i]), 'http://www.humblebundle.com');
    }

    // replace default request with new one with cookies
    customRequest = request.defaults({jar: j, followAllRedirects: true});
};

// process body function
var processBody = function(body, cookies, cb) {
    // get jquery from window and use it on body
    var $ = window.$;
    var music = [];
    var audio = $('.downloads.audio', body);
    audio.each(function(index, item){
        var collection = {};
        var game = $(item).siblings('.gameinfo').children('.title').text().trim();
        var linkTag = $(item).siblings('.icn').children('a.afulllink');
        var gameLink = linkTag.attr('href');
        var gameImage = linkTag.children('img').attr('src');
        var downloads = $(item).children('.download.small');
        // only process stuff with music
        if(downloads.length === 0) {
            return;
        }
        collection.game = game;
        collection.gameURL = gameLink;
        collection.gameImage = gameImage;
        collection.files = [];
        downloads.each(function(i, dl) {
            dl = $(dl);
            var a = dl.children('.flexbtn.active.noicon').children('a.a');
            var link = a.attr('href');
            var text = a.text().trim();
            var size = dl.children('.dldetails').children('.dlsize').children('.mbs').text().trim();
            collection.files.push({
                link: link,
                text: text,
                size: size
            });
        });
        music.push(collection);
    });

    // trigger callback with data
    cb({cookies: cookies, music: music});
};

// export
var login = function(login, pass, cb) {
    var data = {
        'goto': '/home',
        'qs': '',
        'username': login,
        'password': pass,
        'authy-token': '',
        'submit-data': ''
    };

    customRequest.post(loginURL, {form: data}, function (error, response, body) {
        if (error || response.statusCode !== 302) {
            cb(false);
            return console.log('error!', error, response.statusCode); // Print the error
        }

        // store cookies
        cookies = response.headers['set-cookie'];
        // get music
        getMusic(cookies, cb);
    });
};

var getMusic = function(cookies, cb) {
    // add cookies to request
    fillRequestWithCookies(cookies);
    // get music
    customRequest(musicURL, function(error, response, body) {
        if (error || response.statusCode !== 200) {
            cb(false);
            return console.log('error!', error, response.statusCode); // Print the error
        }

        processBody(body, cookies, cb);
    });
};

var downloadMusic = function(link, name, progresscb, cb) {
    var archive = './albums/' + name.replace(/[.\/:*?"<>|]/, "") + '.zip';
    // if already dled, return
    if (fs.existsSync(archive)) {
        cb(archive);
    }
    // start download
    progress(request(link))
    .on('progress', function (state) {
        progresscb(state.percent);
    })
    .pipe(fs.createWriteStream(archive))
    .on('error', function(err){
        console.log('download error', err);
        cb(false);
    })
    .on('close', function(){
        cb(archive);
    })
    .on('end', function(){
        cb(archive);
    });
};

exports.login = login;
exports.getMusic = getMusic;
exports.downloadMusic = downloadMusic;
