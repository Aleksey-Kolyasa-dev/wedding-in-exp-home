define(['angular'], function (angular) {
    "use strict";
    var budgetCtrlModule = angular.module('budgetCtrlModule', ['wedServices']);

    budgetCtrlModule.controller('budgetMainCtrl', budgetMainCtrl);

    function budgetMainCtrl($scope, $log, toastr, $timeout ,_env, ResourceService) {
        // Default subView
        $scope.subView = "settings";
        $scope.budget = {};

        // Shortcuts
        $scope.budgetTotals = $scope.currentProject.budget.total;

        // EVENT SUBSCRIBE
        $scope.$on('doBudgetReCalculation', function () {
            weddingBudgetTotals();
        });

        // Budged EDIT TRIGGER Fn
        $scope.budgetChangeTriger = function (natMoney, currency) {
            $scope.budget.nationalMoney = natMoney;
            $scope.budget.currency = currency;
        };

        // MAIN BUDGET CALCULATION Fn
        function weddingBudgetTotals() {
            var wed = $scope.currentProject;
            // Define totals sum of planUsd/planNat
            wed.budget.total.wedPlanTotalUsd = wed.restaurant.total.planTotalUsd
                + wed.decor.total.planUsd
                + wed.flower.total.planUsd
                + wed.leader.total.planUsd
                + wed.music.total.planUsd;
            wed.budget.total.wedPlanTotalNat =  wed.budget.total.wedPlanTotalUsd * wed.budget.currency;

            // Define totals sum of paidUsd/paidNat
            wed.budget.total.wedPaidTotalUsd = wed.restaurant.total.paidTotalUsd
                + wed.decor.total.paidTotalUsd
                + wed.flower.total.paidTotalUsd
                + wed.leader.total.paidTotalUsd
                + wed.music.total.paidTotalUsd;
            wed.budget.total.wedPaidTotalNat =  wed.budget.total.wedPaidTotalUsd * wed.budget.currency;

            // Define totals sum of restUsd/restNat
            wed.budget.total.wedRestTotalUsd =  wed.budget.total.wedPlanTotalUsd -  wed.budget.total.wedPaidTotalUsd;
            wed.budget.total.wedRestTotalNat =  wed.budget.total.wedRestTotalUsd * wed.budget.currency;

            // DEFINE WED BUDGET REST by PLAN
            wed.budget.total.wedBudgetRestPlanUsd = wed.budget.budgetUSD - wed.budget.total.wedPlanTotalUsd;
            wed.budget.total.wedBudgetRestPlanNat = wed.budget.total.wedBudgetRestPlanUsd * wed.budget.currency;

            // DEFINE WED BUDGET FACT by PLAN
            wed.budget.total.wedBudgetRestFactUsd = wed.budget.budgetUSD - wed.budget.total.wedPaidTotalUsd;
            wed.budget.total.wedBudgetRestFactNat = wed.budget.total.wedBudgetRestFactUsd * wed.budget.currency;

            // COPY Obj back
           $scope.currentProject.budget.total = wed.budget.total;

            if (_env._dev){
                $log.log('BUDGET CALCULATION UPDATE');
            }
        }

        // EVOKE ON-LOAD
        $timeout(function () {
            // MAIN BUDGET CALCULATION Fn
            weddingBudgetTotals();
        },300);

        // SAVE CHANGES to DB
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

                //copy to data BUDGET
                $scope.currentProject.budget.nationalMoney = budget.nationalMoney;
                $scope.currentProject.budget.currency = budget.currency;

                $scope.currentProject.budget.budgetNat = $scope.currentProject.budget.budgetUSD * budget.currency;

                $timeout(function () {
                    // MAIN BUDGET CALCULATION Fn
                    weddingBudgetTotals();
                },200);


                ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/budget").then(
                    function (data) {
                        if (_env._dev) {
                            toastr.success('budget changed');
                            $scope.budget = {};
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