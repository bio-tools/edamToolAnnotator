'use strict';
angular.module('edamToolAnnotator').directive('etaFunction', ['ETACore', function(ETACore){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {
            functions: "=",
            changeSource: "=?"
        }, // {} = isolate, true = child, false/undefined = no change
        controller: function($scope, $element, $attrs, $transclude) {
            if ($scope.changeSource === undefined || $scope.changeSource === null || $scope.changeSource !== 'in' || $scope.changeSource !== 'out' ) {
                $scope.changeSource = "out";
            }
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        templateUrl: 'eta-function.template.html',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {

            $scope.etaFunctions = new ETAFunctions($scope.functions);
            console.log(JSON.stringify($scope.etaFunctions,null,'\t'));

            $scope.$watch('functions', function(newValue, oldValue) {
                if ($scope.changeSource === "out"){
                    $scope.changeSource = "in";
                    $scope.etaFunctions = new ETAFunctions($scope.functions);
                    console.log("change from outside");
                }
            }, true);

            $scope.$watch('etaFunctions', function(newValue, oldValue) {
                if ($scope.changeSource === "in" && newValue !== oldValue){
                    $scope.functions.function = $scope.etaFunctions.function;
                    console.log("change from inside");
                }else{
                    console.log("no change from inside");
                }
            }, true);

        }
    };
}]);