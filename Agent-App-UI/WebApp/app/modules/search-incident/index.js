'use strict';

angular.module('searchIncident', [
    'searchIncident.controller']
).run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]).config(
    ['$stateProvider',
     '$urlRouterProvider',
     '$httpProvider',
     '$httpProvider',
     function($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('header.leftnav.search' ,{
            url: '/search',
            cache: false,
            templateUrl: '/static/modules/search-incident/views/search-incident.html',
            controller: 'searchIncidentCtrl',
            label: 'SearchIncident',
        })

    }]);
