var spin = require('../parts/spinner');
var request = nodeRequire('request');
var humble = require('../modules/humble');

module.exports = function HomeController($scope, $location) {
    $scope.hasError = false;
    $scope.errorText = '';

    // draw spinner
    var target = document.getElementById('spinner');
    var spinner = spin(target);
    var spinnerDom = $('#spinner');

    var checkAuth = function (cb) {
        humble
        .checkAuth()
        .then(cb)
        .catch(function(err) {
            cb(false);
        })
    };

    // get humble page
    var checkCaptcha = function() {
        $scope.hasError = false;
        // star spinner
        spinnerDom.show();
        // do request
        request.post('https://www.humblebundle.com/login/captcha', {}, function(error, response, body) {
            // check for generic error
            if (error) {
                // remove loader
                spinnerDom.hide();
                // show error
                $scope.hasError = true;
                $scope.errorText = 'Couldn\'t reach humblebundle.com! Is your connection OK?';
                return console.log('error!', error, response.statusCode); // Print the error
            }

            // check for captcha
            if(response.statusCode === 401) {
                // remove loader
                spinnerDom.hide();
                // show error
                $scope.hasError = true;
                $scope.errorText = 'Looks like you have to enter captcha! Sorry, HumblePlayer does not support this yet.<br/>Please, login using browser and wait a bit until captcha request disappears!';
            } else {
                checkAuth(function(cookies) {
                    // remove loader
                    spinnerDom.hide();
                    // redirect
                    $scope.$apply(function() {
                        if(cookies) {
                            // have cookies, go home
                            $location.path('/home');
                        } else {
                            // no cookies, redirect to login
                            $location.path('/login');
                        }
                    });
                });
            }

            // apply changes
            $scope.$apply();
        });
    };
    $scope.checkCaptcha = checkCaptcha;

    // do initial check
    checkCaptcha();
};
