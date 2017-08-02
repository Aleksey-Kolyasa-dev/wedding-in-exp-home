define(['angular'], function (angular) {
    "use strict";
    var newProjectCtrlModule = angular.module('newProjectCtrlModule', ['wedServices']);

    newProjectCtrlModule.controller('newProjectCtrl', newProjectCtrl);
    newProjectCtrlModule.controller('editProjectCtrl', editProjectCtrl);
    /*
    *  NEW PROJECT CTRL
    * */
    function newProjectCtrl($scope, $log, toastr, _env, ResourceService, AppService) {
        $scope.createNewProject = function (newProject) {
            // New Project Constructor
            function NewProjectCtor(project) {
                this.fianceName = project.fianceName;
                this.fianceeName = project.fianceeName;
                this.weddingDate = AppService._dateStringToObject(project.weddingDate);
                /*this.wedBudget = project.wedBudget;*/
                this.email = project.email;
                this.telephones = project.telephones;
                this.notes = project.notes;
                this.fianceSideGuests = [];
                this.fianceeSideGuests = [];
                this.budget = {
                    budgetUSD : project.wedBudget,
                    budgetNat : 0,
                    nationalMoney : 'units',
                    currency : 0,
                    notes : null
                };
                this.restaurant = {
                    name : null,
                    address : null,
                    telephones : null,
                    website : null,
                    guestsQty : 2,
                    /*restaurantTotal: 0,*/
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
                    },
                    total : {
                        planUsd : 0,
                        planNat : 0,
                        paidUsd : 0,
                        paidNat : 0,
                        paidTotalUsd : 0,
                        paidTotalNat : 0,
                        restTotalUsd : 0,
                        restTotalNat : 0
                    }
                };
                this.restaurantPlus = {
                    expCollection : [{
                        name : 'ТОРТ',
                        tariff : 200,
                        multiplier : 5,
                        unit : 'kg',
                        toPai : 0,
                        paid : 0,
                        rest : 0,
                        usd : false,
                        money : null
                    }],
                    total : {
                        planUsd : 0,
                        planNat : 0,
                        paidUsd : 0,
                        paidNat : 0,
                        paidTotalUsd : 0,
                        paidTotalNat : 0,
                        restTotalUsd : 0,
                        restTotalNat : 0
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

    /*
    * EDIT PROJECT CTRL
    * */
    function editProjectCtrl($scope, $log, toastr, _env, ResourceService, AppService) {
        // Default values
        $scope.editProject = {};

        // budget update Fn
        function budgetUpdate() {
            $scope.editProject.budget.budgetNat = $scope.editProject.budget.budgetUSD * $scope.editProject.budget.currency;
        }
        // On 'editProject' Event => get edited project
        $scope.$on('editProject', function (e, args) {
           ResourceService._ajaxRequest("GET", args.id, null, null).then(function (project) {
               project.weddingDate = AppService._objectTodateString(project.weddingDate);
               $scope.editProject = project;
               budgetUpdate();
               //$scope.editProject.budget.budgetNat = $scope.editProject.budget.budgetUSD * $scope.editProject.budget.currency;
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
            budgetUpdate();
            //$scope.editProject.budget.budgetNat = $scope.editProject.budget.budgetUSD * $scope.editProject.budget.currency;
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