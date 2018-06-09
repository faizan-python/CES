    var apiKey = '';
    var token = '';
    var sessionId = '';
    var session;
    var subscriber;
    var customer_connected = false;
    var connectionCount = 0;
    var connectionId;

    var host_name = $(location).attr('host');
    var access_token;
    var ticket_id;
    var personal_info;
    var timeout;

    function raise_alert_model(model_content) {
        new jBox('Modal', {
            width: 500,
            height: 150,
            content: model_content,
            title: '<center> <b style="color: black;">Alert !!!</b> </center>',
            autoClose: 3000
        }).open();
    }

    function connect_publisher() {
        customer_connected = false;
        connectionCount = 0;

        session = TB.initSession(apiKey, sessionId);

        var pubsubContainer = document.createElement('div');
        pubsubContainer.id = 'stream-' + "12";
        document.getElementById('publisher').appendChild(pubsubContainer);

        publisher = TB.initPublisher(apiKey, pubsubContainer, {
            style: {buttonDisplayMode: 'on'},
            showControls: true,
            name: "Agent"
        });

        session.on({
          sessionConnected: function(event) {
            
            session.publish(publisher);
            $("#subscriberChatLoader").show();
            $('#callaudio').get(0).play();
          },

          streamCreated: function(event) {
            var subContainer = document.createElement('div');
            subContainer.id = 'stream-' + event.stream.streamId;
            document.getElementById('subscribers').appendChild(subContainer);
            subscriber = session.subscribe(event.stream, subContainer, {insertMode: 'replace'});

            subscriber.on({
                videoDisabled: function(event) {
                  subscriber.setStyle('videoDisabledDisplayMode', 'on');
                },
                videoDisableWarning: function(event) {
                  subscriber.setStyle('videoDisabledDisplayMode', 'on');
                },
                videoDisableWarningLifted: function(event) {
                  subscriber.setStyle('videoDisabledDisplayMode', 'off');
                },
                videoEnabled: function(event) {
                  subscriber.setStyle('videoDisabledDisplayMode', 'off');
                }
            });
          }
        });

        session.on("streamDestroyed", function (event) {
          console.log("Stream stopped. Reason: " + event.reason);
        });

        publisher.on('streamCreated', function (event) {
            console.log('The publisher started streaming.');
        });

        publisher.on("streamDestroyed", function (event) {
          console.log("Stream stopped. Reason: " + event.reason);
        });

        session.on('connectionCreated', function (event) {
            connectionCount++;
            $("#subscriberChatLoader").show();
            if (connectionCount > 1) {
                $('#callaudio').get(0).pause();
                customer_connected = true;
                $("#subscriberChatLoader").hide();
            }
        });

        session.on('connectionDestroyed', function (event) {
            $('#callaudio').get(0).pause();
            raise_alert_model('<center style="color: black;">Customer has terminated the video chat</center>');
            $("#StopVideoChat").trigger('click');
        });

        session.connect(token);

        timeout = setTimeout( function(){
            if (!customer_connected) {
                $('#callaudio').get(0).pause();
                raise_alert_model('<center style="color: black;">Customer did not recieve the call</center>');
                $("#StopVideoChat").trigger('click');
            }
        }, 90000 );
    }

    function disconnect_publisher() {
        session.disconnect();
        deactivate_session_id(connectionId);
    }

    function deactivate_session_id(id) {
        if (id) {
            $.ajax({
                url : "https://" + host_name + "/api/session/detail/"+ id +"/",
                type : "DELETE",
                contentType: "application/json",
                beforeSend: function(xhr, settings){
                    xhr.setRequestHeader('Authorization', 'Bearer '+ access_token);
                },
                dataType: 'json',

                success : function(response) {
                },
                error: function(response) {
                    raise_alert_model('<center style="color: black;">Could Not Deactivate Session From Server</center>')
                },
            });
        }
        else {
            raise_alert_model('<center style="color: black;">Session id not Provided</center>');
            $("#StopVideoChat").trigger('click');
        }
    }

    function generate_token_and_session() {
        if (ticket_id) {
            var ticket_data = {};
            ticket_data["ticket_id"] = ticket_id;
            $.ajax({
                url : "https://" + host_name + "/api/session/generate/",
                type : "POST",
                contentType: "application/json",
                beforeSend: function(xhr, settings){
                    xhr.setRequestHeader('Authorization', 'Bearer '+ access_token);
                },
                data : JSON.stringify(ticket_data),
                dataType: 'json',

                success : function(response) {
                    token = response.initiator_token;
                    sessionId = response.session_id;
                    apiKey = response.api_key;
                    connectionId = response.id;
                    connect_publisher();
                },
                error: function(response) {
                        raise_alert_model('<center style="color: black;">Could Not Generate Session From Server</center>');
                        $("#StopVideoChat").trigger('click');
                    },
            });
        }
        else {
            raise_alert_model('<center style="color: black;">Ticket id not Provided</center>');
            $("#StopVideoChat").trigger('click');
        }
    }

    function BrowserDetection() {

        //Check if browser is IE or not
        if (navigator.userAgent.search("MSIE") >= 0) {
        }
        //Check if browser is Chrome or not
        else if (navigator.userAgent.search("Chrome") >= 0) {
           raise_alert_model('<center style="color: black;">Open Tak supports only HTTPS connection on Google Chrome</center>');
        }
        //Check if browser is Firefox or not
        else if (navigator.userAgent.search("Firefox") >= 0) {
        }
        //Check if browser is Safari or not
        else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
        }
        //Check if browser is Opera or not
        else if (navigator.userAgent.search("Opera") >= 0) {
        }
    }

    function stop_video() {
        if (connectionCount > 0) {
            $('#callaudio').get(0).pause();
            if (timeout) {
                clearTimeout(timeout);
            }
            $("#StopVideoChat").hide();
            $("#StartVideoChat").show();
            $("#videoChatPanel").hide();
            connectionCount = 0;
            disconnect_publisher();
        };
    };

    function start_video(id, user_token, user_info, connect_call, call_details) {
        $("#StopVideoChat").show();
        $("#subscriberChatLoader").hide();
        $("#videoChatSection").show();
        $("#publisherChatLoader").show();
        $("#StartVideoChat").hide();
        $("#videoChatPanel").show();
        BrowserDetection()
        ticket_id = id;
        access_token = user_token;
        personal_info = user_info;
        if (!connect_call) {
            generate_token_and_session();
        }
        else {
            incomingCall = true;
            token = call_details.reciever_token;
            sessionId = call_details.session_id;
            apiKey = call_details.api_key;
            connectionId = call_details.id;
            connect_publisher();
        }
    };

