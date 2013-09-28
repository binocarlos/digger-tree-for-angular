/*

  we are in private scope (component.io)
  
*/
require('digger-utils-for-angular');
require('bootstrap-tree-for-angular');

var template = require('./template');

angular
  .module('digger.tree', [
    'digger.utils',
    'angularBootstrapNavTree'
  ])


  .directive('diggerTree', function($safeApply){

    //field.required && showvalidate && containerForm[field.name].$invalid
    return {
      restrict:'EA',
      scope:true,
      replace:true,
      template:template,
      controller:function($scope){

        $scope.$watch('$digger.models', function(newmodels){
          $scope.treedata = newmodels;
        })

        $scope.container_select = function(id){
          console.log('-------------------------------------------');
          console.log('yo');
        }
      }
    }
  })