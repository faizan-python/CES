angular.module('availincident.service', [])
    .factory('availIncidentService', [
        '$http',
        '$cookies',
        '$rootScope',
        '$sessionStorage',
        function($http, $cookies, $rootScope, $sessionStorage) {

            var service = {};
            service.getUserProfile = getUserProfile;
            service.updateUserProfile = updateUserProfile
            return service;

            function getUserProfile() {
                var result = $http.get($rootScope.endPoint + '/api/user/profile/');
                return result;
            }

            function updateUserProfile(data) {
                var result = $http.patch($rootScope.endPoint + '/api/user/profile/update/', angular.toJson(data));
                return result;
            }
        }
    ]);
