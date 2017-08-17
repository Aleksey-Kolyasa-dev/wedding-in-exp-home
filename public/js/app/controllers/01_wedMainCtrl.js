define(['angular'], function (angular) {
    "use strict";
    var wedControllers = angular.module('wedControllers', ['wedServices', 'authServices']);

    wedControllers.controller('wedMainCtrl', wedMainCtrl);
    wedControllers.controller('wedProjectsMainCtrl', wedProjectsMainCtrl);


    /*
     * APP MAIN CTRL
     * */
    function wedMainCtrl($scope, $rootScope, $log, $window, $location, $timeout, toastr, _env, ResourceService, AppService, UsersResourceService) {
        // Default Values
        $scope.currentUser = {};
        $scope.currentProject = {};
        $scope.projects = [];
        $scope.currentProjectView = {};
        $scope.toDay = new Date;
        $location.path('/start');
        $scope.dynamicBackground = "start_main";
        $scope.newSMS = 0;

       /* function newSmsCheck() {
            if($window.localStorage && $window.localStorage.newSMS || $window.localStorage.newSMS === 0){
                $scope.newSMS = $window.localStorage.newSMS;
                $log.log($scope.newSMS);
            }
        }*/


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


        /*$scope.$on('smsCheckedByUser', function () {
            newSmsCheck();
        });*/

        // EVENT 'LOGGED IN' Subscribe
        $scope.$on('LoggedIn', function (e, data) {
            $scope.currentUser = data;

            // If USER is Authorized
            if($scope.currentUser.isLogged && $scope.currentUser.isAuth /*|| $scope.currentUser.visitor*/){
                $timeout(function () {
                    /*$location.path('/index');
                    $scope.dynamicBackground = 'projects_main';*/

                    // Get USER Projects list*
                    function updateProjectsList() {
                        var request = { id : $scope.currentUser._id };
                        //newSmsCheck();
                        ResourceService._ajaxRequest("POST", null, request, '/getProjects').then(function (projects) {
                           // Define USER PROJECTS COLLECTION
                            $scope.projects = projects;

                            // NEXT - Define IF NEW SMS
                            angular.forEach($scope.projects, function (project) {

                                angular.forEach($scope.currentUser.smsQty, function (userProjectSMS) {

                                    if(userProjectSMS.projectId == project._id/* && $window.localStorage*/){
                                        var start = userProjectSMS.qty;
                                        var end = project.smsCollection.length;

                                        if(start < end){
                                             $scope.newSMS = end - start;
                                             //$window.localStorage.newSMS = end - start;
                                         }
                                         if(start > end){
                                             $scope.newSMS = 0;
                                             //$window.localStorage.newSMS = 0;
                                             userProjectSMS.qty = end;
                                             var smsUpdate = {
                                                 _id : $scope.currentUser._id,
                                                 arr : $scope.currentUser.smsQty
                                             };
                                             UsersResourceService._ajaxRequest("PUT", null, smsUpdate, '/smsQty');
                                         }
                                        if(start == end){
                                            $scope.newSMS = 0;
                                            //$window.localStorage.newSMS = 0;
                                        }
                                    }
                                });
                            });

                            /*function doUserSmsQtyUpdate() {

                            }*/

                        }).catch(function (err) {
                            toastr.error("ERROR: PRO LIST LOAD AJAX failed");
                            $log.warn("ERROR: PRO LIST LOAD AJAX failed", err);
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
                        $scope.decorNames = false;
                        updateProjectsList();
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
                                        $scope.decorNames = true;
                                        //** $scope.currentProjectView.mainMenu = "budget";
                                        $scope.currentProjectView.mainMenu = "budget";
                                    }, 500);
                                } else {
                                    $scope.currentProject = project;
                                    $location.path('/project');
                                    $scope.decorNames = true;
                                    //** $scope.currentProjectView.mainMenu = "budget";
                                    $scope.currentProjectView.mainMenu = "budget";
                                }
                            });
                        };

                }, 300);
            } else {
             $location.path('/start');
            }
        });

        // EVENT 'ACCESS APPROVED' Subscribe
        $scope.$on('AccessApproved', function (e, data) {
            $timeout(function () {
                $scope.currentUser.visitor = true;
                $scope.decorNames = true;
                $scope.currentProject = data;
                $location.path('/project');
                $scope.dynamicBackground = "projects_main";
            },200);

        });

        // SMS QTY EVENT
        $scope.$on('smsQty', function (e, data) {
            if(angular.isNumber(data.qty)){
                $scope.currentUser.smsQty.push(data);
                var requestAdd = {
                    _id : $scope.currentUser._id,
                    arr : $scope.currentUser.smsQty
                };
                UsersResourceService._ajaxRequest("PUT", null, requestAdd, '/smsQty');
            }
            if(data.qty == 'remove'){
                angular.forEach($scope.currentUser.smsQty, function (project, index, parentArr) {
                    if(project.projectId == data.projectId){
                        parentArr.splice(index, 1);
                    }
                });
            }
            var requestDel= {
                _id : $scope.currentUser._id,
                arr : $scope.currentUser.smsQty
            };
            UsersResourceService._ajaxRequest("PUT", null, requestDel, '/smsQty');
        });

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
                            $log.error("ERROR: GET init data failed", err);
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
            } else { $location.path('/start');}

      /*  });*/

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
        }
    }// Ctrl end


    return wedControllers;
});