'use strict';

angular.module('myincident.controller', ['myincident.services', 'AssetsMgmt.controller', 'CloseTicket.controller', 'uiGmapgoogle-maps', 'googlechart'])
    .controller('myIncidentCtrl', ['$scope',
        '$sessionStorage',
        '$state',
        '$rootScope',
        '$http',
        '$location',
        'incidentService',
        '$uibModal',
        '$log',
        '$timeout',
        '$window',
        'ngToast',
        '$sce',
        '$interval',


        function($scope, $sessionStorage, $state, $rootScope, $http, $location, incidentService,
            $uibModal, $log, $timeout, $window, ngToast, $sce, $interval) {

            $scope.enableLoader = true;
            $scope.tags = [];
            $scope.helpers = audetemiHelper.helpers;

            // Initializing which accordian tab is opened
            $scope.responseTabOpened = true;
            $scope.notesTabOpened = false;
            $scope.linkedAnswerTabOpened = false;
            $scope.currentSelectedTab = 'response';
            $scope.page_number = 1;
            $scope.next_url = "";
            $scope.loading = false;
            $scope.nearbyloader = false;
            $scope.locationsearchString = "";
            $scope.messagePlaceholder = "Write Message";
            $sessionStorage.call_connected = false;
            $sessionStorage.incoming_call = false;
            $scope.incident_selected_ticket = "";

            $scope.private_message_tab_seleceted = true;
            $scope.inputcomment = {
                "text": ""
            };
            $scope.inputprivatemessage = {
                "text": ""
            };
            $scope.note = {
                "note": ""
            };
            $scope.nearbysearch = {
                "string": ""
            };
            $scope.ticket_linked_iteams = {};

            /*Incoming Call Notification*/
            var deactivatecall = function() {
                if ($sessionStorage.call_connected == false && $sessionStorage.call_details) {
                    $sessionStorage.incoming_call = false;
                    var deactivateSession = incidentService.deactivateCallSession($sessionStorage.call_details.id)
                    $sessionStorage.call_details = "";
                    if ($sessionStorage.incoming_audio) {
                        $sessionStorage.incoming_audio.pause();
                    }
                }
            }

            $scope.rejectCall = function() {
                deactivatecall();
            }

            $scope.acceptCall = function() {
                $sessionStorage.call_connected = true;
                start_video($scope.incident_selected_ticket.id,
                            $sessionStorage.access_token, $scope.personal_info,
                            $sessionStorage.incoming_call, $sessionStorage.call_details);
                $sessionStorage.incoming_audio.pause();
            }

            $scope.check_session = function (id) {
                if ($sessionStorage.call_details) {
                    if ($sessionStorage.call_details.id == id) {
                        return false
                    }
                    else {
                        return true
                    }
                }
                else {
                    return true
                }
            }

            $scope.refreshCallNotifications = function() {
                if ($sessionStorage.incoming_call == false && $sessionStorage.call_connected == false && $scope.incident_selected_ticket) {
                    var callNotifications = incidentService.GetCallNotifications($scope.incident_selected_ticket.id)
                    callNotifications.then(function(response) {
                        if (response.data.length) {
                            $scope.session_status = $scope.check_session(response.data[0].id)
                            if (response.data[0].is_active && $scope.session_status == true) {
                                $sessionStorage.incoming_audio = new Audio('/static/assets/incident/audio/call_tone.mp3');
                                $sessionStorage.incoming_audio.play();
                                $sessionStorage.incoming_call = true;
                                $sessionStorage.call_details = response.data[0];
                                $scope.calling_user = response.data[0].initiator_user;
                                $scope.msg = "<div style='width: 200px; height: 97px;'><h4 style='text-align: center;' class='centre incoming-call'>Incoming Call From "+ $scope.calling_user.full_name + "</h4></br><a ng-click='rejectCall()' class='reject'></a> <a class='accept' ng-click='acceptCall()'></a></div>"
                                ngToast.create({
                                    content: $sce.trustAsHtml($scope.msg),
                                    compileContent: true,
                                    timeout: 85000,
                                    horizontalPosition: "center",
                                    verticalPosition: 'top',
                                    maxNumber: 1
                                });
                            }
                            $timeout(deactivatecall, 85000);
                        }
                    });
                }
            }

            $interval(function () {
                $scope.refreshCallNotifications();
            }, 4000);

            /*Function to retrive access token from url and get agent profile*/
            $scope.getAgentProfile = function() {
                var agentProfile = incidentService.AgentProfile();

                agentProfile.then(function(response) {
                    $sessionStorage.personal_info = response.data.personal_info;
                    $scope.personal_info = response.data.personal_info;
                })
                agentProfile.error(function(response) {
                    alert("Access Token is not valid");
                })
                $timeout(function() {}, 4000);
            }

            /*Function to retrive access token from url and get Ticket Object*/
            $scope.getTicketObj = function(sr_no) {
                var ticketObj = incidentService.TicketDetail(sr_no);

                ticketObj.then(function(response) {

                    $scope.incident_selected_ticket = response.data;
                    $sessionStorage.selected_ticket = response.data.id;

                    var accepted_ticket = incidentService.acceptincident(response.data.id);

                    accepted_ticket.then(function(response) {
                        $rootScope.agent_assigned_tickets_count += 1;
                        $scope.loadTicketDetails();
                    })
                });
                ticketObj.error(function(response) {
                    if (ticketObj.$$state.value.status == 404) {
                        alert("Ticket with this SR Number does not exits");
                    }
                })
            }

            /*Function to retrive access token from url*/
            $scope.checkForAccesstoken = function() {

                if ($sessionStorage.sr_no && $sessionStorage.access_token) {

                    $scope.sr_no = $sessionStorage.sr_no;
                    $sessionStorage.sr_no = "";
                    $sessionStorage.direct_login = "";
                    $scope.getAgentProfile();

                    $scope.getTicketObj($scope.sr_no);
                }
            }

            $scope.user_login = function(user_username, user_password) {
                var response = incidentService.validate(user_username, user_password);
                response.then(function success(response) {
                    if (response.data && response.data.access_token) {
                        var access_token = response.data.access_token;
                        $sessionStorage.access_token = access_token;
                        $sessionStorage.personal_info = response.data.personal_info;
                        $http.defaults.headers.common['Content-Type'] = 'application/json';
                        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $sessionStorage.access_token;
                        $scope.checkForAccesstoken();
                    } else {
                        alert("Username and Password do not match !");
                    }
                }, function error(response) {
                    alert("Username and Password do not match !");
                })
            };

            /*Retriving Username Password and Sr No and creating json it*/
            if ($location.absUrl().split("?")[1]) {
                var sub_url = $location.absUrl().split("?")[1].split("#")[0];
                var sub_url = sub_url.split("&");
                var url_dict = {};

                for (var i = 0; i < sub_url.length; i++) {
                    if (sub_url[i].split("=")[0] && sub_url[i].split("=")[1]) {
                        url_dict[sub_url[i].split("=")[0]] = sub_url[i].split("=")[1];
                    }
                }

                /*Login through accesstoken */
                if (url_dict.username && url_dict.password && url_dict.sr_no) {
                    $sessionStorage.sr_no = url_dict.sr_no;
                    $sessionStorage.direct_login = true;
                    $scope.user_login(url_dict.username, url_dict.password);
                } else {
                    if (!url_dict.username) {
                        alert("Username Not Provided");
                    }
                    if (!url_dict.password) {
                        alert("Password not Provided");
                    }
                    if (!url_dict.sr_no) {
                        alert("Sr No. not provided");
                    }
                }
            }

            $scope.selectAccordianTab = function(tabName) {
                if (tabName == 'response') {
                    $scope.responseTabOpened = true;
                    $scope.notesTabOpened = false;
                    $scope.linkedAnswerTabOpened = false;
                    $scope.currentSelectedTab = 'response';

                } else if (tabName == 'notes') {
                    $scope.responseTabOpened = false;
                    $scope.notesTabOpened = true;
                    $scope.linkedAnswerTabOpened = false;
                    $scope.currentSelectedTab = 'notes';

                } else {
                    $scope.responseTabOpened = false;
                    $scope.notesTabOpened = false;
                    $scope.linkedAnswerTabOpened = true;
                    $scope.currentSelectedTab = 'linkedAnswer';
                }
                $scope.respondTabChange();
            }

            $scope.respondTabChange = function() {
                if ($scope.responseTabOpened == true) {
                    $scope.getResponseTabData();
                } else if ($scope.notesTabOpened == true) {
                    $scope.notes();
                }
            }

            $scope.closeTicket = function(ticket) {
                $state.go($state.current, {}, {
                    reload: true
                });
            }

            $scope.private_message_tab_seleceted = true;

            $scope.inputcomment = {
                "text": ""
            };
            $scope.inputprivatemessage = {
                "text": ""
            };
            $scope.inputsolution = {
                "text": ""
            };
            $scope.note = {
                "note": ""
            };

            $scope.getResponseTabData = function() {
                $scope.page_number = 1;
                $scope.next_url = "";
                if (!$scope.private_message_tab_seleceted) {
                    $scope.comment();
                } else {
                    $scope.privatemessage();
                }
                $scope.enableLoader = false;
            }

            $scope.getnextPage = function(next_page_url) {
                $scope.next_url = next_page_url.split('page=')
                if ($scope.next_url.length > 1) {
                    $scope.next_url = $scope.next_url[1].split('&')
                    if ($scope.next_url.length > 1) {
                        $scope.page_number = $scope.next_url[0]
                    } else {
                        $scope.page_number = $scope.next_url[1]
                    }
                }
            }

            $scope.comment = function(page) {
                if ($scope.refreshWithoutLoader) {
                    $scope.loading = false;
                }
                else{
                    $scope.loading = true;
                }

                if (page) {
                    $scope.page_number = page;
                }
                $scope.private_message_tab_seleceted = false;
                $('#commentTab').addClass('active');
                $('#msgTab').removeClass('active');
                if ($scope.incident_selected_ticket) {
                    var incidents_comments = incidentService.incidentcomment($scope.incident_selected_ticket.id, $scope.page_number)
                    incidents_comments.then(function(response) {
                        if ($scope.page_number == 1) {
                            $scope.incident_comment = [];
                        }
                        $scope.incident_comment.push.apply($scope.incident_comment, response.data.results)

                        if (response.data.next) {
                            $scope.getnextPage(response.data.next);
                        } else {
                            $scope.next_url = "";
                        }
                        if ($('#msgScroll')) {
                            if ($('#commentScroll')[0])
                                $('#commentScroll').animate({
                                    scrollTop: $('#commentScroll')[0].scrollHeight * response.data.count
                                }, 10);
                        }
                        $scope.loading = false;
                        $scope.refreshWithoutLoader = false;
                    });
                }
            };

            $scope.loadMoreComments = function(next_url) {
                if (next_url) {
                    $scope.comment();
                }
            }

            $scope.privatemessage = function(page) {
                if ($scope.refreshWithoutLoader) {
                    $scope.loading = false;
                }
                else{
                    $scope.loading = true;
                }

                if (page) {
                    $scope.page_number = page;
                }
                $scope.private_message_tab_seleceted = true;
                $('#msgTab').addClass('active');
                $('#commentTab').removeClass('active');
                if ($scope.incident_selected_ticket) {
                    var incidents_privatemessages = incidentService.incidentprivatemessage($scope.incident_selected_ticket.id,
                        $scope.page_number)
                    incidents_privatemessages.then(function(response) {
                        if ($scope.page_number == 1) {
                            $scope.incident_private_messages = [];
                        }
                        $scope.incident_private_messages.push.apply($scope.incident_private_messages, response.data.results)

                        if (response.data.next) {
                            $scope.getnextPage(response.data.next);
                        } else {
                            $scope.next_url = "";
                        }

                        $scope.loading = false;
                        $scope.refreshWithoutLoader = false;

                        if ($('#msgScroll').length > 0) {
                            $('#msgScroll').animate({
                                scrollTop: $('#msgScroll')[0].scrollHeight * response.data.count
                            }, 10);
                        }
                    });
                }
            };

            $scope.loadMorePrivateMessage = function(next_url) {
                if (next_url) {
                    $scope.privatemessage();
                }
            }

            $scope.loadTicketDetails = function() {
                $("#right-slider-close").click();
                $scope.messagePlaceholder = "Write Message";

                if ($scope.incident_selected_ticket != undefined) {
                    $scope.selectAccordianTab($scope.currentSelectedTab);
                    $scope.getlinkedsolutions();

                    if ($scope.incident_selected_ticket.address) {
                        /*Changing google map on selection of ticket*/
                        $scope.map = {
                            zoom: 18,
                            center: {
                                latitude: $scope.incident_selected_ticket.address.latitude,
                                longitude: $scope.incident_selected_ticket.address.longitude
                            },
                            id: $scope.incident_selected_ticket.id
                        };
                        $scope.option = {
                            scrollwheel: false
                        };
                        var get_nearby_locations = incidentService.getnearbyLocations($scope.incident_selected_ticket.id)
                        get_nearby_locations.then(function(response) {
                            $scope.nearbylocations = response.data.locations;
                        });
                    }
                }
            };

            $scope.postcomment = function() {
                if ($scope.incident_selected_ticket) {
                    var post_incidents_comments = incidentService.postincidentcomment($scope.incident_selected_ticket.id,
                        $scope.inputcomment.text)
                    post_incidents_comments.then(function(response) {
                        $scope.inputcomment.text = '';
                        $scope.updated_comment = response.data;
                        $scope.incident_comment.push($scope.updated_comment.comment);
                        $('#commentScroll').animate({
                            scrollTop: $('#commentScroll')[0].scrollHeight
                        }, 2000);
                    });
                }
            };


            $scope.postmessage = function() {
                if ($scope.incident_selected_ticket) {
                    if ($scope.incident_selected_ticket.ticket_status == 'Closed') {
                        $scope.inputprivatemessage.text = '';
                        $scope.messagePlaceholder = "Messages can't be send on closed Ticket";
                        return 0;
                    }
                    var post_incident_messages = incidentService.postprivatemessage($scope.incident_selected_ticket.id,
                        $scope.inputprivatemessage.text)
                    post_incident_messages.then(function(response) {
                        $scope.inputprivatemessage.text = '';
                        $scope.updated_message = response.data;
                        $scope.incident_private_messages.push($scope.updated_message.message);
                        if ($('#msgScroll')) {
                            $('#msgScroll').animate({
                                scrollTop: $('#msgScroll')[0].scrollHeight
                            }, 2000);
                        }
                    });
                }
            };


            $scope.notes = function() {
                if ($scope.incident_selected_ticket) {
                    var incidents_notes = incidentService.getincidentnotes($scope.incident_selected_ticket.id)
                    incidents_notes.then(function(response) {
                        $scope.incidents_note = response.data;
                    });
                }
            };


            $scope.postnote = function() {
                if ($scope.note.text) {
                    $scope.notetext = $scope.note;
                    $scope.note = {
                        text: ""
                    };
                    if ($scope.incident_selected_ticket) {
                        var post_notes = incidentService.postincidentnote($scope.incident_selected_ticket.id, $scope.notetext.text)
                        post_notes.then(function(response) {
                            $scope.post_note = response.data;
                            $scope.incidents_note.results.push($scope.post_note.note);
                        });
                    }
                }
            };


            $scope.exportmessage = function() {
                if ($scope.incident_selected_ticket) {
                    var export_messages = incidentService.exportprivatemessage($scope.incident_selected_ticket.id)
                    export_messages.then(function(response) {
                        $scope.exported_message = response.data;

                        /*for now if the message is successfully exported just giving a log message*/
                        if (response.status == 200) {
                            window.alert("Private Messages exported");
                        }
                    });
                }
            };


            $scope.getFavouriteTickets = function() {
                if ($scope.incident_selected_ticket.id){
                    var fav_tickets = incidentService.GetFavouriteTickets($scope.incident_selected_ticket.id);
                    fav_tickets.then(function(response) {
                        $scope.favourite_tickets_data = response.data.result;
                        $scope.favourite_tickets_len = response.data.length;
                    });
                }
            };


            $scope.get_ticket_url = function(id, data) {
                var ticket;
                var log = [];
                angular.forEach(data, function(value, key) {
                    if (value.id == id) {
                        ticket = value;
                        if (!$scope.private_message_tab_seleceted) {
                            $scope.inputcomment = {
                                text: "snaphelp://incident/" + ticket.id,
                            }
                            $scope.postcomment();
                        } else {
                            $scope.inputprivatemessage = {
                                text: "snaphelp://incident/" + ticket.id,
                            }
                            $scope.postmessage();
                        }
                        if($scope.$parent && $scope.incident_selected_ticket.id){
                            var success = incidentService.addLinkTicket($scope.incident_selected_ticket.id,
                                                                            ticket.id)
                            success.then(function(response) {
                                $scope.ticket_linked_iteams = response.data;
                            });
                        }
                    }
                }, log);
            };


            $scope.make_ticket_favourite = function(id, data) {
                var ticket;
                var log = [];
                angular.forEach(data, function(value, key) {
                    if (value.id == id) {
                        ticket = value
                        var success = incidentService.MakeFavouriteTickets(ticket.id)
                        success.then(function(response) {
                            if (!$scope.favourite_tickets_data) {
                                $scope.favourite_tickets_data = []
                                $scope.favourite_tickets_len = 0
                            }
                            if (response.data.msg == "Ticket Removed from Favourites.") {
                                $scope.favourite_tickets_data.splice(ticket, 1);
                            } else {
                                $scope.favourite_tickets_data.push(ticket);
                                $scope.favourite_tickets_len = $scope.favourite_tickets_len + 1;
                            }
                        });
                    }
                }, log);

                if ($('#sim-inc-' + id).hasClass('linkImg-empty-star') == true) {
                    $('#sim-inc-' + id).removeClass('linkImg-empty-star');
                    $('#sim-inc-' + id).addClass('linkImg-fill-star');
                } else if ($('#sim-inc-' + id).hasClass('linkImg-fill-star') == true) {
                    $('#sim-inc-' + id).removeClass('linkImg-fill-star');
                    $('#sim-inc-' + id).addClass('linkImg-empty-star');
                }
            };


            $scope.ticket_favourite = function(id) {

                var success = incidentService.MakeFavouriteTickets(id)
                success.then(function(response) {
                    $scope.make_ticket_favourite();
                });

                if ($('.wipSocial li span').hasClass('empty-star') == true) {
                    $('.wipSocial li span').removeClass('empty-star');
                    $('.wipSocial li span').addClass('fill-star');
                } else if ($('.wipSocial li span').hasClass('fill-star') == true) {
                    $('.wipSocial li span').removeClass('fill-star');
                    $('.wipSocial li span').addClass('empty-star');
                }
            };


            $scope.getSimilarSolutions = function() {
                if ($scope.incident_selected_ticket) {
                    var sim_solutions = incidentService.GetSimilarSolutions(encode(($scope.incident_selected_ticket.id).toString()))
                    sim_solutions.then(function(response) {
                        $scope.similar_solutions_data = response.data.result;
                        $scope.similar_solutions_len = response.data.length;
                    });
                }
            };


            $scope.GetSimilarTickets = function() {
                if ($scope.incident_selected_ticket) {
                    var sim_tickets = incidentService.GetSimilarTickets($scope.incident_selected_ticket.id)
                    sim_tickets.then(function(response) {
                        $scope.similar_tickets_data = response.data.result;
                        $scope.similar_tickets_len = response.data.length;
                    });
                }
            };

            $scope.exportcomments = function() {
                if ($scope.incident_selected_ticket) {
                    var export_comments = incidentService.exportcomment($scope.incident_selected_ticket.id)
                    export_comments.then(function(response) {
                        $scope.export_comment = response.data;

                        /*for now if the comments is successfully exported just giving a log message*/
                        if (response.status == 200) {
                            window.alert("Public Messages exported");
                        }
                    });
                }
            };

            $scope.openAssetDetail = function(size, commentObj) {

                $scope.items = commentObj
                var modalInstance = $uibModal.open({
                    templateUrl: '/static/common/directives/assets-directive/assets-dialog.html',
                    controller: 'AssetsMgmtCtrl',
                    size: size,
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });
            };

            $scope.openCloseModal = function(size) {

                $scope.items = $scope.incident_selected_ticket;
                var closeModalInstance = $uibModal.open({
                    templateUrl: '/static/common/directives/close-ticket-directive/close-ticket.html',
                    controller: 'CloseTicketCtrl',
                    size: size,
                    resolve: {
                        items: function() {
                            return $scope.items;
                        }
                    }
                });

                closeModalInstance.result.then(function(selectedItem) {
                    $scope.ticketSolution = selectedItem;
                    if ($scope.ticketSolution && $scope.ticketSolution.inputsolution) {
                        var ticket_tags = ""
                        for (var i = 0; i < $scope.ticketSolution.tags.length; i++) {
                            if (i != 0)
                                ticket_tags += ','
                            ticket_tags += $scope.ticketSolution.tags[i]['text'].toString()
                        }
                        if (ticket_tags == "")
                            ticket_tags = $scope.incident_selected_ticket.tags
                        if ($scope.incident_selected_ticket) {
                            var post_incidents_solution = incidentService.postincidentsolution(
                                $scope.incident_selected_ticket.id,
                                $scope.ticketSolution.inputsolution,
                                ticket_tags,
                                $scope.ticketSolution.sub_status)
                            post_incidents_solution.then(function(response) {
                                $('.close').click();
                                $scope.closeTicket($scope.incident_selected_ticket);
                            });
                        }
                    }
                });
            };


            $scope.getlinkedsolutions = function() {
                if ($scope.incident_selected_ticket.id) {
                    var linked_solution = incidentService.getlinksolution($scope.incident_selected_ticket.id)
                    linked_solution.then(function(response) {
                        $scope.ticket_linked_iteams = response.data[0];

                    });
                }
            };


            $scope.linkToggle = function(solution) {
                if ($('#sim-sol-' + solution.id).hasClass('linkImg-empty-link') == true) {
                    $('#sim-sol-' + solution.id).removeClass('linkImg-empty-link');
                    $('#sim-sol-' + solution.id).addClass('linkImg-fill-link');
                } else if ($('#sim-sol-' + solution.id).hasClass('linkImg-fill-link') == true) {
                    $('#sim-sol-' + solution.id).removeClass('linkImg-fill-link');
                    $('#sim-sol-' + solution.id).addClass('linkImg-empty-link');
                }
            };


            $scope.link_solution = function(solution) {
                if ($scope.incident_selected_ticket.id) {
                    var success = incidentService.addLinkSolution($scope.incident_selected_ticket.id,
                        solution.id)
                    success.then(function(response) {
                        $scope.ticket_linked_iteams = response.data;
                    });
                    $scope.linkToggle(solution);
                }

                if (!$scope.private_message_tab_seleceted) {
                    $scope.inputcomment = {
                        text: "Hey, can you please try this:<br/>" + solution.solution,
                    }
                    $scope.postcomment();
                } else {
                    $scope.inputprivatemessage = {
                        text: "Hey, can you please try this:<br/>" + solution.solution,
                    }
                    $scope.postmessage();
                }
            };


            $scope.remove_link_solution = function(solution) {
                if ($scope.incident_selected_ticket) {
                    var success = incidentService.removeLinkSolution($scope.incident_selected_ticket.id,
                        solution.id)
                    success.then(function(response) {
                        $scope.removesolution(solution);
                    });
                    $scope.linkToggle(solution);
                }
            };

            $scope.findSolutionInLinks = function(solution) {

                if ($scope.linkedsolutions) {
                    for (var i = 0; i < $scope.linkedsolutions.length; i++) {
                        if ($scope.linkedsolutions[i].id == solution.id)
                            return true;
                    }
                }
                return false;
            };

            $scope.removesolution = function(solution) {

                for (var i = 0; i < $scope.linkedsolutions.length; i++) {
                    if ($scope.linkedsolutions[i].id == solution.id)
                        $scope.linkedsolutions.splice(i, 1);
                }
                return false;
            }

            $scope.searchNearbyLocation = function() {
                if ($scope.nearbysearch.string && $scope.nearbysearch.string != $scope.locationsearchString) {
                    $scope.nearbyloader = true
                    if ($scope.incident_selected_ticket) {
                        var search_nearby_locations = incidentService.searchnearbyLocations($scope.incident_selected_ticket.id, $scope.nearbysearch.string)
                        search_nearby_locations.then(function(response) {
                            $scope.searchnearbylocations = response.data.locations;
                            $scope.nearbyloader = false
                        });
                        $scope.locationsearchString = $scope.nearbysearch.string
                    }
                }
            };

            $scope.sendOffer = function(offerId) {
                if ($scope.incident_selected_ticket) {
                    var success = incidentService.sendOffer($scope.incident_selected_ticket.id,
                        offerId)
                    success.then(function(response) {
                        var offerId = '1'
                        $('#sendoffer' + offerId).addClass('giftactive');
                    });
                }
            }

            $scope.start_video_chat = function() {
                $sessionStorage.call_connected = true;
                start_video($scope.incident_selected_ticket.id, $sessionStorage.access_token, $scope.personal_info);
            }

            $scope.stop_video_chat = function() {
                if ($sessionStorage.incoming_call) {
                    $sessionStorage.incoming_call = false;
                    $sessionStorage.call_details = "";
                }
                $sessionStorage.call_connected = false;
                stop_video();
            }

            $rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
                stop_video();
                $sessionStorage.call_connected = false;
            })

            $scope.loadChatMessages = function(){
                $timeout(function() {
                if ($scope.responseTabOpened == true) {
                    $scope.refreshWithoutLoader = true;
                    $scope.getResponseTabData();
                }
                  $scope.loadChatMessages();
                }, 10000)
            };

            $scope.loadChatMessages();

        }
    ]);
