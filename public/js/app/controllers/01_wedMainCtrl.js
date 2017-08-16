define(['angular'], function (angular) {
    "use strict";
    var wedControllers = angular.module('wedControllers', ['wedServices']);

    wedControllers.controller('wedMainCtrl', wedMainCtrl);
    wedControllers.controller('wedProjectsMainCtrl', wedProjectsMainCtrl);


    /*
     * APP MAIN CTRL
     * */
    function wedMainCtrl($scope, $rootScope, $log, $window, $location, $timeout, toastr, _env, ResourceService, AppService) {
        // Default Values
        $scope.currentUser = {};
        $scope.currentProject = {};
        $scope.projects = [];
        $scope.currentProjectView = {};
        $scope.toDay = new Date;
        $location.path('/start');
        $scope.dynamicBackground = "start_main";

        // Exit to START PAGE
        $scope.exitToStart = function () {
            $location.path('/start');
            $scope.dynamicBackground = "start_main";
        };

        // LOGOUT Fn
        $scope.logOut = function () {
            $scope.$broadcast('logout');

            $timeout(function () {
                $scope.currentUser = {};
                $scope.currentProject = {};
                $scope.projects = [];
                $scope.currentProjectView = {};
            }, 200);
        };

        // EVENT 'LOGGED IN' Subscribe
        $scope.$on('LoggedIn', function (e, data) {
            $scope.currentUser = data;

            // If USER is Authorized
            if($scope.currentUser.isLogged && $scope.currentUser.isAuth){
                $timeout(function () {
                    /*$location.path('/index');
                    $scope.dynamicBackground = 'projects_main';*/

                    // Get USER Projects list
                    function updateProjectsList() {
                        var request = { id : $scope.currentUser._id };

                        ResourceService._ajaxRequest("POST", null, request, '/getProjects').then(function (projects) {
                            $scope.projects = projects;
                        }).catch(function (err) {
                            toastr.error("ERROR: GET init data failed");
                            $log.warn("ERROR: GET init data failed", err);
                        });
                    }
                    // Get USER Projects list on-load
                    updateProjectsList();

                    // Events handler
                    $scope.$on('projectsListChange', function () {
                        updateProjectsList();
                    });

                    // Exit to Home Page
                    $scope.goToHomePage = function () {
                        $location.path('/index');
                        $scope.dynamicBackground = "projects_main";
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
                                    $scope.currentProjectView.mainMenu = "budget";
                                }
                            });
                        };
                }, 300);
            } else
            { $location.path('/404');}
        });

    }// Ctrl end

    /*
     * PROJECTS MAIN CTRL
     * */
    function wedProjectsMainCtrl($scope, $rootScope, $log, $location, $timeout, toastr, _env, ResourceService, AppService) {
        // If USER is Authorized
        if($scope.currentUser.isAuth) {
            // Filter for shift expired dated projects to Archive
            $scope.projectListDateCheck = function (project) {
                return new Date(project.weddingDate).setHours(23, 59, 0) > Date.now();
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
                    case "leader" :
                        $scope.currentProjectView.mainMenu = view;
                        break;
                    case "music" :
                        $scope.currentProjectView.mainMenu = view;
                        break;
                    case "photo" :
                        $scope.currentProjectView.mainMenu = view;
                        break;
                    case "video" :
                        $scope.currentProjectView.mainMenu = view;
                        break;
                    case "zags" :
                        $scope.currentProjectView.mainMenu = view;
                        break;
                    case "transport" :
                        $scope.currentProjectView.mainMenu = view;
                        break;
                }
            };
        }
    }// Ctrl end


    return wedControllers;
});