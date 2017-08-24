define(['angular'], function (angular) {
    "use strict";
    var budgetCtrlModule = angular.module('budgetCtrlModule', ['wedServices', 'authServices']);

    budgetCtrlModule.controller('budgetMainCtrl', budgetMainCtrl);
    budgetCtrlModule.controller('tasksMainCtrl', tasksMainCtrl);
    budgetCtrlModule.controller('smsMainCtrl', smsMainCtrl);

    /*
     * BUDGET MAIN CTRL
     * */
    function budgetMainCtrl($scope, $log, toastr,$window ,$timeout, ResourceService, UsersResourceService) {
        // Default subView
        $scope.subView = "settings";
        $scope.budget = {};

        // Shortcuts
        $scope.budgetTotals = $scope.currentProject.budget.total;

        // ON-EVENT SUBSCRIBE <- wedMainCtrl (when projectView = 'budget')
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
            //Shortcuts
            var wed = $scope.currentProject;

            // Define Nat Budget
            wed.budget.budgetNat = wed.wedBudget * wed.budget.currency;

            // Define totals sum of planUsd/planNat
            wed.budget.total.wedPlanTotalUsd = wed.restaurant.total.planTotalUsd
                + wed.arrangement.total.planUsd
                + wed.program.total.planUsd
                + wed.filming.total.planUsd
                + wed.party.total.planUsd


                + wed.dress.total.planUsd;


            wed.budget.total.wedPlanTotalNat =  wed.budget.total.wedPlanTotalUsd * wed.budget.currency;

            // Define totals sum of paidUsd/paidNat
            wed.budget.total.wedPaidTotalUsd = wed.restaurant.total.paidTotalUsd
                + wed.arrangement.total.paidTotalUsd
                + wed.program.total.paidTotalUsd
                + wed.filming.total.paidTotalUsd
                + wed.party.total.paidTotalUsd

                + wed.dress.total.paidTotalUsd;

            wed.budget.total.wedPaidTotalNat =  wed.budget.total.wedPaidTotalUsd * wed.budget.currency;

            // Define totals sum of restUsd/restNat
            wed.budget.total.wedRestTotalUsd =  wed.budget.total.wedPlanTotalUsd -  wed.budget.total.wedPaidTotalUsd;
            wed.budget.total.wedRestTotalNat =  wed.budget.total.wedRestTotalUsd * wed.budget.currency;

            // DEFINE WED BUDGET REST by PLAN
            wed.budget.total.wedBudgetRestPlanUsd = wed.wedBudget - wed.budget.total.wedPlanTotalUsd;
            wed.budget.total.wedBudgetRestPlanNat = wed.budget.total.wedBudgetRestPlanUsd * wed.budget.currency;

            // DEFINE WED BUDGET FACT by PLAN
            wed.budget.total.wedBudgetRestFactUsd = wed.wedBudget - wed.budget.total.wedPaidTotalUsd;
            wed.budget.total.wedBudgetRestFactNat = wed.budget.total.wedBudgetRestFactUsd * wed.budget.currency;

            // COPY Obj back
           $scope.currentProject.budget.total = wed.budget.total;

            if (_env()._dev){
                $log.log('BUDGET CALCULATION UPDATE');
            }
        }

        // EVOKE ON-LOAD
        $timeout(function () {
            // MAIN BUDGET CALCULATION Fn
            weddingBudgetTotals();
        },600);

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

                $scope.currentProject.budget.budgetNat = $scope.currentProject.wedBudget * budget.currency;

                $timeout(function () {
                    // MAIN BUDGET CALCULATION Fn
                    weddingBudgetTotals();

                    var request = {
                        _id: $scope.currentProject._id,
                        key : 'budget',
                        keyURL : "/budgetDataSave",
                        data : $scope.currentProject.budget
                    };

                    // SAVE RESTAURANT DATA
                    ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                        function (data) {
                            if (_env()._dev) {
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
                },200);

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

            var request = {
                _id: $scope.currentProject._id,
                key: "budgetNotes",
                keyURL : "/budgetNotes",
                data : $scope.currentProject.budgetNotes
            };

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                function (data) {
                    if (_env()._dev) {
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

        // Notes Save
        $scope.projNoteSave = function () {

            var request = {
                _id: $scope.currentProject._id,
                key: "projectNotes",
                keyURL : "/projectNotes",
                data : $scope.currentProject.notes
            };

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                function (data) {
                    if (_env()._dev) {
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

        // Subview shift Fn
        $scope.subViewShift = function (view) {
            switch (view) {
                case "settings" :
                    $scope.subView = view;
                    break;
                case "info" :
                    $scope.subView = view;
                    break;
                case "reports" :
                    $scope.subView = view;
                    break;
                case "tasks" :
                    $scope.subView = view;
                    break;
                case "sms" :
                    $scope.subView = view;

                    angular.forEach($scope.currentUser.smsQty, function (userProjectSMS) {

                        if(userProjectSMS.projectId == $scope.currentProject._id){

                            userProjectSMS.qty = $scope.currentProject.smsCollection.length;

                            $scope.newSMS[$scope.currentProject._id] = 0;
                        }
                    });

                    var request = {
                        _id : $scope.currentUser._id,
                        arr : $scope.currentUser.smsQty
                    };
                    UsersResourceService._ajaxRequest("PUT", null, request, '/smsQty').catch(function (err) {
                        toastr.error("ERROR: AJAX ERROR");
                        $log.error("ERROR: AJAX ERROR", err);
                    });

                    break;
            }
        };

    } // Ctrl End


    /*
     * tasks MAIN CTRL
     * */
    function tasksMainCtrl($scope, $log, toastr, ResourceService) {
        // INPUT DATA CONFIG
        $scope.conf = {
            // Main setup
            mainProp : 'tasks',

            // MSGs setup
            msgNameBg : 'TASKS',
            msgNameSm : 'tasks',

            //Views setup
            title : 'СПИСОК ЗАДАЧ',
            ttlBy : 'ЗАДАЧАМ',

            // Forms setup (auto)
            get addForm(){
                return 'addNew' +  this.msgNameSm +'ExpenseForm';
            },
            get editForm(){
                return 'edit' + this.msgNameSm +'ExpenseForm';
            }
        };

        // Default data
        $scope.itemToEdit = {};
        $scope.newItem = {};
        $scope.removeTrigger = {};
        $scope.removeTrigger.status = false;

        // Shortcuts
        $scope.items = $scope.currentProject[$scope.conf.mainProp].expCollection;



        // Add New TASK Item Fn
        $scope.addNewExpenseItem = function (item) {
            if(item.name != '' && angular.isNumber(item.priority)){

                // Add expense item to expCollection
                $scope.currentProject[$scope.conf.mainProp].expCollection.push(item);

                if (_env()._dev){
                    $log.log('Update PROJECT by ' + $scope.conf.msgNameBg +': reason - ADD ' + $scope.conf.msgNameBg +'  EVENT ');
                }

                var request = {
                    _id: $scope.currentProject._id,
                    key : $scope.conf.mainProp,
                    keyURL : "/" + $scope.conf.mainProp + "DataSave"
                };
                request[$scope.conf.mainProp] = $scope.currentProject[$scope.conf.mainProp];

                // ADD EXPENSE ITEM to DB
                ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                    function (data) {
                        $scope.newItem = {};
                        if (_env()._dev) {
                            toastr.success('New ' + $scope.conf.msgNameSm + ' Item created!');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed');
                        throw new Error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed' + err);
                    })
                    .catch(function (err) {
                        toastr.error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed');
                        $log.error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed', err);
                    });
            }
            else {
                toastr.error('ERROR: ' + $scope.conf.msgNameSm + '  input check failed');
                throw new Error('ERROR: ' + $scope.conf.msgNameSm + '  input check failed');
            }
        };

        // Edit TASK Item Fn
        $scope.editExpenseItem = function (index) {
            $scope.itemToEdit = $scope.items[index];
            $scope.removeTrigger.status = false;
        };

        // SAVE EDITED ITEM in DB
        $scope.editExpenseItemSave = function (item) {
            if(item.name != '' && angular.isNumber(item.priority)){

                if (_env()._dev){
                    $log.log('Update PROJECT by ' + $scope.conf.msgNameBg +': reason - EDIT ' + $scope.conf.msgNameBg +' EVENT ');
                }

                var request = {
                    _id: $scope.currentProject._id,
                    key : $scope.conf.mainProp,
                    keyURL : "/" + $scope.conf.mainProp + "DataSave"
                };
                request[$scope.conf.mainProp] = $scope.currentProject[$scope.conf.mainProp];

                // ADD EXPENSE ITEM to DB
                ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                    function (data) {
                        $scope.itemToEdit = {};
                        if (_env()._dev) {
                            toastr.success($scope.conf.msgNameBg + ' Expense Item Edited!');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item AJAX failed');
                        throw new Error('ERROR: ' + $scope.conf.msgNameBg + 'Expense Item AJAX failed' + err);
                    })
                    .catch(function (err) {
                        toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item Edit AJAX failed');
                        $log.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item Edit AJAX failed', err);
                    });
            }
            else {
                toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' expense input check failed');
                throw new Error('ERROR: ' + $scope.conf.msgNameBg + ' expense input check failed');
            }
        };

        // DELETE TASK ITEM
        $scope.deleteExpenseItem = function (index) {
            // Remove from model
            $scope.currentProject[$scope.conf.mainProp].expCollection.splice(index, 1);
            //$scope.removeTrigger = false;
            if (_env()._dev){
                $log.log('Update PROJECT by ' + $scope.conf.msgNameBg + ': reason - REMOVE ' + $scope.conf.msgNameBg +' EVENT ');
            }
            var request = {
                _id: $scope.currentProject._id,
                key : $scope.conf.mainProp,
                keyURL : "/" + $scope.conf.mainProp + "DataSave"
            };
            request[$scope.conf.mainProp] = $scope.currentProject[$scope.conf.mainProp];

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                function (data) {

                    $scope.itemToEdit = {};
                    if (_env()._dev) {
                        toastr.info($scope.conf.msgNameBg + ' Item removed');
                    }
                },
                function (err) {
                    toastr.error('ERROR: ' + $scope.conf.msgNameBg + '  Item AJAX failed');
                    throw new Error('ERROR: ' + $scope.conf.msgNameBg + '  Item AJAX failed' + err);
                })
                .catch(function (err) {
                    toastr.error('ERROR: ' + $scope.conf.msgNameBg + '  Item Edit AJAX failed');
                    $log.error('ERROR: ' + $scope.conf.msgNameBg + '  Item Edit AJAX failed', err);
                });
        };

    } // *END* tasks MAIN CTRL



    /*
     * SMS MAIN CTRL
     * */
    function smsMainCtrl($scope, $log, toastr, $http, $timeout, ResourceService){

        // VISITOR SMS SEND Fn
        $scope.sendSms = function (msg) {
            // SAVE visitor name
            var buffer = msg.author;

            if(msg.text &&  msg.author){
               msg.date = Date.now();

               var request = {
                   _id: $scope.currentProject._id,
                   keyFullURL: $scope.currentProject._id  + '/visitorNewSMS',
                   keyURL: '/visitorNewSMS',
                   data: msg
               };

                ResourceService._ajaxRequest("POST", null, request, request.keyFullURL).then(function () {
                    toastr.success('ОТПРАВЛЕНО!');
                    $scope.sms = {};
                    $scope.sms.author = buffer;
                }).catch(function (err) {
                    toastr.error("ERROR: AJAX ERROR");
                    $log.error("ERROR: AJAX ERROR", err);
                });
           }
       };

        // USER SMS LIST CLEAR Fn
        $scope.clearAllSms = function () {
            // Clear an smsCollection Arr
            $scope.currentProject.smsCollection.length = 0;

            var request = {
                _id : $scope.currentProject._id,
                keyURL : '/sms',
                data : $scope.currentProject.smsCollection
            };

            ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(function () {
               toastr.info('SMS LIST CLEARED!');
            }).catch(function (err) {
                toastr.error("ERROR: AJAX ERROR");
                $log.error("ERROR: AJAX ERROR", err);
            });
        }

    }// Ctrl End



    return budgetCtrlModule;
});