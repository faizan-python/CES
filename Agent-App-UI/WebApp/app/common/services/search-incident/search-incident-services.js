angular.module('searchIncident.service', [])
    .factory('searchIncidentService', [
        '$http',
        '$rootScope',
        function($http, $rootScope) {

            var service = {};
            service.fetchSearchResult = fetchSearchResult;
            return service;

        function fetchSearchResult(searchString, page_number){
            var result = $http.get($rootScope.endPoint + '/api/agent/ticket/search/?page='+page_number, {
                params: {
                    'query': searchString
                }
            });
            return result
        }
        }
    ]);
