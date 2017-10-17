define(['angular'], function (angular) {
    "use strict";
    var newProjectCtrlModule = angular.module('newProjectCtrlModule', ['wedServices']);

    newProjectCtrlModule.controller('newProjectCtrl', newProjectCtrl);
    newProjectCtrlModule.controller('editProjectCtrl', editProjectCtrl);

    /*
    *  NEW PROJECT CTRL
    * */
    function newProjectCtrl($scope, $log, $window, toastr, ResourceService, AppService) {

        if($scope.currentUser.isAuth) {

            // CREATE NEW PROJECT Fn
            $scope.createNewProject = function (newProject) {
                newProject.owner = $scope.currentUser._id;
                newProject.accessKey = '#' + $window.btoa($scope.currentUser._id + newProject.weddingDate + newProject.wedBudget);
                newProject.weddingDate = AppService._dateStringToObject(newProject.weddingDate);
                newProject.created = new Date();

                ResourceService._ajaxRequest("POST", null, newProject, null)
                    .then(function (project) {
                        // RESET View model
                        $scope.newProject = {};

                        //EVENT: 'NEW PROJECT CREATED'
                        $scope.$emit('projectsListChange');

                        var sms = {
                            projectId : project._id,
                            qty : project.smsCollection.length
                        };

                        // EVENT: 'SMS QTY' -> wedMainCtrl
                        $scope.$emit('smsQty', sms);

                        if (_env()._dev) {
                            toastr.success("НОВЫЙ ПРОЕКТ СВАДЬБЫ " + project.fianceName + " и " + project.fianceeName + " СОЗДАН УСПЕШНО!");
                        } else {
                            toastr.success('OK');
                        }
                    })
                    .catch(function (err) {
                        toastr.error("ERROR: Create New Project ops failed");
                        $log.warn("ERROR: Create New Project ops failed", err);
                    });
            };
        }

    } // End of newProjectCtrl


    /*
    * EDIT PROJECT CTRL
    * */
    function editProjectCtrl($scope, $log, toastr, ResourceService, AppService) {
        // Budget Update Fn
        function budgetUpdate() {
            $scope.editProject.budget.budgetNat = $scope.currentProject.wedBudget * $scope.editProject.budget.currency;
        }

        if ($scope.currentUser.isAuth) {
            // Default values
            $scope.editProject = {};

            // ON-EVENT: 'editProject'
            $scope.$on('editProject', function (e, args) {
                ResourceService._ajaxRequest("GET", args.id, null, null).then(function (project) {
                    project.weddingDate = AppService._objectToDateString(project.weddingDate);
                    $scope.editProject = project;
                    // Budget update
                    budgetUpdate();
                }).catch(function (err) {
                    toastr.error("ERROR: GET init data failed");
                    $log.warn("ERROR: GET init data failed", err);
                });
            });

            // APPLY CHANGES Fn
            $scope.editProjectApply = function (editedProject) {
                $scope.deleteProjectTrigger = false;

                if (editedProject.weddingDate.length < 12) {
                    editedProject.weddingDate = AppService._dateStringToObject(editedProject.weddingDate);
                }

                // Budget update
                budgetUpdate();

                // Save to DB
                ResourceService._ajaxRequest("PUT", null, editedProject, null).then(
                    function (project) {
                        if (_env()._dev) {
                            toastr.success('PROJECT EDITED WITH SUCCESS');
                        } else {
                            toastr.success('OK');
                        }

                        // EVENT: PROJECT INIT DATA CHANGED -> wedMainCtrl
                        $scope.$emit('projectsListChange');
                    },
                    function (err) {
                        toastr.error('ERROR: project Edit & AJAX PUT failed');
                        throw new Error('ERROR: project Edit & AJAX PUT failed' + err);
                    });
            };

            // DELETE PROJECT Fn
            $scope.deleteProject = function (id) {
                var sms = {
                    projectId : id,
                    qty : 'remove'
                };

                // EVENT: 'SMS QTY' -> wedMainCtrl
                $scope.$emit('smsQty', sms);

                ResourceService._ajaxRequest("DELETE", id, null, null).then(function (data) {
                    if (_env()._dev) {
                        toastr.warning('PROJECT WAS DELETED');
                    }

                    //EVENT: PROJECT INIT DATA CHANGED -> wedMainCtrl
                    $scope.$emit('projectsListChange');

                    // RESET View Trigger
                    $scope.deleteProjectTrigger = false;

                }).catch(function (err) {
                    toastr.error("ERROR: DELETE PROJECT AJAX failed");
                    $log.warn("ERROR: DELETE PROJECT AJAX failed", err);
                });
            };
        }
    }


    return newProjectCtrlModule;
});