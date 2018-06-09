angular.module('extra.service', [])
    .factory('extraService', [
        '$http',
        '$rootScope',
        function ($http, $rootScope) {

            var service = {};
            service.getAgentList = getAgentList;
            service.getAgentInfo = getAgentInfo;

            service.getCategoryList = getCategoryList;
            service.getProducttList = getProducttList;

            return service;

            function getAgentInfo(agent_id) {
                var result = $http.get($rootScope.endPoint + '/api/get/agent/', {
                    params: {
                        "id": agent_id
                    }
                });
                return result;
            };

            function getAgentList(page_no) {
                var result = $http.get($rootScope.endPoint + '/api/agent/register/');
                return result;
            };

            function getCategoryList(page_no) {
                var result = $http.get($rootScope.endPoint + '/api/category/?page=' + page_no);
                return result;
            };

            function getProducttList(category) {
                var result = $http.get($rootScope.endPoint + '/api/products/?category_list=' + category);
                return result;
            };
        }
    ]);
