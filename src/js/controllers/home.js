// humble api
var humble = require('../modules/humble');
var fs = nodeRequire('fs');

// current player
var sound, currentSong, currentSoundtrack;

module.exports = function HomeController($scope) {
    $scope.soundtracks = [];

    var onSongEnd = function() {
        currentSoundtrack.songs.forEach(function(item, index) {
            if(item.path === currentSong.path) {
                var ni = index++;
                if(ni >= currentSoundtrack.songs.length) {
                    ni = 0;
                }
                var nextSong = currentSoundtrack.songs[ni];

                // play
                $scope.playNewSong(currentSoundtrack, nextSong);
            }
        });
    };

    $scope.downloadSoundtrack = function (soundtrack, $event) {
        // init ladda
        var laddaBtn = Ladda.create($event.target);
        // start ladda
        laddaBtn.start();
        // download archive
        humble.downloadMusic(soundtrack,
            function onProgress(progress) {
                laddaBtn.setProgress(progress / 100.0);
            },
            function onResult(data){
                // stop animation
                laddaBtn.stop();
            }
        );
    };

    $scope.toggleSoundtrack = function (soundtrack, $event) {
        if(soundtrack.showSongs) {
            soundtrack.showSongs = false;
            return;
        }
        // fetch files
        humble.getFilesListing(soundtrack, function(files){
            var songList = [];
            // render
            files.forEach(function(item) {
                var match = /.+\/(.+?)\.mp3/.exec(item);
                if(match !== null) {
                    var obj = {
                        path: 'file://' + encodeURI(item),
                        name: match[1],
                        playing: false,
                    };
                    songList.push(obj);
                }
            });
            // append
            soundtrack.songs = songList;
            soundtrack.showSongs = true;
        });
    };

    $scope.playNewSong = function(soundtrack, song) {
        // destroy current player
        if(sound) {
            currentSong.playing = false;
            sound.stop();
            sound.unload();
        }
        // save new
        currentSong = song;
        currentSoundtrack = soundtrack;
        console.log(song.path);
        // play
        sound = new Howl({
            urls: [song.path],
            onend: onSongEnd
        }).play();
    };

    // on init, get music
    humble.getMusic()
    .then(function(soundtracks) {
        soundtracks = soundtracks.sort(function(item1, item2) {
            if (item1.local) {
                return -1;
            }
            if (item2.local) {
                return 1;
            }
            if (item1.name < item2.name) {
                return -1;
            }
            if (item1.name > item2.name) {
                return 1;
            }
            return 0;
        });
        $scope.$apply(function () {
            $scope.soundtracks = soundtracks;
        });
    })
    .catch(function(err) {
        console.log('error:', err);
    });
};
