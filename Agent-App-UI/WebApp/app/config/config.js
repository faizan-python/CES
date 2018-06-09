//app.config(function($stateProvider,
//    $urlRouterProvider,
//    $httpProvider) {
//
//    $urlRouterProvider.otherwise('/');
//    $stateProvider
//
//    .state('login', {
//        url: '/',
//        templateUrl: '/static/modules/auth/views/login.html',
//        controller: 'LoginCtrl',
//        label: 'Home',
//    })
//
//    .state('login-home', {
//        url: '/login',
//        templateUrl: '/static/modules/auth/views/login.html',
//        controller: 'LoginCtrl',
//        label: 'Home',
//    })
//
//    .state('home', {
//        url: '/dashboard/home',
//        templateUrl: '/static/modules/dashboard/views/dashboard.html',
//        //controller: 'BaseCtrl',
//        label: 'Home',
//    })
//
//    .state('home.availincident', {
//        url: '/availincident',
//        template: 'I could sure use a drink right now.',
//        //controller: 'BaseCtrl',
//        label: 'availincident',
//    })
//
//    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//
//    //Deleting unecessary Headers to avoid module dependency clashes
//    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
//}).run(function($rootScope) {
//    //Setting default endpoint as localhost. Can be modified to api server address.
//    $rootScope.endPoint = "http://52.27.55.241";
//    // $rootScope.endPoint = "http://localhost:8000";
//});