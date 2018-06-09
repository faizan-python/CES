angular.module('common.controller', ['common.services'])
    .controller('commonCtrl', ['$scope',
        '$sessionStorage',
        '$state',
        '$http',
        '$rootScope',
        'headerService',
        '$window',
        '$interval',
        'ngToast',
        '$sce',
        '$timeout',

        function($scope, $sessionStorage, $state, $http, $rootScope, headerService, $window,
                 $interval, ngToast, $sce, $timeout) {

            $scope.user_personal_info = $sessionStorage.personal_info;
            $sessionStorage.call_connected = false;
            $sessionStorage.incoming_call = false;

            $scope.search = {
                string: ''
            }

            $scope.logout = function() {
                headerService.logout();
                $sessionStorage.$reset();
                delete $http.defaults.headers.common["Authorization"];
                $state.go('login-home');
                $rootScope = $rootScope.$new(true);
            }

            $scope.started = false;
            $scope.headersettings = {};
            $scope.headersettings.hideSearch = false;
            $scope.headersettings.hideLogout = false;
        }
    ])
