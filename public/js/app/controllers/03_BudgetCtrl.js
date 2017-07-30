define(['angular'], function (angular) {
    "use strict";
    var budgetCtrlModule = angular.module('budgetCtrlModule', ['wedServices']);

    budgetCtrlModule.controller('budgetMainCtrl', budgetMainCtrl);

    function budgetMainCtrl($scope, $log, toastr, _env, ResourceService) {
        toastr.info('test');
    } // Ctrl End

    return budgetCtrlModule;
});