define(['angular'], function (angular) {
    "use strict";
    var newProjectCtrlModule = angular.module('newProjectCtrlModule', ['wedServices']);

    newProjectCtrlModule.controller('newProjectCtrl', newProjectCtrl);
    newProjectCtrlModule.controller('editProjectCtrl', editProjectCtrl);

    function newProjectCtrl($scope, $log, toastr, _env, ResourceService, AppService) {
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
                this.restaurant = {
                    name : null,
                    address : null,
                    telephones : null,
                    website : null,
                    guestsQty : 2,
                    restaurantTotal: 0,
                    notes : null,
                    quickView : false,
                    quickData : {
                        quickGuestsQty : 2,
                        quickCheck : 0,
                        quickPercent : 0,
                        quickPlugs : 0
                    },
                    generalData : {
                        generalCheck : 0,
                        generalPercent : 0,
                        generalPlugs : 0
                    }
                };
            }

            ResourceService._ajaxRequest("POST", null, new NewProjectCtor(newProject))
                .then(function (project) {
                    // Set newProject to Default for View
                    $scope.newProject = {};
                    // Emit 'newProject' event
                    $scope.$emit('projectsListChange');
                    if(_env._dev){
                        toastr.success("НОВЫЙ ПРОЕКТ СВАДЬБЫ " + project.fianceName + " и " + project.fianceeName + " СОЗДАН УСПЕШНО!");
                    }
                })
                .catch(function (err) {
                    toastr.error("ERROR: Create New Project ops failed");
                    $log.warn("ERROR: Create New Project ops failed", err);
                });
        };
    } // End of newProjectCtrl

    function editProjectCtrl($scope, $log, toastr, _env, ResourceService, AppService) {
        $scope.editProject = {};

        // On 'editProject' Event => get edited project
        $scope.$on('editProject', function (e, args) {
           ResourceService._ajaxRequest("GET", args.id, null, null).then(function (project) {
               project.weddingDate = AppService._objectTodateString(project.weddingDate);
               $scope.editProject = project;
           }).catch(function (err) {
               toastr.error("ERROR: GET init data failed");
               $log.warn("ERROR: GET init data failed", err);
           });
        });

        // Apply changes
        $scope.editProjectApply = function(editedProject){
            $scope.deleteProjectTrigger = false;
            if(editedProject.weddingDate.length < 12){
                editedProject.weddingDate = AppService._dateStringToObject(editedProject.weddingDate);
            }
            $log.log(editedProject);
            ResourceService._ajaxRequest("PUT", null, editedProject, null).then(
                function (project) {
                    $log.log(project);
                    if(_env._dev){
                        toastr.info('PROJECT EDITED WITH SUCCESS');
                    }
                    $scope.$emit('projectsListChange');
                },
                function (err) {
                    toastr.error('ERROR: project Edit & AJAX PUT failed');
                    throw new Error('ERROR: project Edit & AJAX PUT failed' + err);
                });
        };

        $scope.deleteProject = function (id) {
            ResourceService._ajaxRequest("DELETE", id, null, null).then(function (data) {
                if(_env._dev){
                    toastr.warning('PROJECT WAS DELETED');
                }
                $scope.$emit('projectsListChange');
                $scope.deleteProjectTrigger = false;
            }).catch(function (err) {
                toastr.error("ERROR: DELETE PROJECT AJAX failed");
                $log.warn("ERROR: DELETE PROJECT AJAX failed", err);
            });
        };
    }
    return newProjectCtrlModule;
});