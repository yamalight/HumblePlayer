// package deps
var fs = nodeRequire('fs');
var path = nodeRequire('path');
var progress = nodeRequire('request-progress');
// db
var db = require('./db');
// util
var fillRequestWithCookies = require('./util').fillRequestWithCookies;
// use cookies
var customRequest = null;

var defaultFolder = path.join(nodeRequire('nw.gui').App.dataPath, 'albums');

var prepareDefaultFolder = function () {
    if(!fs.existsSync(defaultFolder)) {
        return fs.mkdirSync(defaultFolder);
    }
};

var downloadMusic = function(cookies, soundtrack, progresscb, cb) {
    // get data
    var link = soundtrack.download;
    var name = soundtrack.name;
    // create request with cookies
    customRequest = fillRequestWithCookies(cookies);
    // prep folder
    prepareDefaultFolder();
    // make archive name
    var archive = path.join(defaultFolder, name.replace(/[.\/:*?"<>|]/, "") + '.zip');
    // if already dled, return
    if (fs.existsSync(archive)) {
        cb(archive);
    }

    // finish hanlder
    var handleEnd = function(){
        console.log('end. updating doc');
        // update entry
        db.music.update({name: name}, {$set: {local: true}}, function(err, numReplaced) {
            console.log('updated:', numReplaced);
            if(err) {
                return cb(false);
            }

            cb(archive);
        });
    };

    // download
    progress(customRequest(link))
    .on('progress', function (state) {
        progresscb(state.percent);
    })
    .pipe(fs.createWriteStream(archive))
    .on('error', function(err){
        console.log('download error', err);
        cb(false);
    })
    .on('close', handleEnd)
    .on('end', handleEnd);
};

var Downloader = function () {
    this.downloadMusic = downloadMusic;
};

module.exports = new Downloader();
