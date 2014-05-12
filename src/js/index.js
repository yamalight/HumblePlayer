//this is here to make node-webkit work with AngularJS routing
angular.element(document.getElementsByTagName('head')).append(angular.element('<base href="' + window.location.pathname + '" />'));

// init app
var app = angular.module('humbleplayer-app', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/init', { controller: 'InitController', templateUrl: './templates/init.html' });
    $routeProvider.when('/login', { controller: 'LoginController', templateUrl: './templates/login.html' });
    $routeProvider.when('/home', { controller: 'HomeController', templateUrl: './templates/home.html' });
    $routeProvider.otherwise({redirectTo: '/init'});

    $locationProvider.html5Mode(true);
}]);

app.controller('InitController', require('./controllers/init.js'));
app.controller('LoginController', require('./controllers/login.js'));
app.controller('HomeController', require('./controllers/home.js'));
