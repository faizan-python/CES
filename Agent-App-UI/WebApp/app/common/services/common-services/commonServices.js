angular.module('header.service',[])
       .factory('headerService',[
       '$http',
       '$cookies',
       '$rootScope',
       '$sessionStorage',
       function($http, $cookies, $rootScope, $sessionStorage) {

        var service = {};
        service.logout = Logout;
        service.getAgentTickets = GetAgentTickets;
        service.getAgentTicketsCount = GetAgentTicketsCount;
        service.GetCallNotifications = GetCallNotifications;
        service.getTicketDetails = getTicketDetails;
        service.deactivateCallSession = deactivateCallSession;
        return service;

        function Logout(){
            var payload = {
                    "token": $sessionStorage.access_token,
                }
            $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
            $http.defaults.headers.common.Authorization = 'Bearer '+ $sessionStorage.access_token;
            var url =  $http.post($rootScope.endPoint + '/log-out/', data=payload);
            return url;
        };

        function GetAgentTickets() {
            var result = $http.get($rootScope.endPoint + '/api/agent/ticket/');
            return result;
        }

        function GetAgentTicketsCount() {
            var result = $http.get($rootScope.endPoint + '/api/agent/ticket/count/');
            return result;
        }

        function GetCallNotifications() {
            var result = $http.get($rootScope.endPoint + '/api/call/notification/');
            return result;
        }

        function getTicketDetails(ticketId) {
            var result = $http.get($rootScope.endPoint + '/api/ticket/' + ticketId + "/");
            return result;
        }

        function deactivateCallSession(ticketId) {
            var result = $http.delete($rootScope.endPoint + '/api/session/detail/' + ticketId + "/");
            return result;
        }

}]);
