// controller.js

angular.module('dashboard.controller', ['dashoboard.services'])
    .controller('dashboardCtrl', ['$scope', '$sessionStorage', '$state', '$rootScope', 'dashService',
        function($scope, $sessionStorage, $state, $rootScope, dashService) {
            $scope.personal_info = $sessionStorage.personal_info;
            $scope.helpers = audetemiHelper.helpers;

            var agents_products = dashService.get_my_products();
            agents_products.then(function(response) {
                $rootScope.agent_assigned_tickets = response.data;
                $rootScope.agent_assigned_tickets_count = response.data.length;
                $scope.agent_assigned_products = response.data;
            });

            var top_tickets = dashService.getTopTicket();
            top_tickets.then(function(response) {
                $scope.agent_top_tickets = response.data;
            });

            $scope.get_top_influncers = function(product) {
                if (product) {
                    var top_influencers = dashService.getTopInfluencers(product);
                    top_influencers.then(function(response) {
                        $scope.top_user_influencers = response.data.result;
                        $scope.product_name = response.data.product_name
                    });
                }
            }

            $scope.openIncidentAvailaibility = function(ticket) {
                $scope.$parent.selectTab('availIncident');
                var passedTicket = angular.toJson({
                    "ticket": ticket
                });
                $state.go('header.leftnav.availIncident', {
                    ticket: ticket
                });
            }

            var top_ten_products = dashService.getSupportRating();
            top_ten_products.then(function(response) {
                $scope.data = response.data.result;
                $scope.xaxis_value = response.data.xaxis_value;
                $scope.yaxis_value = response.data.yaxis_value;
                $scope.selected_product_id = response.data.top_product_id;

                $scope.handleSelect = function(selection) {
                    if (selection.selectedItem) {
                        $scope.selected_row = selection.selectedItem.row
                        $scope.product_id = $scope.chartObject.data.rows[$scope.selected_row].c[4].id
                        if ($scope.selected_product_id != $scope.product_id) {
                            $scope.selected_product_id = $scope.product_id
                            $scope.get_top_influncers($scope.product_id)
                        }
                    }
                };

                $scope.chartObject = {};
                $scope.chartObject.type = "BubbleChart";
                $scope.chartObject.displayed = true;
                $scope.chartObject.data = {
                    "cols": [{
                        "id": "Agent",
                        "label": "Month",
                        "type": "string",
                        "p": {}
                    }, {
                        "id": "issue-reolved",
                        "label": "Incident Reported",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "avg-heat-index",
                        "label": "Incident Resolved",
                        "type": "number",
                        "p": {}
                    }, {
                        "id": "",
                        "label": "",
                        "type": "number",
                        "p": {}
                    }],
                    "rows": $scope.data
                };
                $scope.chartObject.options = {
                    "chartArea": {
                        top: 10,
                        bottom: 0,
                        width: '82%',
                        height: '85%'
                    },
                    "isStacked": "false",
                    "height": 280,
                    "fill": 1,
                    "displayExactValues": true,
                    "colorAxis": {
                        minValue: 0,
                        colors: ['#ff0000', '#ff5300', '#ff8900', '#ffb800', '#ffd600', '#ffe800', '#beee07', '#8edc0c', '#58ce34', '#22ac19']
                    },
                    "vAxis": {
                        "title": "Support Level",
                        "minValue": 0,
                        "maxValue": $scope.yaxis_value,
                        "viewWindowMode": "pretty",
                        "gridlines": {
                            "count": 5
                        },
                        "gridlines.color": "#D3D3D3"
                    },

                    "hAxis": {
                        "title": "No. Of Incidents Reported",
                        "maxValue": $scope.xaxis_value,
                        "gridlines": {
                            "count": 4
                        },
                        "gridlines.color": "#D3D3D3"
                    },
                };
                $scope.chartObject.formatters = {};
                $scope.get_top_influncers($scope.selected_product_id);
            });
        }
    ]);

google.load('visualization', '1', {
    packages: ['corechart']
});
