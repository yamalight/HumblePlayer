var fs = nodeRequire('fs');
var request = nodeRequire('request');
// promise
var Promise = nodeRequire('bluebird');
// async
var async = nodeRequire('async');
// db
var db = require('./db');
// util
var fillRequestWithCookies = require('./util').fillRequestWithCookies;
// use cookies
var customRequest = null;
// urls
var bundlesUrl = 'https://www.humblebundle.com/api/v1/user/order';
var bundleInfoUrl = 'https://www.humblebundle.com/api/v1/order/';

// processes bundles
var processBundles = function (body) {
    return new Promise(function (resolve, reject) {
        var soundtracks = [];
        var names = [];

        var toRun = [];
        body.forEach(function(bundle, index) {
            toRun.push(function(cb) {
                customRequest(bundleInfoUrl + bundle.gamekey,
                function(error, response, bundleBody) {
                    if (error || !response || response.statusCode !== 200) {
                        console.log('error!', error, response.statusCode); // Print the error
                        return cb(error);
                    }
                    // parse body
                    bundleBody = JSON.parse(bundleBody);
                    bundleBody.subproducts.forEach(function(sub) {
                        sub.downloads.forEach(function(item) {
                            if(item.platform === 'audio') {
                                // only save unique items
                                if(names.indexOf(sub.human_name) !== -1) {
                                    return;
                                }
                                // push to names
                                names.push(sub.human_name);
                                // create new object
                                var soundtrack = {
                                    name: sub.human_name,
                                    icon: sub.icon,
                                    url: sub.url,
                                    local: false,
                                    songs: [],
                                    showSongs: false,
                                };
                                // get archive file
                                item.download_struct.forEach(function(struct) {
                                    if(struct.name === 'MP3') {
                                        soundtrack.download = struct.url.web;
                                        soundtrack.size = struct.human_size;
                                    }
                                });
                                // push
                                soundtracks.push(soundtrack);
                            }
                        });
                    });

                    cb();
                });
            });
        });

        async.parallel(toRun, function(err) {
            if(err) {
                return console.log(err);
            }
            db.music.insert(soundtracks, function(err, savedSoundtracks) {
                if(err) {
                    return reject(err);
                }

                // resolve with data
                resolve(savedSoundtracks);
            });
        });
    });
};

// gets all music
var getMusic = function(cookies) {
    return new Promise(function (resolve, reject) {
        db.music.find({}, function(err, docs) {
            // if there is something in db, return it
            if(!err && docs && docs.length) {
                return resolve(docs);
            }

            // fetch remote stuff
            // create request with cookies
            customRequest = fillRequestWithCookies(cookies);
            // get user owned bundles
            customRequest(bundlesUrl,
            function(error, response, body) {
                if (error || !response || response.statusCode !== 200) {
                    console.log('error!', error, response.statusCode); // Print the error
                    return reject(error);
                }
                // parse body
                body = JSON.parse(body);

                resolve(processBundles(body));
            });
        });
    });
};

var Bundler = function () {
    this.getMusic = getMusic;
};

module.exports = new Bundler();
