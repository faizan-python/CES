angular.module('my_incident.service', [])
    .factory('incidentService', [
        '$http',
        '$cookies',
        '$rootScope',
        '$sessionStorage',
        function($http, $cookies, $rootScope, $sessionStorage) {

            var service = {};
            service.incidentcomment = IncidentComments;
            service.incidentprivatemessage = IncidentPrivateMessage;
            service.postincidentcomment = PostIncidentComments;
            service.postprivatemessage = PostIncidentMessage;
            service.getincidentnotes = GetIncidentNotes;
            service.postincidentnote = PostIncidentNotes;
            service.exportprivatemessage = ExportPrivateMessage;
            service.GetFavouriteTickets = GetFavouriteTickets;
            service.GetSimilarSolutions = GetSimilarSolutions;
            service.GetSimilarTickets = GetSimilarTickets;
            service.MakeFavouriteTickets = MakeFavouriteTickets;
            service.exportcomment = ExportComments;
            service.getnearbyLocations = GetnearbyLocations;
            service.postincidentsolution = PostIncidentSolution;
            service.getlinksolution = GetLinkSolution;
            service.addLinkSolution = AddLinkSolution;
            service.removeLinkSolution = RemoveLinkSolution;
            service.searchnearbyLocations = SearchnearbyLocations;
            service.UpdateIncident = UpdateIncident;
            service.TicketDetail = TicketDetail;
            service.AgentProfile = AgentProfile;
            service.acceptincident = AcceptIncident;
            service.addLinkTicket = AddLinkTicket;
            service.validate = Validate;
            service.GetCallNotifications = GetCallNotifications;
            service.deactivateCallSession = deactivateCallSession;

            return service;

            function IncidentComments(ticketId, page_number) {
                var result = $http.get($rootScope.endPoint + '/api/comment/?page=' + page_number, {
                    params: {
                        "ticket": ticketId
                    }
                })
                return result;
            };

            function IncidentPrivateMessage(ticketId, page_number) {
                var result = $http.get($rootScope.endPoint + '/api/private-message/?page=' + page_number, {
                    params: {
                        "ticket": ticketId
                    }
                })
                return result;
            };

            function PostIncidentComments(ticketId, comment_text) {
                var data = {
                    ticket: ticketId,
                    comment_text: comment_text
                };
                var result = $http.post($rootScope.endPoint + '/api/comment/', angular.toJson(data))
                return result;
            };

            function PostIncidentMessage(ticketId, message_text) {
                var data = {
                    ticket: ticketId,
                    message_text: message_text
                };
                var result = $http.post($rootScope.endPoint + '/api/private-message/', angular.toJson(data))
                return result;
            };

            function GetIncidentNotes(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/note/', {
                    params: {
                        "ticket": ticketId
                    }
                })
                return result;
            };

            function PostIncidentNotes(ticketId, note_text) {
                var data = {
                    ticket: ticketId,
                    notes_text: note_text
                };
                var result = $http.post($rootScope.endPoint + '/api/note/', angular.toJson(data))
                return result;
            };

            function ExportPrivateMessage(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/private-message/export/' + ticketId + '/')
                return result;
            };

            function GetFavouriteTickets(ticket) {
                var result = $http.get($rootScope.endPoint + '/api/tickets/favourite/?ticket=' + ticket);
                return result;
            };

            function GetSimilarSolutions(base64_id) {
                var result = $http.get($rootScope.endPoint + '/api/suggest/solution/?id=' + base64_id);
                return result;
            };

            function GetSimilarTickets(id) {
                var result = $http.get($rootScope.endPoint + '/api/similar/ticket/' + id + '/');
                return result;
            };

            function MakeFavouriteTickets(id) {
                var data = {
                    ticket_id: id
                };
                var result = $http.post($rootScope.endPoint + '/api/tickets/favourite/', angular.toJson(data));
                return result;
            };

            function GetLinkSolution(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/agent/ticket/link/?ticket=' + ticketId)
                return result;
            };

            function AddLinkSolution(ticketId, solutions_linked) {
                var payload = "ticket=" + ticketId + "&solutions_linked=" + solutions_linked;
                var result = $http.post($rootScope.endPoint + '/api/agent/ticket/link/', payload)
                return result;
            };

            function RemoveLinkSolution(ticketId, solutionId) {
                var result = $http.delete($rootScope.endPoint + '/api/agent/ticket/link/' + ticketId + '/?solution=' + solutionId);
                return result;
            };

            function ExportComments(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/comments/export/' + ticketId + '/')
                return result;
            };

            function GetnearbyLocations(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/nearby/address/' + ticketId + '/')
                return result;
            };

            function PostIncidentSolution(ticketId, solution_text, tags, sub_status) {
                var data = {
                    ticket: ticketId,
                    solution: solution_text,
                    tags: tags,
                    sub_status:sub_status
                };
                var result = $http.post($rootScope.endPoint + '/api/solution/', angular.toJson(data))
                return result;
            };
            function UpdateIncident(ticketId, ticket_data) {
                var result = $http.patch($rootScope.endPoint + '/api/ticket/'+ ticketId +'/', angular.toJson(ticket_data))
                return result;
            };

            function SearchnearbyLocations(ticketId, search_query) {
                var result = $http.get($rootScope.endPoint + '/api/search/nearby/address/' + ticketId + '/', {
                    params: {
                        "nearby_search": search_query
                    }
                })
                return result;
            };

            function AgentProfile() {
                var result = $http.get($rootScope.endPoint + '/api/basic/profile/')
                return result;
            };

            function TicketDetail(sr_Number) {
                var result = $http.get($rootScope.endPoint + '/api/sr/ticket/detail/', {
                    params: {
                        'sr_number': sr_Number
                    }
                })
                return result;
            };

            function AcceptIncident(ticketId) {
                var result = $http.patch($rootScope.endPoint + '/api/ticket/' + ticketId + '/', {
                    "assign_agent": true
                })
                return result;
            };

            function Validate(username, password) {
                var data = {
                    email: username,
                    password: password,
                    source: "AGENT_APP"
                };
                var url =  $http.post($rootScope.endPoint + '/api/user/login/', angular.toJson(data));
                return url;
            };

            function AddLinkTicket(ticketId, tickets_linked) {
                var data = {
                    ticket: ticketId,
                    tickets_linked: tickets_linked
                };

                var result = $http.post($rootScope.endPoint + '/api/agent/ticket/link/', angular.toJson(data))
                return result;
            };

            function GetCallNotifications(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/call/notification/' + ticketId + '/');
                return result;
            }

            function deactivateCallSession(ticketId) {
                var result = $http.delete($rootScope.endPoint + '/api/session/detail/' + ticketId + "/");
                return result;
            }

        }
    ]);
