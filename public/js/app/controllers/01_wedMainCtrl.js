define(['angular'], function (angular) {
    "use strict";
    var wedControllers = angular.module('wedControllers', ['wedServices', 'authServices']);

    wedControllers.controller('wedMainCtrl', wedMainCtrl);
    wedControllers.controller('wedProjectsMainCtrl', wedProjectsMainCtrl);


    /*
     * APP MAIN CTRL
     * */
    function wedMainCtrl($scope, $rootScope, $log, $location, $timeout, toastr, ResourceService, UsersResourceService) {
        // Default Values
        $scope.currentUser = {};
        $scope.currentProject = {};
        $scope.projects = [];
        $scope.currentProjectView = {};
        $scope.toDay = new Date;
        $location.path('/start');
        $scope.dynamicBackground = "start_main";
        $scope.newSMS = {};

        // Version
        $scope.version = '0.5.2';
        $scope.versionStatus = 'betta';

        // Exit to START PAGE
        $scope.exitToStart = function () {
            $location.path('/start');
            $scope.dynamicBackground = "start_main";
        };

        // Exit to Home Page
        $scope.goToHomePage = function () {
            if ($scope.currentUser.isAuth) {
                $location.path('/index');
                $scope.dynamicBackground = "projects_main";
                $scope.decorNames = false;
                $scope.$emit('projectsListChange');
                //updateProjectsList();
                $scope.currentProjectView.mainMenu = null;
            } else {
                $scope.exitToStart();
            }
        };

        // LOGOUT Fn
        $scope.logOut = function () {

            $scope.$broadcast('logout');// subscriber -> wedUsersMainCtrl

            $timeout(function () {
                $scope.currentUser = {};
                $scope.currentProject = {};
                $scope.projects = [];
                $scope.currentProjectView = {};
            }, 200);
        };

        // ON-EVENT: 'LOGGED IN' Subscribe - *MAIN INIT DATA EVENT*
        $scope.$on('LoggedIn', function (event, data) {
            $scope.currentUser = data;

            // If USER is Authorized
            if ($scope.currentUser.isLogged && $scope.currentUser.isAuth) {
                $timeout(function () {

                    // Get USER Projects list Fn*
                    function updateProjectsList() {
                        var request = {id: $scope.currentUser._id};

                        ResourceService._ajaxRequest("POST", null, request, '/getProjects').then(function (projects) {
                            // Define USER PROJECTS COLLECTION
                            $scope.projects = projects;

                            // NEXT - Define IF NEW SMS
                            angular.forEach($scope.projects, function (project) {

                                angular.forEach($scope.currentUser.smsQty, function (userProjectSMS) {

                                    if (userProjectSMS.projectId == project._id) {
                                        var start = userProjectSMS.qty;
                                        var end = project.smsCollection.length;

                                        if (start < end) {
                                            $scope.newSMS[project._id] = end - start;
                                        }
                                        if (start > end) {
                                            $scope.newSMS[project._id] = 0;
                                            userProjectSMS.qty = end;

                                            var smsUpdate = {
                                                _id: $scope.currentUser._id,
                                                arr: $scope.currentUser.smsQty
                                            };
                                            UsersResourceService._ajaxRequest("PUT", null, smsUpdate, '/smsQty').catch(function (err) {
                                                toastr.error('USER SMS QTY AJAX FAILED!');
                                                $log.error('USER SMS QTY AJAX FAILED!', err);
                                            });
                                        }
                                        if (start == end) {
                                            $scope.newSMS[project._id] = 0;
                                        }
                                    }
                                });
                            });

                        }).catch(function (err) {
                            toastr.error("ERROR: PRO LIST LOAD AJAX failed");
                            $log.warn("ERROR: PRO LIST LOAD AJAX failed", err);
                        });
                    }

                    // ON-EVENT: PROJECT INIT DATA CHANGED <- editProjectCtrl <- [editProjectApply(), deleteProject()]
                    $scope.$on('projectsListChange', function (e) {
                        updateProjectsList();
                    });

                    // Edit project init
                    $scope.editProject = function (id) {
                        $rootScope.$broadcast('editProject', {
                            id: id
                        });
                    };

                    // Go and Load selected Project
                    $scope.goToSelectedProject = function (id, archive) {
                        ResourceService._ajaxRequest("GET", id, null, null).then(function (project) {
                            if (archive) {
                                $timeout(function () {
                                    $scope.currentProject = project;
                                    $location.path('/project');
                                    $scope.decorNames = true;
                                    $scope.currentProjectView.mainMenu = "budget";
                                }, 500);
                            } else {
                                $scope.currentProject = project;
                                $location.path('/project');
                                $scope.decorNames = true;
                                $scope.currentProjectView.mainMenu = "budget"; // budget
                            }
                        });
                    };

                }, 300);
            } else {
                $location.path('/start');
            }
        });

        // ON-EVENT: 'ACCESS APPROVED'
        $scope.$on('AccessApproved', function (event, data) {
            $timeout(function () {
                $scope.currentUser.visitor = true;
                $scope.decorNames = true;
                $scope.currentProject = data;
                $location.path('/project');
                $scope.dynamicBackground = "projects_main";
            }, 200);

        });

        // ON-EVENT: 'SMS QTY' <- editProjectCtrl / deleteProject
        $scope.$on('smsQty', function (e, data) {
            // IF ADD New sms
            if (angular.isNumber(data.qty)) {

                $scope.currentUser.smsQty.push(data);

                var requestAdd = {
                    _id: $scope.currentUser._id,
                    arr: $scope.currentUser.smsQty
                };

                UsersResourceService._ajaxRequest("PUT", null, requestAdd, '/smsQty').catch(function (err) {
                    toastr.error('USER SMS QTY AJAX FAILED!');
                    $log.error('USER SMS QTY AJAX FAILED!', err);
                });
            }

            // IF DELETE sms
            if (data.qty == 'remove') {

                angular.forEach($scope.currentUser.smsQty, function (project, index, parentArr) {
                    if (project.projectId == data.projectId) {
                        parentArr.splice(index, 1);
                    }
                });

                var requestDel = {
                    _id: $scope.currentUser._id,
                    arr: $scope.currentUser.smsQty
                };

                UsersResourceService._ajaxRequest("PUT", null, requestDel, '/smsQty').catch(function (err) {
                    toastr.error('USER SMS QTY AJAX FAILED!');
                    $log.error('USER SMS QTY AJAX FAILED!', err);
                });
            }

        });

        // Project LEFT MENU navigation
        $scope.projectView = function (view) {
            switch (view) {

                case "budget" :
                    $scope.currentProjectView.mainMenu = view;
                    $timeout(function () {
                        $scope.$broadcast('doBudgetReCalculation');
                    },500);
                    break;

                case "restaurant" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "arrangement" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "program" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "filming" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "registration" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "marriage" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "transport" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "dress" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "party" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "other" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
            }
        };

    }// Ctrl end


    /*
     * PROJECTS MAIN CTRL
     * */
    function wedProjectsMainCtrl($scope) {
        // If USER is Authorized
        if ($scope.currentUser.isAuth) {
            // Filter for shift expired dated projects to Archive
            $scope.projectListDateCheck = function (project) {
                return new Date(project.weddingDate).setHours(23, 59, 0) > Date.now();
            };
        }
    }// Ctrl end


    return wedControllers;
});