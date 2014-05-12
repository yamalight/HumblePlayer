var Datastore = nodeRequire('nedb');
var path = nodeRequire('path');
var user = new Datastore({ filename: path.join(nodeRequire('nw.gui').App.dataPath, 'user.db'), autoload: true });
var music = new Datastore({ filename: path.join(nodeRequire('nw.gui').App.dataPath, 'music.db'), autoload: true });

// enable autocompact
var interval = 5 * 60 * 1000;
music.persistence.setAutocompactionInterval(interval);
user.persistence.setAutocompactionInterval(interval);

// db object
var db = {};
db.user = user;
db.music = music;

module.exports = db;
