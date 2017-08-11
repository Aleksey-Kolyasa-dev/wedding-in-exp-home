define(['angular'], function (angular) {
    "use strict";
    var wedControllers = angular.module('wedControllers', ['wedServices']);

    wedControllers.controller('wedMainCtrl', wedMainCtrl);

    function wedMainCtrl($scope, $rootScope, $log, $location, $timeout, toastr, _env, ResourceService, AppService) {
        // Default Values
        $scope.currentProject = {};
        $scope.projects = [];
        $scope.currentProjectView = {};
        $scope.toDay = new Date;
        $location.path('/index');
        $scope.dynamicBackground = "main";

        // Projects list update fn
        function updateProjectsList() {
            ResourceService._ajaxRequest("GET", null, null).then(function (projects) {
                $scope.projects = projects;
            }).catch(function (err) {
                toastr.error("ERROR: GET init data failed");
                $log.warn("ERROR: GET init data failed", err);
            });
        }
        updateProjectsList();

        // Events handler
        $scope.$on('projectsListChange', function () {
            updateProjectsList();
        });

        // Filter for shift expired dated projects to Archive
        $scope.projectListDateCheck = function (project) {
            return new Date(project.weddingDate).setHours(23, 59, 0) > Date.now();
        };

        // Exit to Home Page
        $scope.goToHomePage = function () {
            $location.path('/index');
            //$scope.currentProject = {};
            $scope.currentProjectView.mainMenu = null;
        };

        // Edit project init
        $scope.editProject = function (id) {
            $rootScope.$broadcast('editProject', {
                id : id
            });
        };

        // Go and Load selected Project
        $scope.goToSelectedProject = function (id, archive) {
            ResourceService._ajaxRequest("GET", id, null).then(function (project) {
                if (archive) {
                    $timeout(function () {
                        $scope.currentProject = project;
                        $location.path('/project');
                        //** $scope.currentProjectView.mainMenu = "budget";
                        $scope.currentProjectView.mainMenu = "budget";
                    }, 500);
                } else {
                    $scope.currentProject = project;
                    $location.path('/project');
                    //** $scope.currentProjectView.mainMenu = "budget";
                    $scope.currentProjectView.mainMenu = "flower";
                }
            });
        };

        // Project Left Menu navigation
        $scope.projectView = function (view) {
            switch (view) {
                case "budget" :
                    $scope.currentProjectView.mainMenu = view;
                    $scope.$broadcast('doBudgetReCalculation');
                    break;
                case "restaurant" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
                case "decor" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
                case "flower" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
            }
        };

    }// Ctrl end

    return wedControllers;
});