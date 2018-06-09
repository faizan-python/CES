angular.module('common.leftnavController', ['common.services'])
    .controller('commonLeftNavCtrl', ['$scope',
        '$sessionStorage',
        '$state',
        '$http',
        '$rootScope',
        'headerService',
        '$timeout',

        function($scope, $sessionStorage, $state, $http, $rootScope, headerService, $timeout) {

            $scope.currentTab = 'home'

            $scope.date = new Date();

            $scope.hideLeftNav = false;

            $scope.selectTab = function(tabName) {
                $scope.currentTab = tabName;
            }

            // $scope.$on('IncomingCall', function(events, args) {
            //     if (args) {
            //         headerService.getTicketDetails(args.ticket).then(function(response) {
            //             $scope.showTicketDetails(response.data);
            //             $timeout(function(){
            //                 $rootScope.$broadcast('ConnectIncomingCall', $sessionStorage.call_details);
            //             }, 3000);
            //         });
            //     }
            // })

            // $scope.incidentDetails = function() {
            //     headerService.getAgentTickets().then(function(response) {
            //         $rootScope.agent_assigned_tickets = response.data;
            //         $rootScope.agent_assigned_tickets_count = response.data.length;
            //     });
            // }

            // $scope.incidentDetailsCount = function() {
            //     headerService.getAgentTicketsCount().then(function(response) {
            //         $rootScope.agent_assigned_tickets_count = response.data.count;
            //     });
            // }

            // $scope.get_assign_tickets = function() {
            //     $scope.incidentDetails();
            // }

            $scope.selectAgentProfilePage = function(){
                $state.go('header.leftnav.agentHome');
            }

            $scope.selectAgentIncidentProfile = function(){
                $state.go('header.leftnav.home');
            }

            // $scope.incidentDetailsCount();

            // $scope.openTicketList = $sessionStorage.listOfOpenTicket;

            // if ($scope.openTicketList && $scope.openTicketList.length){
            //     $scope.incident_selected_ticket = $scope.openTicketList[0];
            //     $scope.incident_selected_ticket_position = 0;
            // }

            $scope.changeCurrentSelectedTicket = function(ticket){
                $scope.incident_selected_ticket = ticket;
                $scope.incident_selected_ticket_position = ObjectPosition(ticket, $scope.openTicketList);
            }

        }
    ])
