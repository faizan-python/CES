angular.module('auth.controller', ['auth.services'])
    .controller('authCtrl', ['$scope',
        '$sessionStorage',
        '$state',
        '$http',
        '$location',
        'authService',
        '$timeout',

        function($scope, $sessionStorage, $state, $http, $location, authService, $timeout) {

            $scope.submit = function() {

                $scope.isInvalid = false;

                if ($scope.email && $scope.password) {
                    var response = authService.validate($scope.email, $scope.password);
                    response.then(function success(response) {
                        if (response.data && response.data.token_details.access_token) {
                            var access_token = response.data.token_details.access_token;
                            $sessionStorage.access_token = access_token;
                            $sessionStorage.personal_info = response.data.user_details;
                            $sessionStorage.normal_login = true;
                            $state.go('header.leftnav.agentHome');
                        } else {
                            $scope.isInvalid = true;
                            $scope.messsage = "Username and Password do not match !"
                        }
                    }, function error(response) {
                        $scope.isInvalid = true;
                        $scope.messsage = "Username and Password do not match !"
                    })
                } else {
                    if (!$scope.email) {
                        $scope.messsage = "Please enter your email"
                    }
                    if (!$scope.password) {
                        $scope.messsage = "Please enter your password"
                    }
                    $scope.isInvalid = true;
                }
                $timeout(function() {
                    $scope.isInvalid = false;
                }, 3000);
            }

            $scope.signup = function() {
                $state.go('signup');
            }
        }
    ])
