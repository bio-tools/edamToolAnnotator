'use strict';
angular.module('edamToolAnnotator').directive('etaTerm', ['$http','FuseSearch','ETACore',function($http, FuseSearch, ETACore){
// Runs during compile

return {
    // name: '',
    // priority: 1,
    // terminal: true,
     scope: {
         treeType: "@", // have some checks to see if in ['operation','topic','data','format']
         addedTerm:"=?",
         dropdownSearchId:"=?",
         changeSource: "=?",
         colorClass: "@?"

     }, // {} = isolate, true = child, false/undefined = no change
     controller: function($scope, $element, $attrs, $transclude) {
         // this should be removed if I decide to keep this structure
         if ($scope.changeSource === undefined || $scope.changeSource === null || $scope.changeSource !== 'in' || $scope.changeSource !== 'out' ) {
                $scope.changeSource = "out";
         }

         // add term to the list of terms used to annotate the resource
         $scope.setTerm = function(term){
             $scope.addedTerm.term = term.text;
             $scope.addedTerm.uri = term.data.uri;
         }

         //tree options
         $scope.treeOptions = {
             nodeChildren: "children",
             dirSelectable: true,
             allowDeselect: false,
             multiSelection : false,
             injectClasses: {
                 ul: "a1",
                 li: "a2",
                 liSelected: "a7",
                 iExpanded: "a3",
                 iCollapsed: "a4",
                 iLeaf: "a5",
                 label: "a6",
                 labelSelected: "a8"
             }
         }
        // need to call this because it doesn't do it when i add it to the directive attr.
        $scope.orderby = 'text';

        /*
        When the user selects an element from the dropdown , this function is executed, with the selected element as a parameter.

        Use this function to trigger the tree elements that match this
        Expand all the paths in the tree.
        FOr this, the parents need to be expanded also, if just the node is expanded , the parents do not and the node might not be visible

        */
        $scope.onSelected = function(str){
            if (!str){
                return;
            }
            $scope.treeOptions.multiSelection = true;
            $scope.expandedNodes = [];
            var expanded = [].concat.apply([],str.originalObject.paths.map(function(p){
                return ETACore.getMyPaths(p);
            }));

            // some parent nodes might appear more than once, so remove the multiple occurences
            // because otherwise we get bugs when we try to click the tree and collapse
            expanded = ETACore.uniq_fast(expanded);

            $scope.expandedNodes = expanded.map(function(e){
                return (jsonPath($scope.edamTree, e))[0];
            });

            $scope.selectedNodes = str.originalObject.paths.map(function(p){
                return (jsonPath($scope.edamTree, p))[0];
            });

            $scope.selectedTerm = $scope.selectedNodes[0];
        };


        // when a tree item is selected (clicked on)
        $scope.showSelected = function(node){
            $scope.treeOptions.multiSelection = false;
            $scope.selectedNode = node;
            $scope.selectedTerm = node;

            if (node.text === $scope.flatEDAMTree[node.flatID].text){
                $scope.$broadcast('angucomplete-alt:changeInput', 'autocomplete-1', node.text);
            }else{
                $scope.$broadcast('angucomplete-alt:clearInput', 'autocomplete-1');
            }

        }
    },
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    templateUrl: 'eta-term.template.html',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    link: function($scope, iElm, iAttrs, controller) {

    // maybe don't keep everything in $scope at the same level and make objects as part of $scope
    // where it makes sense to do so

    // construct the needed trees from this var request promise object
    // see:
    // http://stackoverflow.com/questions/32912637/saving-an-http-response-object-as-a-scope-variable
    // http://blog.ninja-squad.com/2015/05/28/angularjs-promises/
    // http://chariotsolutions.com/blog/post/angularjs-corner-using-promises-q-handle-asynchronous-calls/
    var request = $http.get('EDAM_' + $scope.treeType +'.json')
    .then(function(res){
        $scope.edamTree = [res.data.data];
        $scope.selectedTerm = $scope.edamTree[0];
        $scope.selectedNode = $scope.edamTree[0];
        $scope.expandedNodes = [$scope.edamTree[0]];


        $scope.flatEDAMTree = ETACore.removeDuplicateTerms(ETACore.flattenEdamTree($scope.edamTree[0]),$scope.edamTree);
    });

    /*
     Use Fusejs to search.
     */
     $scope.fuseBranchSearch = function(str){
         return FuseSearch.search(str,$scope.flatEDAMTree);
     }

    }
};
}]);


