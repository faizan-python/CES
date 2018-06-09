angular.module('dash.service', [])
    .factory('dashService', [
        '$http',
        '$cookies',
        '$rootScope',
        '$sessionStorage',
        function($http, $cookies, $rootScope, $sessionStorage) {

            var service = {};
            service.get_my_products = get_my_products;
            service.getFlaggedProduct = getFlaggedProduct;
            service.getTopTicket = getTopTicket;
            service.getTopInfluencers = getTopInfluencers;
            service.getSupportRating = getSupportRating;
            return service;

            function get_my_products() {
                var result = $http.get($rootScope.endPoint + '/api/agent/ticket/');
                return result;

            };

            function getFlaggedProduct() {
                var url = $http.get($rootScope.endPoint + '/api/flagged/products/');
                return url;
            };

            function getTopTicket() {
                var result = $http.get($rootScope.endPoint + '/api/top/tickets/');
                return result;
            };

            function getTopInfluencers(product_id) {
                var result = $http.get($rootScope.endPoint + '/api/product/influencers/' + product_id + '/');
                return result;
            };

            function getSupportRating() {
                var result = $http.get($rootScope.endPoint + '/api/product/support/rating/');
                return result;
            }
        }
    ]);
