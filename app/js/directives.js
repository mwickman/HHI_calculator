'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

  .directive("ngFileSelect",[function(){
    return {
      link: function($scope,el){
        el.bind("change", function(e){
          $scope.file = (e.srcElement || e.target).files[0];
          $scope.getFile();
        });
      }
    };
  }])

  .directive("blink",[function(){
      return {
        restrict: 'E',
        link: function(scope, elm, attrs){
          //to be continued...
        }
      }
  }])