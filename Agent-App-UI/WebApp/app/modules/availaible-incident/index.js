'use strict';

angular.module('availIncident', [
    'availIncident.controller']
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
        .state('header.leftnav.availIncident' ,{
            url: '/availIncident',
            cache: false,
            templateUrl: '/static/modules/availaible-incident/views/available-incident.html',
            controller: 'availIncidentCtrl',
            params: {
                ticket: null
            },
            label: 'AvailaibleIncident',
        })

    }]);
