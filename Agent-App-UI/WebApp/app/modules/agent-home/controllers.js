angular.module('agenthome.controller', ['agenthome.services'])
    .controller('agentHomeCtrl', ['$scope', '$sessionStorage', '$state', '$http', 'agentHomeService',
        function($scope, $sessionStorage, $state, $http, agentHomeService) {
            $scope.personal_info = $sessionStorage.personal_info;
            $scope.getGraphData = getGraphData;
            $scope.updateGraphData = updateGraphData

            var siteList = agentHomeService.getSiteDetails();
            siteList.then(function(response) {
                $scope.activeData = response.data.active_data;
                $scope.inactiveData = response.data.inactive_data;
                $scope.proposedData = response.data.proposed_data;
            });

            function getGraphData(id) {
                var graphData = agentHomeService.getGraphData(id);
                graphData.then(function(response) {
                    $scope.minWiseData = response.data.instantaneous_yaxis;
                    $scope.quaterWiseData = response.data.interval_yaxis;
                    $scope.minWiseLabel = response.data.instantaneous_xaxis;
                    $scope.quaterWiseLabel = response.data.interval_xaxis;
                });
            }


              $scope.series1 = ['Instantaneous Graph'];
              $scope.series2 = ['Interval Graph'];

              $scope.onClick = function (points, evt) {
                console.log(points, evt);
              };

              function updateGraphData() {
                $scope.data = $scope.data2
              }

              $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
              $scope.options = {
                scales: {
                  yAxes: [
                    {
                      id: 'y-axis-1',
                      type: 'linear',
                      display: true,
                      position: 'left'
                    }
                  ]
                }
              };
        }
    ]);
