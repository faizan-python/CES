angular.module('distressIncident.controller', ['distressIncident.services'])
    .controller('distressIncidentCtrl', ['$scope',
        '$sessionStorage',
        '$state',
        '$http',
        'distressIncidentService',

        function($scope, $sessionStorage, $state, $http, distressIncidentService) {

            $scope.user = {}
            $scope.typeData = [{
                "name": "Developer"
                },
                {
                "name":"Reviewer"
                }
            ]

            $scope.signip = function() {
                $state.go("login");
            }

            $scope.userSignUp = function() {
                if (!$scope.user.email) {
                    alert("Email Not Provided")
                }
                else if (!$scope.user.password) {
                    alert("Password Not Provided")
                }
                else if (!$scope.user.confirm_password) {
                    alert("Confirm Password not provided")
                }
                else if (!$scope.user.first_name) {
                    alert("Please Let us Know your name")
                }
                else if (!$scope.user.number) {
                    alert("Please let us know your Contact Number so that we can be in touch")
                }
                else if (!$scope.user.role) {
                    alert("Please Select Role, so that we can serve you better")
                }
                else if ($scope.user.password != $scope.user.confirm_password) {
                    alert("Hey!! your Passwords do not match")
                }
                else if ($scope.user.password.length < 8) {
                    alert("Hey!! your Passwords should be atleast 8 digit")
                }
                else {
                    var userResponse = distressIncidentService.signUp($scope.user);
                    userResponse.then(function success(response) {
                        alert("Hey You have signed Up successfully!! We will let you know once admin verifies your account")
                        $scope.user = {}
                    }, function error(response) {
                        alert("registration Failed", response.data.msg)
                    })
                }
            }
        }
    ])
