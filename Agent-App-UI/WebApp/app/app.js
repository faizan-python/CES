'use strict';

var audetemiHelper = audetemiHelper || {};

audetemiHelper.helpers = {
    getProgressBarClass: function(influence_score) {
        if (influence_score < 10)
            return "progress-bar-success-10"
        else if (influence_score < 20)
            return "progress-bar-success-20"
        else if (influence_score < 30)
            return "progress-bar-success-30"
        else if (influence_score < 40)
            return "progress-bar-success-40"
        else if (influence_score < 50)
            return "progress-bar-success-50"
        else if (influence_score < 60)
            return "progress-bar-success-60"
        else if (influence_score < 70)
            return "progress-bar-success-70"
        else if (influence_score < 80)
            return "progress-bar-success-80"
        else if (influence_score < 90)
            return "progress-bar-success-90"
        else if (influence_score > 90)
            return "progress-bar-success-100"
    }
};

angular.module('audetemi_app', [
    'ngRoute',
    'ui.router',
    'ngStorage',
    'ngSanitize',
    'auth',
    'common',
    'dashboard',
    'availIncident',
    'myincident',
    'agenthome',
    'archiveIncident',
    'distressIncident',
    'searchIncident',
    'uiGmapgoogle-maps',
    'googlechart',
    'ngCookies',
    'ui.bootstrap',
    'ngToast',
    'chart.js',

]).filter("nl2br", function($filter) {
    return function(data) {
        if (!data) return data;
        return data.replace(/\n\r?/g, '<br />');
    };
}).filter('linkyUnsanitized', ['$sanitize', function($sanitize) {
    var LINKY_URL_REGEXP =
        /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
        MAILTO_REGEXP = /^mailto:/;

    return function(text, target) {
        if (!text) return text;
        var match;
        var raw = text;
        var html = [];
        var url;
        var i;
        while ((match = raw.match(LINKY_URL_REGEXP))) {
            // We can not end in these as they are sometimes found at the end of the sentence
            url = match[0];
            // if we did not match ftp/http/mailto then assume mailto
            if (match[2] == match[3]) url = 'mailto:' + url;
            i = match.index;
            addText(raw.substr(0, i));
            addLink(url, match[0].replace(MAILTO_REGEXP, ''));
            raw = raw.substring(i + match[0].length);
        }
        addText(raw);
        return html.join('');

        function addText(text) {
            if (!text) {
                return;
            }
            html.push(text);
        }

        function addLink(url, text) {
            html.push('<a ');
            if (angular.isDefined(target)) {
                html.push('target="');
                html.push(target);
                html.push('" ');
            }
            html.push('href="');
            html.push(url);
            html.push('">');
            addText(text);
            html.push('</a>');
        }
    };
}]).config(
    ['$stateProvider',
        '$locationProvider',
        '$urlRouterProvider',
        '$httpProvider',
        '$sceDelegateProvider',
        'uiGmapGoogleMapApiProvider',
        function($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider, GoogleMapApiProviders) {

            $sceDelegateProvider.resourceUrlWhitelist(['**']);

            $urlRouterProvider.otherwise('/');
            $stateProvider

            .state('login', {
                url: '/',
                templateUrl: '/static/modules/auth/views/login.html',
                controller: 'authCtrl',
                label: 'Home',
            })

            .state('signup', {
                url: '/signup',
                templateUrl: '/static/modules/distress-incident/views/distress-incident.html',
                controller: 'distressIncidentCtrl',
                label: 'Signup',
            })

            .state('login-home', {
                url: '/login',
                templateUrl: '/static/modules/auth/views/login.html',
                controller: 'authCtrl',
                label: 'Home',
            })

        }
    ]).run(['$http', '$cookies', '$rootScope', '$sessionStorage', '$state', '$window',
    function($http, $cookies, $rootScope, $sessionStorage, $state, $window) {

        
        $http.defaults.xsrfCookieName = 'csrftoken';
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
        $http.defaults.headers.post['Content-Type'] = 'application/json';

        /* $rootScope.endPoint = "http://tml.snaphelpinc.com"; */
        $rootScope.endPoint = "http://127.0.0.1:8000";

        $rootScope.$on('$stateChangeSuccess', function(event) {
            if ($sessionStorage.access_token && $state.current.name != 'login') {
                if (!$http.defaults.headers.common['Authorization']) {
                    $http.defaults.headers.common['Content-Type'] = 'application/json';
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + $sessionStorage.access_token;
                }
            }
        });
    }
]);
