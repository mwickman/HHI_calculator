'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('UploadCtrl', ['$scope', 'fileReader', 'HHI', '$state',
      function($scope, fileReader, HHI, $state) {

//        $scope.metricKey = '' ;
//        $scope.groupKey = '';
        $scope.data = {};
        $scope.getFile = function() {
          fileReader.readAsText($scope.data.file, $scope).then(function(result){
            updateTable(result);
          });
         $state.go('columnSelect');
         $state.go('columnSelect.userData');
        }

        var updateTable = function(result) {
          console.log('read back ', result, result.toString());
          var objects = $.csv.toObjects(result);
          $scope.data.csv = objects;
          console.log('now parsed into ', objects);
          var keyOptions = _.keys(objects[0]);
          $scope.data.keys = keyOptions;
          $scope.data.groupingOptions = _.filter(keyOptions, function(key){
            var field = objects[0][key].replace('$', '');
            return isNaN(field);
          });
          $scope.data.metricOptions = _.filter(keyOptions, function(key){
            var field = objects[0][key].replace('$', '');
            return !isNaN(field);
          });
        }

        $scope.useSample = function() {
          console.log('using sample');
          updateTable(sampleCSV);
          $state.go('columnSelect');
          $state.go('columnSelect.userData');
        }

        $scope.$watch('[data.metricKey, data.groupKey]', function(){
          console.log('metric key changed', $scope.metricKey);
          if(($scope.data.metricKey && $scope.data.groupKey) != undefined) {
            calculateHhi($scope.data.csv);
            $state.go('columnSelect.result');
          }
        }, true);
//        $scope.$watch('data.groupKey', function(){
//          console.log('groupKey changed', $scope.groupKey);
//          if($scope.data.groupKey != undefined) calculateHhi($scope.data.csv);
//        });

        var calculateHhi = function(list) {
          console.log('called calculate HHI', list);
          var hhiSet = HHI.createSet(list, {company: 'company', metric: $scope.data.metricKey})
          console.log('calculating hhiSet with group/metric', $scope.data.groupKey, $scope.data.metricKey);
          $scope.data.resultSet = hhiSet.calculate($scope.data.groupKey, $scope.data.metricKey);
          $scope.data.hhiTotal = _.pluck($scope.data.resultSet, 'hhi_score').reduce(function(prev, current){
            console.log(prev);
            return prev + current;
          });
          $scope.data.shareTotal = _.pluck($scope.data.resultSet, 'share').reduce(function(prev, current){
            return prev + current;
          })
        };

        var sampleCSV = "company,sales,unit_production\nAlpha,$1200,100\nBeta,$1100,80\nCharlie,$1500,98\nDelta,$1300,75\nCharlie,$150,25\nCharlie,$2000,65\nEcho,$235,10";
  }]);
