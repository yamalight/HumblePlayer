var humble = require('../modules/humble');

module.exports = function LoginController($scope) {
    console.log('login!');

    $scope.email = '';
    $scope.pass = '';

    $scope.doLogin = function () {
        console.log($scope.email + ' ' + $scope.pass);
        /*// send request
        humble.login(login, pass, function processMusic(data) {
            // set data
            userMusic = data.music;
            // render
            console.log(userMusic);
        });*/
    };
};
