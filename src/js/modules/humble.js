// package deps
var request = nodeRequire('request');
// bundler
var bundler = require('./bundler');
// donwloader
var downloader = require('./downloader');
// filesystem stuff
var filesystem = require('./filesystem');
// db
var db = require('./db');
// util
var fillRequestWithCookies = require('./util').fillRequestWithCookies;
// URLs
var loginURL = 'https://www.humblebundle.com/login';
var homeURL = 'https://www.humblebundle.com/home';
// cookies container
var cookies = null;
// custom request
var customRequest = request.defaults({jar: true});

// login method
var login = function(login, pass, cb) {
    return new Promise(function (resolve, reject) {
        var data = {
            'goto': '/home',
            'qs': '',
            'username': login,
            'password': pass,
            'authy-token': '',
            'submit-data': ''
        };

        customRequest.post(loginURL, {form: data},
        function(error, response, body) {
            if (error || !response || response.statusCode !== 302) {
                console.log('error!', error, response.statusCode); // Print the error
                return reject(error);
            }

            // check success
            var redirectLocation = response.headers.location;
            if(redirectLocation === 'https://www.humblebundle.com/login?goto=%2Fhome&err=unamepwd') {
                return reject(new Error('Wrong username or password!'));
            } else if(redirectLocation !== 'https://www.humblebundle.com/home') {
                return reject(new Error('Error logging in! Try again?'));
            }

            // store cookies
            cookies = response.headers['set-cookie'];

            // if no cookies - reject
            if(!cookies || !cookies.length) {
                return reject(new Error('No cookies!'));
            }

            // remove all old cookies
            db.user.remove({}, function(err) {
                if(err) {
                    return reject(new Error('Error cleaning cookies from db!'));
                }
                // save new cookies to db
                db.user.insert({cookies: cookies}, function(err, doc) {
                    if(err) {
                        return reject(new Error('Error saving cookies to db!'));
                    }
                    // resolve
                    resolve();
                });
            });
        });
    });
};

// check if cookies are saved and valid
var checkAuth = function () {
    return new Promise(function (resolve, reject) {
        db.user.find({}, function (err, docs) {
            if(err) {
                return reject(err);
            }

            if(!docs || !docs.length) {
                return resolve(false);
            }

            var savedCookies = docs[0].cookies;
            if(!savedCookies) {
                return resolve(false);
            }

            // create request with cookies
            var req = fillRequestWithCookies(savedCookies);
            // get user owned bundles
            req(homeURL,
            function(error, response, body) {
                if (error || !response || response.statusCode !== 200) {
                    console.log('error!', error, response.statusCode); // Print the error
                    return reject(error);
                }

                if(body.indexOf('Sign In') !== -1) {
                    return resolve(false);
                }

                // restore cookies
                cookies = savedCookies;

                return resolve(cookies);
            });
        });
    });
};

// get music
var getMusic = function () {
    return bundler.getMusic(cookies);
};

// download album
var downloadMusic = function(soundtrack, progresscb, cb) {
    return downloader.downloadMusic(cookies, soundtrack, progresscb, cb);
};

// get album files
var getFilesListing = function (soundtrack, cb) {
    return filesystem.getFilesListing(soundtrack.name, cb);
};

var HumbleAPI = function () {
    this.login = login;
    this.checkAuth = checkAuth;
    this.getMusic = getMusic;
    this.downloadMusic = downloadMusic;
    this.getFilesListing = getFilesListing;
};

module.exports = new HumbleAPI();
