define(['angular'], function (angular) {
    "use strict";
    var marriageCtrlModule = angular.module('marriageCtrlModule', ['wedServices']);

    marriageCtrlModule.controller('marriageMainCtrl', marriageMainCtrl);


    /*
     * marriage CTRL
     * */
    function marriageMainCtrl($scope, $log, toastr, ResourceService) {

        // INPUT DATA CONFIG
        $scope.conf = {
            // Main setup
            mainProp : 'marriage',
            parent : 'marriage',

            // MSGs setup
            msgNameBg : 'MARRIAGE',
            msgNameSm : 'Marriage',

            // Titles setup
            title : 'ВЕНЧАНИЕ',
            ttlBy : 'ВЕНЧАНИЮ',

            //Views setup
            expTableTitle : 'ПО ВЕНЧАНИЮ',

            // Menu buttons setup
            buttons: [],

            // Views shift & children names
            views : [
                'marriage'
            ],

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

        // WATCH CURRENCY VALUE and do recalculations if changed
        $scope.$watch("currentProject.budget.currency", function () {
            if($scope.currentProject[$scope.conf.mainProp].expCollection.length){
                updateTotalValues();
                if (_env()._dev){
                    $log.log('Update PROJECT by ' + $scope.conf.msgNameBg + ': reason - CURRENCY change EVENT');
                }
            }
        });

        // Shortcuts
        $scope.items = $scope.currentProject[$scope.conf.mainProp].expCollection;
        $scope.total = $scope.currentProject[$scope.conf.mainProp].total;
        $scope.notes = $scope.currentProject[$scope.conf.mainProp + 'Notes'];

        // Update total values Fn
        function updateTotalValues() {
            // Shortcuts
            $scope.total = {
                planUsd : 0,
                planNat : 0,
                paidUsd : 0,
                paidNat : 0,
                paidTotalUsd : 0,
                paidTotalNat : 0,
                restTotalUsd : 0,
                restTotalNat : 0
            };

            // USD and Nat plans separation
            angular.forEach($scope.items, function (item) {
                if(item.usd){
                    $scope.total.planUsd += item.toPay;
                    $scope.total.planNat = $scope.total.planUsd * $scope.currentProject.budget.currency;

                    $scope.total.paidUsd += item.paid;
                    $scope.total.paidNat = $scope.total.paidUsd * $scope.currentProject.budget.currency;
                }
                if(!item.usd){
                    $scope.total.planNat += item.toPay;
                    $scope.total.planUsd = $scope.total.planNat / $scope.currentProject.budget.currency;

                    $scope.total.paidNat += item.paid;
                    $scope.total.paidUsd = $scope.total.paidNat / $scope.currentProject.budget.currency;
                }
            });

            // Total Paid calculations
            $scope.total.paidTotalUsd += $scope.total.paidUsd;
            $scope.total.paidTotalNat = $scope.total.paidTotalUsd * $scope.currentProject.budget.currency;

            // Total Rest calculations
            $scope.total.restTotalUsd = $scope.total.planUsd - $scope.total.paidTotalUsd;
            $scope.total.restTotalNat = $scope.total.restTotalUsd * $scope.currentProject.budget.currency;

            // in the end copy obj back
            $scope.currentProject[$scope.conf.mainProp].total = $scope.total;

        }

        // Add New Expense Item Fn
        $scope.addNewExpenseItem = function (item) {
            if(item.name != '' && angular.isNumber(item.tariff) && angular.isNumber(item.multiplier) && angular.isNumber(item.paid)){
                // If 'unit' is not defined
                if(item.unit == '' || item.unit == null){
                    item.unit = 'не указано';
                }
                // multiplier correction
                if(item.multiplier < 0 ){
                    item.multiplier = 1;
                }
                // multiplier correction
                if(item.multiplier == 0 ){
                    item.multiplier = 1;
                }
                // tariff correction
                if(item.tariff < 0){
                    item.tariff *=-1;
                }
                // paid correction
                if(item.paid < 0){
                    item.paid *= -1;
                }
                // Intermediate calculations
                item.toPay = item.tariff * item.multiplier;
                item.rest = item.toPay - item.paid;

                // Money type check
                if(!item.usd){
                    item.money = $scope.currentProject.budget.nationalMoney;
                } else {
                    item.money = 'USD';
                }

                // Add expense item to expCollection
                $scope.currentProject[$scope.conf.mainProp].expCollection.push(item);

                // Update total values
                updateTotalValues();

                if (_env()._dev){
                    $log.log('Update PROJECT by ' + $scope.conf.msgNameBg +': reason - ADD ' + $scope.conf.msgNameBg +' EXP EVENT ');
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
                        } else {
                            toastr.success('OK');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed');
                        throw new Error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed');
                    })
                    .catch(function (err) {
                        toastr.error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed');
                        $log.error('ERROR: New ' + $scope.conf.msgNameSm + ' Item AJAX failed', err);
                    });
            }
            else {
                toastr.error('ERROR: ' + $scope.conf.msgNameSm + ' expense input check failed');
                throw new Error('ERROR: ' + $scope.conf.msgNameSm + ' expense input check failed');
            }
        };

        // Edit Expense Item Fn
        $scope.editExpenseItem = function (index) {
            $scope.itemToEdit = $scope.items[index];
            $scope.removeTrigger.status = false;
        };

        // SAVE EDITED ITEM in DB
        $scope.editExpenseItemSave = function (item) {
            if(item.name != '' && angular.isNumber(item.tariff) && angular.isNumber(item.multiplier) && angular.isNumber(item.paid)){
                // If 'unit' is not defined
                if(item.unit == '' || item.unit == null){
                    item.unit = 'не указано';
                }
                // multiplier correction
                if(item.multiplier < 0 ){
                    item.multiplier = 1;
                }
                // multiplier correction
                if(item.multiplier == 0 ){
                    item.multiplier = 1;
                }
                // tariff correction
                if(item.tariff < 0){
                    item.tariff *=-1;
                }
                // paid correction
                if(item.paid < 0){
                    item.paid *= -1;
                }
                // Intermediate calculations
                item.toPay = item.tariff * item.multiplier;
                item.rest = item.toPay - item.paid;

                // Money type check
                if(!item.usd){
                    item.money = $scope.currentProject.budget.nationalMoney;
                } else {
                    item.money = 'USD';
                }

                // Update total values
                updateTotalValues();

                if (_env()._dev){
                    $log.log('update PROJECT by ' + $scope.conf.msgNameBg + ': reason - EDIT ' + $scope.conf.msgNameBg + ' EXP EVENT ');
                }

                var request = {
                    _id: $scope.currentProject._id,
                    key : $scope.conf.mainProp,
                    keyURL : "/" + $scope.conf.mainProp + "DataSave"
                };
                request[$scope.conf.mainProp] = $scope.currentProject[$scope.conf.mainProp];

                // SAVE CHANGES of EXPENSE ITEM to DB
                ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                    function (data) {
                        $scope.itemToEdit = {};
                        if (_env()._dev) {
                            toastr.success($scope.conf.msgNameBg + ' Expense Item Edited!');
                        } else {
                            toastr.success('OK');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item EditAJAX failed');
                        throw new Error('ERROR: ' + $scope.conf.msgNameBg + 'Expense Item Edit AJAX failed');
                    })
                    .catch(function (err) {
                        toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item Edit AJAX failed');
                        $log.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item Edit AJAX failed');
                    });
            }
            else {
                toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' expense input check failed');
                throw new Error('ERROR: ' + $scope.conf.msgNameBg + ' expense input check failed');
            }
        };

        // DELETE ITEM
        $scope.deleteExpenseItem = function (index) {
            // Remove from model
            $scope.currentProject[$scope.conf.mainProp].expCollection.splice(index, 1);

            // Update total values
            updateTotalValues();
            if (_env()._dev){
                $log.log('Update PROJECT by ' + $scope.conf.msgNameBg + ': reason - REMOVE ' + $scope.conf.msgNameBg + ' EXP EVENT ');
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
                    if (_env()._dev) {
                        toastr.info($scope.conf.msgNameBg + ' Expense Item removed');
                    } else {
                        toastr.info('OK');
                    }
                },
                function (err) {
                    toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item AJAX failed');
                    throw new Error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item AJAX failed');
                })
                .catch(function (err) {
                    toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item Edit AJAX failed');
                    $log.error('ERROR: ' + $scope.conf.msgNameBg + ' Expense Item Edit AJAX failed', err);
                });
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
                key: $scope.conf.mainProp + "Notes",
                keyURL : "/" + $scope.conf.mainProp +"Notes"
            };
            request[$scope.conf.mainProp + "Notes"] = $scope.currentProject[$scope.conf.mainProp + "Notes"];

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, request, request.keyURL).then(
                function (data) {
                    if (_env()._dev) {
                        toastr.info($scope.conf.msgNameBg + ' Notes are saved!');
                    } else {
                        toastr.info('OK');
                    }
                },
                function (err) {
                    toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Notes AJAX failed');
                    throw new Error('ERROR: ' + $scope.conf.msgNameBg + ' Notes AJAX failed');
                })
                .catch(function (err) {
                    toastr.error('ERROR: ' + $scope.conf.msgNameBg + ' Notes AJAX failed');
                    $log.error('ERROR: ' + $scope.conf.msgNameBg + ' Notes AJAX failed', err);
                });
        };

    } // *END* CTRL


    return marriageCtrlModule;
});