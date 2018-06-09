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
            service.addLinkTicket = AddLinkTicket;
            service.removeLinkSolution = RemoveLinkSolution;
            service.searchnearbyLocations = SearchnearbyLocations;
            service.sendOffer = sendOffer;
            service.AgentProfile = AgentProfile;
            service.TicketDetail = TicketDetail;
            service.TicketLinkSuccessStatusUpdate = TicketLinkSuccessStatusUpdate;
            service.SolutionLinkSuccessStatusUpdate = SolutionLinkSuccessStatusUpdate;

            return service;

            function IncidentComments(ticketId, page_number) {
                var result = $http.get($rootScope.endPoint + '/api/comment/?page='+page_number, {
                    params: {
                        "ticket": ticketId
                    }
                })
                return result;
            };

            function IncidentPrivateMessage(ticketId, page_number) {
                var result = $http.get($rootScope.endPoint + '/api/private-message/?page='+page_number, {
                    params: {
                        "ticket": ticketId
                    }
                })
                return result;
            };

            function PostIncidentComments(ticketId, comment_text) {
                var payload = "ticket=" + ticketId + "&comment_text=" + comment_text;
                var result = $http.post($rootScope.endPoint + '/api/comment/', payload)
                return result;
            };

            function PostIncidentMessage(ticketId, message_text) {
                var payload = "ticket=" + ticketId + "&message_text=" + message_text;
                var result = $http.post($rootScope.endPoint + '/api/private-message/', payload)
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
                var payload = "ticket=" + ticketId + "&notes_text=" + note_text;
                var result = $http.post($rootScope.endPoint + '/api/note/', payload)
                return result;
            };

            function ExportPrivateMessage(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/private-message/export/'+ ticketId + '/')
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
                var payload = "ticket_id=" + id;
                var result = $http.post($rootScope.endPoint + '/api/tickets/favourite/',payload);
                return result;
            };
            function GetLinkSolution(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/agent/ticket/link/?ticket='+ ticketId)
                return result;
            };
            function AddLinkSolution(ticketId, solutions_linked) {
                var payload = "ticket=" + ticketId + "&solutions_linked=" + solutions_linked;
                var result = $http.post($rootScope.endPoint + '/api/agent/ticket/link/', payload)
                return result;
            };
            function AddLinkTicket(ticketId, tickets_linked) {
                var payload = "ticket=" + ticketId + "&tickets_linked=" + tickets_linked;
                var result = $http.post($rootScope.endPoint + '/api/agent/ticket/link/', payload)
                return result;
            };
            function RemoveLinkSolution(ticketId, solutionId) {
                var result = $http.delete($rootScope.endPoint + '/api/agent/ticket/link/'+ ticketId + '/?solution='+ solutionId);
                return result;
            };
            function ExportComments(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/comments/export/'+ ticketId + '/')
                return result;
            };
            function GetnearbyLocations(ticketId) {
                var result = $http.get($rootScope.endPoint + '/api/nearby/address/'+ ticketId + '/')
                return result;
            };

            function PostIncidentSolution(ticketId, solution_text, tags, sub_status) {
                var payload = "ticket=" + ticketId + "&solution=" + solution_text + "&tags=" + tags + "&sub_status=" + sub_status;
                var result = $http.post($rootScope.endPoint + '/api/solution/', payload)
                return result;
            };
            function SearchnearbyLocations(ticketId, search_query) {
                var result = $http.get($rootScope.endPoint + '/api/search/nearby/address/'+ ticketId + '/', {
                    params: {
                        "nearby_search": search_query
                    }
                })
                return result;
            };
            function sendOffer(ticketId, offerId) {
                var payload = "ticket=" + ticketId;
                var result = $http.post($rootScope.endPoint + '/api/offer/send/'+ offerId +'/',payload);
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

            function TicketLinkSuccessStatusUpdate(ticketId, success_status, linked_ticket) {
                var result = $http.patch($rootScope.endPoint + '/api/ticket/link/update/' + ticketId + '/', {
                    "success_status": success_status,
                    "linked_ticket": linked_ticket
                })
                return result;
            };

            function SolutionLinkSuccessStatusUpdate(ticketId, success_status, linked_solution) {
                var result = $http.patch($rootScope.endPoint + '/api/solution/link/update/' + ticketId + '/', {
                    "success_status": success_status,
                    "linked_solution": linked_solution
                })
                return result;
            };
        }
    ]);
