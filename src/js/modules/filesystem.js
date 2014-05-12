var fs = nodeRequire('fs');
var AdmZip = nodeRequire('adm-zip');
var path = nodeRequire('path');

// folder with albums
var defaultDlFolder = path.join(nodeRequire('nw.gui').App.dataPath, 'albums');
var defaultMp3Folder = path.join(nodeRequire('nw.gui').App.dataPath, 'extractedAlbums');

var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    })
    return results;
};

var alreadyDownloaded = function (game) {
    var filename = path.join(defaultDlFolder, game.replace(/[.\/:*?"<>|]/, "") + '.zip');
    return fs.existsSync(filename);
};

var getFilesListing = function (game, cb) {
    if(!alreadyDownloaded(game)) {
        return cb(false);
    }

    game = game.replace(/[.\/:*?"<>|]/, "");
    var archive = path.join(defaultDlFolder, game + '.zip');
    var dir = path.join(defaultMp3Folder, game);

    // extranct if needed
    if(!fs.existsSync(dir)) {
        // extranct if needed
        var zip = new AdmZip(archive);
        zip.extractAllTo(dir, false);
        files = walk(dir);
        cb(files);
    } else {
        files = walk(dir);
        cb(files);
    }
};

exports.alreadyDownloaded = alreadyDownloaded;
exports.getFilesListing = getFilesListing;
