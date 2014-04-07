var spin = require('../parts/spinner');
var request = nodeRequire('request');

module.exports = function HomeController($scope, $location) {
    $scope.hasError = false;
    $scope.errorText = '';

    // draw spinner
    var target = document.getElementById('spinner');
    var spinner = spin(target);
    var spinnerDom = $('#spinner');

    // get humble page
    var checkCaptcha = function() {
        $scope.hasError = false;
        // star spinner
        spinnerDom.show();
        // do request
        request.post('https://www.humblebundle.com/login/captcha', {}, function(error, response, body) {
            // remove loader
            spinnerDom.hide();

            // check for generic error
            if (error) {
                $scope.hasError = true;
                $scope.errorText = 'Couldn\'t reach humblebundle.com! Is your connection OK?';
                return console.log('error!', error, response.statusCode); // Print the error
            }

            // check for captcha
            if(response.statusCode === 401) {
                console.log('need captcha!');
                $scope.hasError = true;
                $scope.errorText = 'Looks like you have to enter captcha! Sorry, HumblePlayer does not support this yet.<br/>Please, login using browser and wait a bit until captcha request disappears!';
                // redraw
                $scope.$apply();
                return;
            }

            // redirect to login page
            $location.path('/login');
        });
    };
    $scope.checkCaptcha = checkCaptcha;

    // do initial check
    checkCaptcha();
};
