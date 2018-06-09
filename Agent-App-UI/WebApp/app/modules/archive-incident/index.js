'use strict';

angular.module('archiveIncident', [
    'archiveIncident.controller']
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
        .state('header.leftnav.archiveIncident' ,{
            url: '/archiveIncident',
            cache: false,
            templateUrl: '/static/modules/archive-incident/views/archive-incident.html',
            controller: 'archiveIncidentCtrl',
            label: 'ArchiveIncident',
        })

    }]);
