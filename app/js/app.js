'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'ui.router',
  'ui.bootstrap',
  'ui.select2'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/upload");

    $stateProvider
        .state('upload', {
          url: '/upload',
          templateUrl: "partials/upload.html"
        })

        .state('columnSelect', {
          url: '/columnSelect',
          templateUrl: "partials/columnSelect.html"
        })

        .state('result', {
          url: 'result',
          templateUrl: "partials/result.html"
        })

}]);
