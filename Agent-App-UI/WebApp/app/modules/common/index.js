'use strict';

angular.module('common', [
    'common.controller', 'common.leftnavController']
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
        .state('header' ,{
            url: '/header',
            abstract: true,
            cache: false,
            templateUrl: '/static/modules/common/views/header.html',
            controller: 'commonCtrl',
            label: 'Header',
        })

        .state('header.leftnav' ,{
            url: '',
            abstract: true,
            cache: false,
            templateUrl: '/static/modules/common/views/leftNav.html',
            controller: 'commonLeftNavCtrl',
            label: 'LeftNav',
        })

        // setting the default http content type header for module
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

    }]);
