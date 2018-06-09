'use strict';

angular.module('myincident', [
    'myincident.controller'
]).config(
    ['$stateProvider',
     '$urlRouterProvider',
     '$httpProvider',
     function($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/');
        $urlRouterProvider.when('header.home', '/header.home');

        $stateProvider

        .state('header.leftnav.myincident' ,{
            url: '/my-incident',
            cache: false,
            templateUrl: '/static/modules/my-incident/views/incident-detail.html',
            controller: 'myIncidentCtrl',
            label: 'MyIncident',
        })
    }]);
