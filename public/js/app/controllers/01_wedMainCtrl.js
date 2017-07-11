define(['angular'], function (angular) {
    "use strict";
    var wedControllers = angular.module('wedControllers', ['wedServices']);

    wedControllers.controller('wedMainCtrl', function ($scope, $log, $location, $timeout, toastr, ResourceService, AppService) {
        // Default Values
        $scope.currentProject = {};
        $scope.projects = [];
        $scope.newProject = {};
        $scope.toDay = new Date;
        $location.path('/index');
        $scope.dynamicBackground = "main";

        // Projects list update fn
        function updateProjectsList() {
            ResourceService._ajaxRequest("GET", null, null).then(function (projects) {
                $scope.projects = projects;
            });
        }
        updateProjectsList();

        // New Project Fn
        $scope.createNewProject = function () {
            $scope.newProject.weddingDate = AppService._dateStringToObject($scope.newProject.weddingDate);
            $scope.newProject.fianceSideGuests = [];
            $scope.newProject.fianceeSideGuests = [];

            ResourceService._ajaxRequest("POST", null, $scope.newProject)
                .then(function (project) {
                    $scope.currentProject = project;
                    $scope.newProject = {};
                    updateProjectsList();
                    toastr.success("НОВЫЙ ПРОЕКТ СВАДЬБЫ " + $scope.currentProject.fianceName + " и " + $scope.currentProject.fianceeName + " СОЗДАН УСПЕШНО!");
                })
                .catch(function (err) {
                    toastr.error("ERROR: Create New Project ops failed");
                    $log.warn("ERROR: Create New Project ops failed", err);
                });
        };

        // Filter for shift expired dated projects to Archive
        $scope.projectListDateCheck = function (project) {
            return new Date(project.weddingDate).setHours(23, 59, 0) > Date.now();
        };

        // Exit to Home Page
        $scope.goToMain = function () {
            $location.path('/index');
            $scope.currentProject = {};
            $scope.dynamicBackground = "main";
        };

        // Go and Load selected Project
        $scope.goToProject = function (id, archive) {
            ResourceService._ajaxRequest("GET", id, null).then(function (project) {
                if (archive) {
                    $timeout(function () {
                        $scope.currentProject = project;
                        $location.path('/project');
                        $scope.currentProjectView = "budget";
                        $scope.dynamicBackground = "project_main";
                        $scope.addNewGuests._clear();
                    }, 500);
                } else {
                    $scope.currentProject = project;
                    $location.path('/project');
                    $scope.currentProjectView = "budget";
                    $scope.dynamicBackground = "project_main";
                    $scope.addNewGuests._clear();
                }
            });
        };

        // Project Left Menu navigation
        $scope.projectView = function (view) {
            switch (view) {
                case "budget" :
                    $scope.currentProjectView = "budget";
                    break;
                case "restaurant" :
                    $scope.currentProjectView = "restaurant";
                    break;
                case "restaurantPlus" :
                    $scope.currentProjectView = "restaurantPlus";
                    break;
                case "tamada" :
                    $scope.currentProjectView = "tamada";
                    break;
            }
        };

        // Add new guests (in restaurant)
        $scope.addNewGuests = {
            newMguestName: null,
            newMguestRelation: null,
            newMguestGroup: null,
            guestData: {},
            guestUnderEdit: {},

            _clear: function () {
                this.newMguestName = null;
                this.newMguestRelation = null;
                this.newMguestGroup = null;
                this.guestData = {};
                this.guestUnderEdit = {};
            },

            addNewGuest: function (side, name, relation, group) {
                var self = this;
                if (name && relation && group && angular.isNumber(+group)) {
                    if (side == "M") {
                        this.guestData.guestName = name;
                        this.guestData.guestRelation = relation;
                        this.guestData.guestGroup = group;
                        this.guestData.guestWillBe = true;

                        $scope.currentProject.fianceSideGuests.push(this.guestData);

                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject).then(
                            function (data) {
                                self._clear();
                                toastr.success('GUEST ADD SUCCESS');
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_M add AJAX failed');
                                throw new Error('ERROR: Guest_M add AJAX failed' + err);
                            });
                    }
                } else {
                    $log.log('err');
                }
            },

            guestEdit: function (index) {
                this.guestUnderEdit = $scope.currentProject.fianceSideGuests[index];
            },

            guestEditDone: function () {
                var self = this;
                ResourceService._ajaxRequest("PUT", null, $scope.currentProject).then(
                    function (data) {
                        self._clear();
                        toastr.success('GUEST EDIT SUCCESS');
                    },
                    function (err) {
                        toastr.error('ERROR: Guest_M edit AJAX failed');
                        throw new Error('ERROR: Guest_M edit AJAX failed' + err);
                    });
            },

            guestDelete: function (index) {
                var test = $scope.currentProject.fianceSideGuests.splice(index, 1);
                toastr.info(test);
            }
        };


    });// Ctrl end

    return wedControllers;
});