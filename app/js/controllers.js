'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('UploadCtrl', ['$scope', 'fileReader', 'HHI',
      function($scope, fileReader, HHI) {

//        $scope.metricKey = '' ;
//        $scope.groupKey = '';

        $scope.getFile = function() {
          fileReader.readAsText($scope.file, $scope).then(function(result){
            console.log('read back ', result);
            var objects = $.csv.toObjects(result);
            $scope.csv = objects;
            console.log('now parsed into ', objects);
            $scope.keyOptions = _.keys(objects[0]);

          });
        }

        $scope.$watch('metricKey', function(){
          calculateHhi($scope.csv);
        });
        $scope.$watch('groupKey', function(){
          calculateHhi($scope.csv);
        });

        var calculateHhi = function(list) {
          var hhiSet = HHI.createSet(list, {company: 'company', metric: $scope.metricKey})
          console.log('calculating hhiSet with group/metric', $scope.groupKey, $scope.metricKey);
          $scope.resultSet = hhiSet.calculate($scope.groupKey, $scope.metricKey);
          $scope.hhiTotal = _.pluck($scope.resultSet, 'hhi_score').reduce(function(prev, current){
            console.log(prev);
            return prev + current;
          })
          $scope.shareTotal = _.pluck($scope.resultSet, 'share').reduce(function(prev, current){
            return prev + current;
          })
        }
  }])
  .controller('MyCtrl2', [function() {

  }]);