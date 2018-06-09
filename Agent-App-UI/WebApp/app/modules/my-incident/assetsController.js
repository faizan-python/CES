'use strict';

angular.module('AssetsMgmt.controller', [])
    .controller('AssetsMgmtCtrl', ['$scope',
        '$uibModalInstance',
        'items',
        function($scope, $uibModalInstance, items) {
            $scope.item = items;

            $scope.ok = function () {
              $uibModalInstance.close();
            };
        }
    ]);
