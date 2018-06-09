'use strict';

angular.module('dashboard', [
    'dashboard.controller'
]).config(
    ['$stateProvider',
     '$urlRouterProvider',
     '$httpProvider',
     function($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider.otherwise('/');
        $urlRouterProvider.when('header.home', '/header.home');
        $stateProvider

        .state('header.leftnav.home', {
            url: '',
            cache: false,
            templateUrl: '/static/modules/dashboard/views/dashboard.html',
            controller: 'dashboardCtrl',
            label: 'Home',
        })
    }]);
