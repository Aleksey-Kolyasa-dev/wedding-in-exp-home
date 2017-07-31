define(['angular'], function (angular) {
    "use strict";
    var budgetCtrlModule = angular.module('budgetCtrlModule', ['wedServices']);

    budgetCtrlModule.controller('budgetMainCtrl', budgetMainCtrl);

    function budgetMainCtrl($scope, $log, toastr, _env, ResourceService) {
        // Default subView
        $scope.subView = "settings";

        $scope.budgetSettingsApply = function (budget) {
            if(angular.isDefined(budget.nationalMoney) && angular.isNumber(budget.currency)){
                ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/budget").then(
                    function (data) {
                        // $scope.saveHide = true;
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



    } // Ctrl End

    return budgetCtrlModule;
});