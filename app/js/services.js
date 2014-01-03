'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])

.factory('HHI', [function(){

      var HhiSet = function(list, config) {
        var self = this;
        self.metric = config.metric; // the key to calculate HHI with
        self.company = config.company;
        self.grouping = config.grouping; // the key to group the HHI calculation by, usually company
        self.list = list; //a list of objects in the set, basically table rows

        /** calculates the HHI for the set*/
        self.calculate = function (grouping, metric) {
          var result = [];
          var grouping_key = grouping || self.company;
          var metric_key = metric || self.metric;
          var temp_table = self.list.map(function(row){
            if(typeof(row[metric_key]) === 'string') {
              row[metric_key] = row[metric_key].replace(/[^A-Za-z0-9]/g,''); // get rid of symbols so we can do math
            }
            return row;
          });
          var totalMetric = _.pluck(temp_table, metric_key).reduce(function(prev, current, index, array){
            var sum = parseFloat(prev) + parseFloat(current);
            return sum;
          });

          console.log('self list is', temp_table, self.company, totalMetric);
          var uniqueCompanies = _.uniq(_.pluck(temp_table, grouping_key))
          uniqueCompanies.forEach(function(value){
            var resultObj = {};
            resultObj['group'] = value;
            resultObj.sum = 0;
            result.push(resultObj)
          });

          // group records by company and add their grouped metric sum
          temp_table.forEach(function(obj){
            obj[metric_key] = parseFloat(obj[metric_key]);
            var findObj = {};
            findObj['group'] = obj[grouping_key];
            var resultRecord = _.findWhere(result, findObj);
            resultRecord.sum = resultRecord.sum + obj[metric_key];

            console.log('resultRecord and result', resultRecord, result);
          });

          //add that sum as a percentage of the total

          result = result.map(function(row){
            row.share = (row.sum / totalMetric) * 100;
            row.hhi_score = row.share * row.share;
            return row;
          })
          console.log('final result', result);
          return result;
          //@todo: add a field for their percentage of total squared
        }
      }

      var createSet = function(list, config) {
        return new HhiSet(list, config);
      }

      return {
        createSet: createSet
      };
}])

.factory('fileReader',['$q', '$log', function ($q, $log) {

      var onLoad = function(reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.resolve(reader.result);
          });
        };
      };

      var onError = function (reader, deferred, scope) {
        return function () {
          scope.$apply(function () {
            deferred.reject(reader.result);
          });
        };
      };

      var onProgress = function(reader, scope) {
        return function (event) {
          scope.$broadcast("fileProgress",
              {
                total: event.total,
                loaded: event.loaded
              });
        };
      };

      var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
      };

      var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
      };

      var readAsText = function (file, scope) {
        var deferred = $q.defer();

        var reader = getReader(deferred, scope);
        reader.readAsText(file);

        return deferred.promise;
      }

      return {
        readAsDataUrl: readAsDataURL,
        readAsText: readAsText
      };
}])
