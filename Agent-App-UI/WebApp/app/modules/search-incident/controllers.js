angular.module('searchIncident.controller', ['searchIncident.services', 'availIncident.services', 'infinite-scroll'])
    .controller('searchIncidentCtrl', ['$scope',
        '$sessionStorage',
        '$state',
        '$http',
        '$rootScope',
        'searchIncidentService',
        'availIncidentService',

        function($scope, $sessionStorage, $state, $http, $rootScope, searchIncidentService, availIncidentService) {

            $scope.personal_info = $sessionStorage.personal_info;
            angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 450)

            $scope.page_number = 1
            $scope.next_url = ""
            $scope.loading = false
            $scope.busy = true
            $scope.first_autoscroll = true

            $scope.getnextPage = function(next_page_url) {
                $scope.next_url = next_page_url.split('page=')
                if ($scope.next_url.length > 1) {
                    $scope.next_url = $scope.next_url[1].split('&')
                    $scope.page_number = $scope.next_url[0]
                } else {
                    $scope.page_number = $scope.next_url[1]
                }
            }

            $scope.getSearchIncidentTicket = function(searchString, page) {
                $scope.loading = true
                $scope.busy = true
                if (page) {
                    $scope.page_number = page
                }

                var avail_incidents = searchIncidentService.fetchSearchResult(searchString, $scope.page_number);
                avail_incidents.then(function(response) {
                    if ($scope.page_number == 1) {
                        $rootScope.search_incident_tickets = []
                    }
                    $scope.search_incident_tickets.push.apply($scope.search_incident_tickets, response.data.results)

                    if (response.data.next) {
                        $scope.getnextPage(response.data.next)
                    } else {
                        $scope.next_url = ""
                        $scope.busy = true
                        $scope.loading = false
                        return
                    }

                    if ($scope.search_incident_tickets.length) {
                        $scope.currentSelectedTicketObj = $scope.search_incident_tickets[0];
                        $scope.currentAttachments = $scope.currentSelectedTicketObj.attachments;
                    }
                    $scope.loading = false
                    $scope.busy = false
                });
            }

            $scope.$on('SearchString', function(events, args) {
                if (args) {
                    $scope.search = args;
                    $scope.page_number = 1
                    $scope.getSearchIncidentTicket($scope.search);
                }
            })

            if ($scope.$parent.search.string) {
                $scope.search = $scope.$parent.search.string
                $scope.getSearchIncidentTicket($scope.$parent.search.string);
            }

            $scope.updateSearchIncidentTicket = function() {
                if ($scope.first_autoscroll) {
                    $scope.first_autoscroll = false
                } else {
                    $scope.getSearchIncidentTicket($scope.search, $scope.page_number)
                }
            }

            $scope.refreshSearch = function() {
                $scope.page_number = 1
                if ($scope.search.length == 0) {
                    $scope.getSearchIncidentTicket($scope.search);
                } else if ($scope.$parent.search.string.length == 0) {
                    $scope.getSearchIncidentTicket($scope.$parent.search.string);
                }
            }

            $scope.changeCurrentSelectedTicket = function(ticketId) {

                for (var i = 0; i < $scope.search_incident_tickets.length; i++) {
                    if ($scope.search_incident_tickets[i].id === ticketId) {
                        $scope.currentSelectedTicketObj = $scope.search_incident_tickets[i];
                        $scope.currentAttachments = $scope.currentSelectedTicketObj.attachments;
                    }
                }
            }

            $scope.acceptticket = function(ticketId) {
                var accepted_ticket = availIncidentService.acceptincident(ticketId)
                accepted_ticket.then(function(response) {
                    $scope.agent_accepted_ticket = response.data;
                    if (response.status == 200) {
                        $rootScope.agent_assigned_tickets_count += 1;
                        for (var i = 0; i < $scope.search_incident_tickets.length; i++) {
                            if ($scope.search_incident_tickets[i].id === ticketId) {
                                $scope.search_incident_tickets[i] = $scope.agent_accepted_ticket;
                                $scope.changeCurrentSelectedTicket(ticketId)
                            }
                        }
                    }

                    /*                  If the ticket is already assigned by agent the just refresh the page 
                                        with same heat index*/

                    if (response.status == 204) {
                        $scope.refreshSearch()
                    }
                });
            };
        }
    ])
