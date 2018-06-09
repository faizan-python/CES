angular.module('archiveIncident.service', [])
    .factory('archiveIncidentService', [
        '$http',
        '$rootScope',
        function($http, $rootScope) {

            var service = {};
            service.getArchiveIncident = getArchiveIncident;
            return service;

            function getArchiveIncident() {
                var result = $http.get($rootScope.endPoint + '/api/ticket/archive/')
                return result;
            };
        }
    ]);
