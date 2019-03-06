angular.module('tvtcResultatsApp.escons', ['ngRoute','ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/escons', {
        templateUrl : 'views/escons/index.html',
        controller  : 'esconsController'
    });
}])

.controller('esconsController', ['$scope', '$http', '$uibModal', '$location',
	function($scope, $http, $uibModal, $location) {
    $scope.alerts = [];
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.loadingimage = "/tuvotestucomptes/img/throbber.gif";
    $scope.escons = []

    $http.get("/tuvotestucomptes/data/escons.json")
    .then(function successCallback(response) {
      $scope.escons = response.data;

      // Ignorar Dialeg
      for (var i=0; i<$scope.escons.length; i++) {
        if ($scope.escons[i].name == "Dialeg") {
          $scope.escons.splice(i, 1);
          break;
        }
      }
      
      // Build pretty fields
      for (var i=0; i<$scope.escons.length; i++) {
        $scope.escons[i].vots_pretty = $scope.escons[i].vots.toLocaleString();
      }

      $scope.loadingimage = null;
    }, function errorCallback(response) {
      if (response.status == 404) {
          $scope.escons = []
      } else {
          $scope.alerts.push({type: 'danger', msg: 'Error carregant les dades d\'escons. Error: ' + response.status});
      }
      $scope.loadingimage = null;
    });

    // Carregar dades de l'estat del recompte
    $scope.estatrecompte = {}
    $http.get("/tuvotestucomptes/data/estat_recompte.json")
    .then(function successCallback(response) {
      $scope.estatrecompte = response.data;
    }, function errorCallback(response) {
      if (response.status == 404) {
          $scope.escons = []
      } else {
          $scope.alerts.push({type: 'danger', msg: 'Error carregant les dades d\'estat del recompte. Error: ' + response.status});
      }
    });

}]);
