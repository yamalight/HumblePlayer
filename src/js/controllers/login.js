var humble = require('../modules/humble');

var buttonLadda;

module.exports = function LoginController($scope, $location) {
    $scope.email = '';
    $scope.pass = '';

    var goHome = function () {
        $scope.$apply(function() {
            $location.path('/home');
        });
    }

    $scope.doLogin = function ($event) {
        // reset error
        $scope.error = null;
        // get login and pass
        var login = $scope.email;
        var pass = $scope.pass;
        // get button
        var button = $event.target;
        // create spinner if not exists
        if(!buttonLadda) {
            buttonLadda = Ladda.create(button);
        }
        // start
        buttonLadda.start();
        // send request
        humble.login(login, pass)
        .then(function processMusic(error) {
            // stop spinner
            buttonLadda.stop();
            // if error - show
            if(error) {
                return $scope.$apply(function() {
                    $scope.error = 'Error logging in! Try again?';
                });
            }
            // redirect to home page
            goHome();
        });
    };
};
