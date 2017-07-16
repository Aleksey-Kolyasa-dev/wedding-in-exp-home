define(['angular'], function (angular) {
    "use strict";
    var wedControllers = angular.module('wedControllers', ['wedServices']);

    wedControllers.controller('wedMainCtrl', function ($scope, $log, $location, $timeout, toastr, ResourceService, AppService) {
        // Default Values
        $scope.currentProject = {};
        $scope.projects = [];
        $scope.newProject = {};
        $scope.currentProjectView = {};
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
        $scope.createNewProject = function (newProject) {
            // New Project Constructor
            function NewProjectCtor(project) {
                this.fianceName = project.fianceName;
                this.fianceeName = project.fianceeName;
                this.weddingDate = AppService._dateStringToObject(project.weddingDate);
                this.wedBudget = project.wedBudget;
                this.email = project.email;
                this.telephones = project.telephones;
                this.notes = project.notes;
                this.fianceSideGuests = [];
                this.fianceeSideGuests = [];
            }

            ResourceService._ajaxRequest("POST", null, new NewProjectCtor(newProject))
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
            //$scope.dynamicBackground = "main";
        };

        // Go and Load selected Project
        $scope.goToProject = function (id, archive) {
            ResourceService._ajaxRequest("GET", id, null).then(function (project) {
                if (archive) {
                    $timeout(function () {
                        $scope.currentProject = project;
                        $location.path('/project');
                        $scope.currentProjectView.mainMenu = "budget";
                        //$scope.dynamicBackground = "project_main";
                        $scope.addNewGuests._clear();
                    }, 500);
                } else {
                    $scope.currentProject = project;
                    $location.path('/project');
                    $scope.currentProjectView.mainMenu = "budget";
                    //$scope.dynamicBackground = "project_main";
                    $scope.addNewGuests._clear();
                }
            });
        };

        // Project Left Menu navigation
        $scope.projectView = function (view) {
            switch (view) {
                case "budget" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
                case "restaurant" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
                case "restaurantPlus" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
                case "tamada" :
                    $scope.currentProjectView.mainMenu = view;
                    break;
            }
        };

        // Add new guests (in restaurant)
        $scope.addNewGuests = {
            newMguestName: null,
            newMguestRelation: null,
            newMguestGroup: null,

            newWguestName: null,
            newWguestRelation: null,
            newWguestGroup: null,

            guestData: {},
            guestUnderEdit: {},

            _clear: function () {
                this.newMguestName = null;
                this.newMguestRelation = null;
                this.newMguestGroup = null;

                this.newWguestName = null;
                this.newWguestRelation = null;
                this.newWguestGroup = null;

                this.guestData = {};
                this.guestUnderEdit = {};
            },

            addNewGuest: function (side, name, relation, group) {
                var self = this;
                if (name && relation && group && angular.isNumber(+group)) {
                    this.guestData.guestName = name;
                    this.guestData.guestRelation = relation;
                    this.guestData.guestGroup = group;
                    this.guestData.guestWillBe = true;

                    switch (side){
                        // Fiance Side Guest
                        case "M":
                            $scope.currentProject.fianceSideGuests.push(this.guestData);
                            ResourceService._ajaxRequest("PUT", null, $scope.currentProject,  "/fianceSideGuests").then(
                                function (data) {
                                    self._clear();
                                    toastr.success('GUEST ADD SUCCESS');
                                },
                                function (err) {
                                    toastr.error('ERROR: Guest_M add AJAX failed');
                                    throw new Error('ERROR: Guest_M add AJAX failed' + err);
                                });
                        break;
                        // Fiancee Side Guest
                        case "W":
                            $scope.currentProject.fianceeSideGuests.push(this.guestData);
                            ResourceService._ajaxRequest("PUT", null, $scope.currentProject,  "/fianceeSideGuests").then(
                                function (data) {
                                    self._clear();
                                    toastr.success('GUEST ADD SUCCESS');
                                },
                                function (err) {
                                    toastr.error('ERROR: Guest_W add AJAX failed');
                                    throw new Error('ERROR: Guest_W add AJAX failed' + err);
                                });
                        break;
                    }
                } else {
                    self._clear();
                    $log.log('err');
                }
            },

            guestEdit: function (index, side) {
                switch (side) {
                    case "M" :
                        this.guestUnderEdit = $scope.currentProject.fianceSideGuests[index];
                        this.guestUnderEdit.side = "M";
                    break;

                    case "W" :
                        this.guestUnderEdit = $scope.currentProject.fianceeSideGuests[index];
                        this.guestUnderEdit.side = "W";
                    break;
                }
            },

            guestEditDone: function (side) {
                var self = this;
                switch (side){
                    case "M":
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceSideGuests").then(
                            function (data) {
                                self._clear();
                                toastr.success('GUEST EDIT SUCCESS');
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_M edit AJAX failed');
                                throw new Error('ERROR: Guest_M edit AJAX failed' + err);
                            });
                    break;

                    case "W":
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceeSideGuests").then(
                            function (data) {
                                self._clear();
                                toastr.success('GUEST EDIT SUCCESS');
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_W edit AJAX failed');
                                throw new Error('ERROR: Guest_W edit AJAX failed' + err);
                            });
                    break;
                }

            },

            guestDelete: function (guest) {
                var self = this;
                switch (guest.side) {
                    case "M" :
                        $scope.currentProject.fianceSideGuests.splice($scope.currentProject.fianceSideGuests.indexOf(guest), 1);
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceSideGuests").then(
                            function (data) {
                                self._clear();
                                toastr.success('GUEST DELETED SUCCESS');
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_M delete AJAX failed');
                                throw new Error('ERROR: Guest_M delete AJAX failed' + err);
                            });
                    break;

                    case "W" :
                        $scope.currentProject.fianceeSideGuests.splice($scope.currentProject.fianceeSideGuests.indexOf(guest), 1);
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceeSideGuests").then(
                            function (data) {
                                self._clear();
                                toastr.success('GUEST DELETED SUCCESS');
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_W delete AJAX failed');
                                throw new Error('ERROR: Guest_W delete AJAX failed' + err);
                            });
                        break;
                }

            }
        };

    });// Ctrl end

    return wedControllers;
});