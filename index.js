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
      scope:{
        container:'=',
        selectedid:'=',
        iconfn:'=',
        filter:'@',
        depth:'='
      },
      replace:true,
      transclude:true,
      template:template,
      controller:function($scope){

        $scope.depth = $scope.depth || 4;
        $scope.treedata = [];

        var to_expand = null;
        var to_contract = null;
        var to_select = null;

        $scope.$on('tree:expand', function($e, container){
          if(!$scope.container){
            to_expand = container;
            return;
          }
          $scope.container.find('=' + container.diggerid()).data('expanded', true);
        })

        $scope.$on('tree:contract', function($e, container){
          if(!$scope.container){
            to_contract = container;
            return;
          }
          $scope.container.find('=' + container.diggerid()).data('expanded', false);
        })

        $scope.$on('tree:setselected', function(ev, selected){
          if(!selected){
            return;
          }

          

          var current = $scope.container.find('=' + selected._digger.diggerid);

          var ancestors = [current];

          current.data('expanded', true);
          while(current.diggerparentid()){
            current = $scope.container.find('=' + current.diggerparentid())
            current.data('expanded', true);
            ancestors.unshift(current);
          }

          // this code is starting to get horrible and I hate myself
          $scope.$emit('tree:ancestors', ancestors);
        })

        $scope.$on('tree:select', function($e, container){
          if(!$scope.container){
            to_select = container;
            return;
          }
          $scope.$broadcast('tree:setselected', container.get(0));
        })
        
        $scope.$watch('container.models', function(models){
          if(!models){
            return;
          }

          var container = $digger.create(models);

          var warehouse = container.diggerwarehouse();

          container.data('expanded', true);
          container.recurse(function(c){
            c.attr('label', c.title());
            if(!c.diggerwarehouse()){
              c.diggerwarehouse(warehouse);
            }
            if($scope.filter){
              c.data('tree_filter', c.tag()=='_supplychain' || c.match($scope.filter));
            }
            if($scope.iconfn){
              c.data('tree_icon', $scope.iconfn(c));
            }            
          })

          if(!($scope.title || '').match(/\w/)){
            $scope.title = container.title();
          }

          $scope.treedata = container.models;

          if(to_expand){
            $scope.$emit('tree:expand', to_expand);
            to_expand = null;
          }

          if(to_contract){
            $scope.$emit('tree:contract', to_contract);
            to_contract = null;
          }

          if(to_select){
            $scope.$emit('tree:select', to_select);
            to_select = null;
          }

        }, true)

        $scope.container_select = function(model){
          $scope.$emit('tree:selected', $scope.container.spawn(model));
        }
      }
    }
  })