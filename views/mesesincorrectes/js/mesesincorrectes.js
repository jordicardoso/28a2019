(function(window, angular, $) {
  'use strict';
  var app = angular.module('tvtcResultatsApp.mesesincorrectes', ['ngRoute', 'ui.bootstrap', 'ui.grid', 'ui.grid.selection', 'ui.grid.exporter', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.emptyBaseLayer', 'ui.grid.autoResize', 'ui.grid.pinning'])
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/mesesincorrectes', {
        templateUrl: 'views/mesesincorrectes/index.html',
        controller: 'mesesincorrectesController'
      });
    }])
    .controller('mesesincorrectesController', ['$scope', '$http', '$uibModal',

      function($scope, $http, $uibModal) {

        var gridGlobalOptions = {
            data:[],
            enableFiltering: true,
            useExternalFiltering: false,
            enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'MesesIncorrectes.csv',
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
              field: 'vnuls',
              displayName: 'Nuls'
            },
            {
              field: 'vnuls_oficial',
              displayName: 'Nuls Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vblancs',
              displayName: 'Blanc'
            },
            {
              field: 'vblancs_oficial',
              displayName: 'Blanc Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'verc',
              displayName: 'ERC'
            },
            {
              field: 'verc_oficial',
              displayName: 'ERC Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vjxc',
              displayName: 'JxC'
            },
            {
              field: 'vjxc_oficial',
              displayName: 'JxC Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vcup',
              displayName: 'CUP'
            },
            {
              field: 'vcup_oficial',
              displayName: 'CUP Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vpsc',
              displayName: 'PSC'
            },
            {
              field: 'vpsc_oficial',
              displayName: 'PSC Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vcs',
              displayName: 'Cs'
            },
            {
              field: 'vcs_oficial',
              displayName: 'Cs Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vppc',
              displayName: 'PP'
            },
            {
              field: 'vppc_oficial',
              displayName: 'PP Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vcom',
              displayName: 'Comuns'
            },
            {
              field: 'vcom_oficial',
              displayName: 'Comuns Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vpacma',
              displayName: 'PACMA'
            },
            {
              field: 'vpacma_oficial',
              displayName: 'PACMA Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vpumjust',
              displayName: 'PUMJUST'
            },
            {
              field: 'vpumjust_oficial',
              displayName: 'PUMJUST Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'vrecortes',
              displayName: 'Recortes'
            },
            {
              field: 'vrecortes_oficial',
              displayName: 'Recortes Oficial',
              cellClass: 'oficial'
            },
            {
              field: 'cens',
              displayName: 'Cens'
            },
            {
              field: 'Cens electoral',
              displayName: 'Cens Oficial',
              cellClass: 'oficial'
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

          $http.get("/tuvotestucomptes/data/vots_per_mesa_incorrecta.json")
          .then(function successCallback(response) {
            $scope.gridOptions.data = response.data;

            // Loop through data creating enriched fields
            for (var i=0; i<$scope.gridOptions.data.length; i++) {
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
