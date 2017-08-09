define(['angular'], function (angular) {
    "use strict";
    var decorCtrlModule = angular.module('decorCtrlModule', ['wedServices']);

    decorCtrlModule.controller('decorMainCtrl', decorMainCtrl);

    /*
    * DECOR MAIN CTRL
    * */
    function decorMainCtrl($scope, $log, toastr, _env, ResourceService) {
        // Default data
        $scope.itemToEdit = {};
        $scope.newItem = {};

        // WATCH CURRENCY VALUE and do recalculations if changed
        $scope.$watch("currentProject.budget.currency", function () {
            updateTotalValues();
            if (_env._dev){
                $log.log('update by DECOR: reason - CURRENCY change EVENT', $scope.count);
            }
        });

        // Shortcuts
        $scope.items = $scope.currentProject.decor.expCollection;
        $scope.total = $scope.currentProject.decor.total;
        
        // Update total values Fn
        function updateTotalValues() {
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
            angular.forEach($scope.items, function (item) {
                // USD and Nat plans separation
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
            $scope.currentProject.decor.total = $scope.total;

            // Emit Total Value Changes EVENT
            //***$scope.$emit('totalValuesChanged');
        }

        // Add New Expense Item Fn
        $scope.addNewExpenseItem = function (item) {
          if(item.name != '' && angular.isNumber(item.tariff) && angular.isNumber(item.multiplier) && angular.isNumber(item.paid)){
              // If 'unit' is not defined
              if(item.unit == '' || item.unit == null){
                  item.unit = 'не указан';
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
              $scope.currentProject.decor.expCollection.push(item);

              // Update total values
              updateTotalValues();
              if (_env._dev){
                  $log.log('update by DECOR: reason - ADD DECOR EXP EVENT ', $scope.count)
              }

              // ADD EXPENSE ITEM to DB
              ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/decorDataSave").then(
                  function (data) {
                      $scope.newItem = {};
                      if (_env._dev) {
                          toastr.success('New Decor Item created!');
                      }
                  },
                  function (err) {
                      toastr.error('ERROR: New Decor Item AJAX failed');
                      throw new Error('ERROR: New Decor Item AJAX failed' + err);
                  })
                  .catch(function (err) {
                      toastr.error("ERROR: New Decor Item AJAX failed");
                      $log.error("ERROR: New Decor Item AJAX failed", err);
                  });
          }
          else {
              toastr.error('ERROR: Decor expense input check failed');
              throw new Error('ERROR: Decor expense input check failed' + err);
          }
        };

        // Edit Expense Item Fn
        $scope.editExpenseItem = function (index) {
           $scope.itemToEdit = $scope.items[index];
            $scope.removeTrigger = false;
        };

        // SAVE EDITED ITEM in DB
        $scope.editExpenseItemSave = function (item) {
            if(item.name != '' && angular.isNumber(item.tariff) && angular.isNumber(item.multiplier) && angular.isNumber(item.paid)){
                // If 'unit' is not defined
                if(item.unit == '' || item.unit == null){
                    item.unit = 'не указан';
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
                if (_env._dev){
                    $log.log('update by DECOR: reason - EDIT DECOR EXP EVENT ', $scope.count)
                }

                // SAVE CHANGES of EXPENSE ITEM to DB
                ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/decorDataSave").then(
                    function (data) {
                        $scope.removeTrigger = false;
                        $scope.itemToEdit = {};
                        if (_env._dev) {
                            toastr.success('DECOR Expense Item Edited!');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: DECOR Expense Item AJAX failed');
                        throw new Error('ERROR: DECOR Expense Item AJAX failed' + err);
                    })
                    .catch(function (err) {
                        toastr.error("ERROR: DECOR Expense Item Edit AJAX failed");
                        $log.error("ERROR: DECOR Expense Item Edit AJAX failed", err);
                    });
            }
            else {
                toastr.error('ERROR: DECOR expense input check failed');
                throw new Error('ERROR: DECOR expense input check failed' + err);
            }
        };

        // DELETE ITEM
        $scope.deleteExpenseItem = function (index) {
            // Remove from model
            $scope.currentProject.decor.expCollection.splice(index, 1);

            // Update total values
            updateTotalValues();
            if (_env._dev){
                $log.log('update by DECOR: reason - REMOVE DECOR EXP EVENT ', $scope.count)
            }

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/decorDataSave").then(
                function (data) {
                    $scope.removeTrigger = false;
                    $scope.itemToEdit = {};
                    if (_env._dev) {
                        toastr.warning('DECOR Expense Item removed');
                    }
                },
                function (err) {
                    toastr.error('ERROR: DECOR Expense Item AJAX failed');
                    throw new Error('ERROR: DECOR Expense Item AJAX failed' + err);
                })
                .catch(function (err) {
                    toastr.error("ERROR: DECOR Expense Item Edit AJAX failed");
                    $log.error("ERROR: DECOR Expense Item Edit AJAX failed", err);
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

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/decorDataSave").then(
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

    } // *END* DECOR MAIN CTRL





    return decorCtrlModule;
});