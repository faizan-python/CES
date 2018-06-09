angular.module('archiveIncident.controller', ['archiveIncident.services'])
    .controller('archiveIncidentCtrl', ['$scope',
        '$sessionStorage',
        '$state',
        '$http',
        'archiveIncidentService',

        function($scope, $sessionStorage, $state, $http, archiveIncidentService) {

            $scope.personal_info = $sessionStorage.personal_info;
            $scope.helpers = audetemiHelper.helpers

            $scope.getArchiveIncidentTicket = function() {
                var avail_incidents = archiveIncidentService.getArchiveIncident();
                avail_incidents.then(function(response) {
                    $scope.archive_incident_tickets = response.data;
                    if ($scope.archive_incident_tickets.length){
                        $scope.currentSelectedTicketObj = $scope.archive_incident_tickets[0];
                        $scope.currentAttachments = $scope.currentSelectedTicketObj.attachments;
                    }
                });
            }

            $scope.getArchiveIncidentTicket();

            $scope.changeCurrentSelectedTicket = function(ticketId) {

                for (var i = 0; i < $scope.archive_incident_tickets.length; i++) {
                    if ($scope.archive_incident_tickets[i].id === ticketId) {
                        $scope.currentSelectedTicketObj = $scope.archive_incident_tickets[i];
                        $scope.currentAttachments = $scope.currentSelectedTicketObj.attachments;
                    }
                }
            }
        }
    ])
