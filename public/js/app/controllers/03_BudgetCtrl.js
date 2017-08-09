define(['angular'], function (angular) {
    "use strict";
    var budgetCtrlModule = angular.module('budgetCtrlModule', ['wedServices']);

    budgetCtrlModule.controller('budgetMainCtrl', budgetMainCtrl);

    function budgetMainCtrl($scope, $log, toastr, _env, ResourceService) {
        // Default subView
        $scope.subView = "settings";

        $scope.budgetSettingsApply = function (budget) {

            if(angular.isDefined(budget.nationalMoney) && angular.isNumber(budget.currency)){
                // Budget currency negative value correction
                if(budget.currency < 0){
                    budget.currency *= -1;
                }
                // Budget currency 0 value correction
                if(budget.currency == 0){
                    budget.currency = 1;
                }
                $scope.currentProject.budget.budgetNat = $scope.currentProject.budget.budgetUSD * budget.currency;

                ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/budget").then(
                    function (data) {
                        if (_env._dev) {
                            toastr.success('budget changed');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: budget input AJAX failed');
                        throw new Error('ERROR: budget input AJAX failed' + err);
                })
                .catch(function (err) {
                    toastr.error("ERROR: budget input AJAX failed");
                    $log.error("ERROR: budget input AJAX failed", err);
                });
            } else {
                toastr.error('ERROR: budget input data failed');
                throw new Error('ERROR: budget input data failed' + err);
            }
        };

        // Notes Display Filter
        $scope.notesFilter = function (notes) {
            if(notes == null){
                return '';
            } else {
                var noteArr = notes.split('*');
                if(noteArr[0] == ''){
                    noteArr.splice(0,1);
                }
                return noteArr;
            }
        };

        // Notes Save
        $scope.noteSave = function () {

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/budgetNotes").then(
                function (data) {
                    if (_env._dev) {
                        toastr.info('Notes are saved!');
                    }
                },
                function (err) {
                    toastr.error('ERROR: Notes AJAX failed');
                    throw new Error('ERROR: Notes AJAX failed' + err);
                })
                .catch(function (err) {
                    toastr.error("ERROR: Notes AJAX failed");
                    $log.error("ERROR: Notes AJAX failed", err);
                });
        };


    } // Ctrl End

    return budgetCtrlModule;
});