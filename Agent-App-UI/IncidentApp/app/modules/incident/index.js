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
    }]);
