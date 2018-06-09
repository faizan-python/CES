'use strict';

angular.module('agenthome', [
    'agenthome.controller'
]).config(
    ['$stateProvider',
     '$urlRouterProvider',
     '$httpProvider',
     function($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/');
        $stateProvider

        .state('header.leftnav.agentHome', {
            url: '/home',
            cache: false,
            templateUrl: '/static/modules/agent-home/views/agent-home.html',
            controller: 'agentHomeCtrl',
            label: 'Agent-Home',
        })
    }]);
