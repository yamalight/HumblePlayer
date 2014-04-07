// load bower libs
window.$ = window.jQuery = require('jquery');
require('bootstrap');
// load angular and router
var angular = require('angular');
require('angular-router-browserify')(angular);

//this is here to make node-webkit work with AngularJS routing
angular.element(document.getElementsByTagName('head')).append(angular.element('<base href="' + window.location.pathname + '" />'));

// init app
var app = angular.module('humbleplayer-app', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/init', { controller: 'InitController', templateUrl: './templates/init.html' });
    $routeProvider.when('/login', { controller: 'LoginController', templateUrl: './templates/login.html' });
    $routeProvider.when('/', { controller: 'HomeController', templateUrl: './templates/home.html' });


    $routeProvider.otherwise({redirectTo: '/init'});

    $locationProvider.html5Mode(true);
}]);

app.controller('InitController', ['$scope', '$location', require('./controllers/init.js')]);
app.controller('LoginController', ['$scope', require('./controllers/login.js')]);
app.controller('HomeController', ['$scope', require('./controllers/home.js')]);
