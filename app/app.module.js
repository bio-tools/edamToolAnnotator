'use strict';

// Define the `demo` app module
angular.module('mydemo', [
  // ...which depends on other modules
    'edamToolAnnotator'
]).controller('mydemocontroller', ['$scope',function($scope){

        $scope.$watch('f.name', function(newValue, oldValue) {
            $scope.f.id = $scope.f.name;
        });
}]);


