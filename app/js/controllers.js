'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('UploadCtrl', ['$scope', 'fileReader', 'HHI',
      function($scope, fileReader, HHI) {

//        $scope.metricKey = '' ;
//        $scope.groupKey = '';

        $scope.getFile = function() {
          fileReader.readAsText($scope.file, $scope).then(function(result){
            updateTable(result);
          });
        }

        var updateTable = function(result) {
          console.log('read back ', result, result.toString());
          var objects = $.csv.toObjects(result);
          $scope.csv = objects;
          console.log('now parsed into ', objects);
          var keyOptions = _.keys(objects[0]);
          $scope.groupingOptions = _.filter(keyOptions, function(key){
            var field = objects[0][key].replace('$', '');
            return isNaN(field);
          });
          $scope.metricOptions = _.filter(keyOptions, function(key){
            var field = objects[0][key].replace('$', '');
            return !isNaN(field);
          });
        }

        $scope.useDefault = function() {
          fileReader
        }

        $scope.$watch('metricKey', function(){
          console.log('metric key changed');
          calculateHhi($scope.csv);
        });
        $scope.$watch('groupKey', function(){
          console.log('groupKey changed');
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

        var sampleCSV;
  }])
