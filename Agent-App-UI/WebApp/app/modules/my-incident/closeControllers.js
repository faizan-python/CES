'use strict';

angular.module('CloseTicket.controller', ['ngTagsInput'])
    .controller('CloseTicketCtrl', ['$scope',
        '$uibModalInstance',
        '$timeout',
        'items',
        function($scope, $uibModalInstance, $timeout, items) {
            $scope.item = items;
            $scope.isBlank = false;
            $scope.message = "";

            $scope.selected = {
                'tags': []
            }

            $scope.sub_status = [
                "Towing Assigned",
                "15 Day Customer Not-Satisfied",
                "15 Day Customer Satisfied",
                "15 Day Not Reachable",
                "AMC-Genuine",
                "AMC-Non Genuine",
                "ASP Assigned",
                "ASP Reached",
                "ASP reached - A To D",
                "ASP reached - RBD",
                "Already Given Feedback",
                "Assigned To CCA",
                "Assigned To Dealer",
                "Assigned to TFM  IT Support",
                "Assigned to TFM Business",
                "Beeping",
                "Booking Cancelled",
                "Booking Request",
                "CVBU AMC 3 day Calling",
                "Call Again",
                "Call Disconnected",
                "Call Transferred",
                "Car Overage(TMI)",
                "Car Sold(TMI)",
                "Car Stolen(TMI)",
                "Cell Switched Off",
                "Concerned Person not Available",
                "Contact Number Not Updated",
                "Cust will get back to dealer f",
                "Customer Details Absent",
                "Customer Not-Satisfied",
                "Customer Rejected",
                "Customer Satisfied",
                "Customer arranged own towing",
                "Customer is dead",
                "Dealer Contacted Customer",
                "Dealer Not Contacted Customer",
                "Delivery Pending",
                "Details Captured",
                "Different Owner",
                "Do Not Disturb(TMI)",
                "Driven to Dealer",
                "Duplicate Number",
                "Engaged",
                "Feedback after Test Drive",
                "Finance",
                "GF Created",
                "IVR",
                "Incoming Barred",
                "Incorrect Number",
                "Information Given",
                "Interested",
                "Language barrier",
                "Lost To Co-Dealer",
                "Lost To Competitor",
                "Lost To Tata",
                "Meter started but no response",
                "NA - Fleet Customer",
                "NDNC",
                "Non Genuine",
                "Not Eligible (TMI)",
                "Not Interested",
                "Not Reachable",
                "Number does not exist",
                "ONLINE",
                "Other",
                "Others",
                "Partially Updated",
                "Pending for 15 Day PSF",
                "Pending for EBD PSF",
                "Pending for JOB Card Number",
                "Personal",
                "Plan Postponed",
                "Policy Taken From Other(TMI)",
                "Policy Taken From TMI",
                "Price Quote Requested",
                "Price Quote Sent",
                "Provided Another Number(TMI)",
                "Reminder Given",
                "Renewal Done",
                "Renewal Expiry Date Wrong(TMI)",
                "Resolved By CCA",
                "Resolved By Dealer",
                "Resolved by ASP",
                "Retailed",
                "Ringing",
                "Service App",
                "TD Completed",
                "TD Requested",
                "TD Schedule",
                "Towed to Dealer",
                "Towing Assigned – Customer Rej",
                "Towing Assigned – Self Tow",
                "Towing Reached",
                "Towing Reached – Customer Rej",
                "Towing Required",
                "Unassigned",
                "Vehicle - Not Satisfied",
                "Vehicle Booked",
                "Vehicle Sold",
                "Vehicle driven to dealer",
                "Vehicle not Serviced",
                "Vehicle still in Workshop",
                "Verification Failed",
                "Voice mail",
                "Waiting for Delivery",
                "Wrong Data",
                "Wrong Number",
                "Wrong registration number"
                ]

            if ($scope.item.tags){
                for (var i=0; i<$scope.item.tags.split(',').length; i++){
                    var data = {}
                    data['text']=$scope.item.tags.split(',')[i]
                    $scope.selected.tags.push(data)
                }
            }

            $scope.cancel = function () {
              $uibModalInstance.close();
            };

            $scope.submit = function () {
                if(!$scope.selected.inputsolution){
                    $scope.isBlank = true;
                    $scope.message = "Please provide a valid Solution to close the Incident.";
                }else if(!$scope.selected.sub_status){
                    $scope.isBlank = true;
                    $scope.message = "Please select sub status.";
                }else{
                    $uibModalInstance.close($scope.selected);
                }
                $timeout(function() {
                    $scope.isBlank = false;
                }, 3000);
            };
        }
    ]);
