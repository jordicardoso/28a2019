(function(window, angular, $) {
  'use strict';
  var app = angular.module('tvtcResultatsApp.permesa', ['ngRoute', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.emptyBaseLayer', 'ui.grid.autoResize', 'ui.grid.pinning'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/permesa', {
        templateUrl: 'views/permesa/index.html',
        controller: 'permesaController'
      });
    }])
    .controller('permesaController', ['$scope', '$http', '$uibModal',

      function($scope, $http, $uibModal) {

        var gridGlobalOptions = {
            data:[],
            enableFiltering: true,
            useExternalFiltering: false,
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'VotsPerMesa.csv',
            exporterMenuPdf: false,
            exporterMenuExcel: false,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            exporterSuppressColumns: ['action'],
            enablePaginationControls: false
        }

        var gridOptions = {
          onRegisterApi: function(gridApi) {
            $scope.gridApi = gridApi;
          },

          columnDefs: [
            {
              field: 'CODI_MESA',
              displayName: 'Mesa'
            },
            {
              field: 'LOCAL_ELECTORAL',
              displayName: 'Local Electoral'
            },
            {
              field: 'MUNICIPI',
              displayName: 'Municipi'
            },
            {
              field: 'COMARCA',
              displayName: 'Comarca'
            },
            {
              field: 'PROVINCIA',
              displayName: 'Provincia'
            },
            {
              field: 'vnuls',
              displayName: 'Nuls'
            },
            {
              field: 'vblancs',
              displayName: 'Blanc'
            },
            {
              field: 'verc',
              displayName: 'ERC'
            },
            {
              field: 'vjxc',
              displayName: 'JxC'
            },
            {
              field: 'vcup',
              displayName: 'CUP'
            },
            {
              field: 'vpsc',
              displayName: 'PSC'
            },
            {
              field: 'vcs',
              displayName: 'Cs'
            },
            {
              field: 'vppc',
              displayName: 'PP'
            },
            {
              field: 'vcom',
              displayName: 'Comuns'
            },
            {
              field: 'vpacma',
              displayName: 'PACMA'
            },
            /*{
              field: 'vdialeg',
              displayName: 'Dialeg'
            },*/
            {
              field: 'vpumjust',
              displayName: 'PUMJUST'
            },
            {
              field: 'vrecortes',
              displayName: 'Recortes'
            },
            {
              field: 'vfamilia',
              displayName: 'Familia'
            },
            {
              field: 'vdn',
              displayName: 'DN'
            },
            {
              field: 'vpfiv',
              displayName: 'PFIV'
            },
            {
              field: 'vconver',
              displayName: 'CONVER'
            },
            {
              field: 'vunidos',
              displayName: 'UNIDOS'
            },
            {
              field: 'vcilus',
              displayName: 'CILUS'
            },
            {
              field: 'cens',
              displayName: 'Cens'
            },
            {
              field: 'acta_url',
              displayName: 'Acta',
              cellTemplate: '<div class="ui-grid-cell-contents"><button class="btn-small" type="button" uib-tooltip="Veure acta" ng-click="grid.appScope.Ctrl.openModalImage(COL_FIELD, \'Acta\')"><span class="glyphicon glyphicon-list-alt"></span></button></div>'
            }
          ]
        };

        $scope.alerts = [];
        $scope.totalItems = 0;
        $scope.pagination = {
          pageSize: 50,
          page: 1
        }
        $scope.filters = {};
        $scope.orders = {};

        $scope.closeAlert = function(index) {
          $scope.alerts.splice(index, 1);
        };

        $scope.gridOptions = angular.extend({}, gridGlobalOptions, gridOptions);

        $scope.load = function() {
          var query = angular.extend({}, {
            pagination: $scope.pagination
          }, {
            filter: $scope.filters
          }, {
            orders: $scope.orders
          });
          $scope.loadingimage = "/tuvotestucomptes/img/throbber.gif";

          $http.get("/tuvotestucomptes/data/vots_per_mesa.json")
          .then(function successCallback(response) {
            $scope.gridOptions.data = response.data;

            // Loop through data creating enriched fields
            for (var i=0; i<$scope.gridOptions.data.length; i++) {
                   if ($scope.gridOptions.data[i]['COD_PROV'] == "8")   { $scope.gridOptions.data[i]['PROVINCIA'] = "BARCELONA"}
              else if ($scope.gridOptions.data[i]['COD_PROV'] == "17")  { $scope.gridOptions.data[i]['PROVINCIA'] = "GIRONA"}
              else if ($scope.gridOptions.data[i]['COD_PROV'] == "25")  { $scope.gridOptions.data[i]['PROVINCIA'] = "LLEIDA"}
              else if ($scope.gridOptions.data[i]['COD_PROV'] == "43")  { $scope.gridOptions.data[i]['PROVINCIA'] = "TARRAGONA"}

              $scope.gridOptions.data[i]['acta_url'] = "https://raw.githubusercontent.com/josepsanzcamp/recompte-21d/master/imgs/" + $scope.gridOptions.data[i]['acta']
            }

            $scope.totalItems = response.data.length;
            $scope.loadingimage = null;
          }, function errorCallback(response) {
            if (response.status == 404) {
                $scope.gridOptions.data = []
                $scope.totalItems = 0;
            } else {
                $scope.alerts.push({type: 'danger', msg: 'Error carregant les dades de vots per mesa. Error: ' + response.status});
            }
            $scope.loadingimage = null;
          });

        }

        this.openModalImage = function (imageSrc, imageDescription) {
        	$uibModal.open({
        		templateUrl: "modalImage.html",
        		resolve: {
        			imageSrcToUse: function () {
        				return imageSrc;
        			},
        			imageDescriptionToUse: function () {
        				return imageDescription;
        			}
        		},
        		controller: [
        		  "$scope", "imageSrcToUse", "imageDescriptionToUse",
        			function ($scope, imageSrcToUse, imageDescriptionToUse) {
        				$scope.ImageSrc = imageSrcToUse;
        				return $scope.ImageDescription = imageDescriptionToUse;
        		  }
        		],
            size: 'lg'
        	});
        };

        $scope.load();

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
      }
    ])

})(window, angular, jQuery);
