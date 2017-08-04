define(['angular'], function (angular) {
    "use strict";
    var restaurantCtrlModule = angular.module('restaurantCtrlModule', ['wedServices']);

    restaurantCtrlModule.controller('restaurantMainCtrl', restaurantMainCtrl);
    restaurantCtrlModule.controller('restaurantPlusMainCtrl', restaurantPlusMainCtrl);

    /*
     * RESTAURANT MAIN CTRL
     * */
    function restaurantMainCtrl($scope, $log, toastr, _env, ResourceService) {
        if(_env._dev){
            $scope.count = 0;
        }

        // Default subView
        $scope.subView = "guests";
        $scope.currentProject.restaurant.quickView = false;

        // EVENT SUBSCRIBE do recalculations if event
        $scope.$on('totalValuesChanged', function () {
            restaurantTotal();
        });

        // WATCH GUESTS QTY VALUE and do recalculations if changed
        $scope.$watch("currentProject.restaurant.guestsQty", function () {
            restaurantTotal();
        });

        // Subview shift Fn
        $scope.subViewShift = function (view) {
            switch (view) {
                case "guests" :
                    $scope.subView = view;
                    break;
                case "restaurant" :
                    $scope.subView = view;
                    break;
                case "restaurantPlus" :
                    $scope.subView = view;
                    break;
            }
        };

        // TOTAL RESTAURANT CALCULATION Fn
        function restaurantTotal() {
            // RESTAURANT Expenses calculations
                // GuestQty*Check
                $scope.currentProject.restaurant.generalData.sumCheckNat = $scope.currentProject.restaurant.guestsQty * $scope.currentProject.restaurant.generalData.generalCheck;
                // Define percentage
                $scope.currentProject.restaurant.generalData.sumPercentNat = ($scope.currentProject.restaurant.generalData.sumCheckNat / 100)*$scope.currentProject.restaurant.generalData.generalPercent;
                // Define plugs summ
                $scope.currentProject.restaurant.generalData.sumPlugsNat = $scope.currentProject.restaurant.guestsQty * $scope.currentProject.restaurant.generalData.generalPlugs;

                // Define restaurant plan nat/usd
                $scope.currentProject.restaurant.total.planNat = $scope.currentProject.restaurant.generalData.sumCheckNat + $scope.currentProject.restaurant.generalData.sumPercentNat + $scope.currentProject.restaurant.generalData.sumPlugsNat;  // check + % + plugs
                $scope.currentProject.restaurant.total.planUsd = $scope.currentProject.restaurant.total.planNat / $scope.currentProject.budget.currency;

                // Define check per guest counted with % and plugs effect
                $scope.currentProject.restaurant.generalData.fullCheckNat = $scope.currentProject.restaurant.total.planNat / $scope.currentProject.restaurant.guestsQty;

                // Define paidUsd by paidNat*currency
                $scope.currentProject.restaurant.total.paidUsd =  $scope.currentProject.restaurant.total.paidNat / $scope.currentProject.budget.currency;

                // Define rest to pay by total plan - total paid
                $scope.currentProject.restaurant.total.restNat = $scope.currentProject.restaurant.total.planNat - $scope.currentProject.restaurant.total.paidNat;
                $scope.currentProject.restaurant.total.restUsd = $scope.currentProject.restaurant.total.restNat / $scope.currentProject.budget.currency;

            // FULL RESTAURANT EXPENSES
                $scope.currentProject.restaurant.total.planTotalNat = $scope.currentProject.restaurant.total.planNat + $scope.currentProject.restaurantPlus.total.planNat;
                $scope.currentProject.restaurant.total.planTotalUsd = $scope.currentProject.restaurant.total.planUsd + $scope.currentProject.restaurantPlus.total.planUsd;

                $scope.currentProject.restaurant.total.paidTotalNat = $scope.currentProject.restaurant.total.paidNat + $scope.currentProject.restaurantPlus.total.paidTotalNat;
                $scope.currentProject.restaurant.total.paidTotalUsd = $scope.currentProject.restaurant.total.paidUsd + $scope.currentProject.restaurantPlus.total.paidTotalUsd;

                $scope.currentProject.restaurant.total.restTotalNat = $scope.currentProject.restaurant.total.planTotalNat - $scope.currentProject.restaurant.total.paidTotalNat;
                $scope.currentProject.restaurant.total.restTotalUsd = $scope.currentProject.restaurant.total.planTotalUsd - $scope.currentProject.restaurant.total.paidTotalUsd;

            if (_env._dev) {
                if ($scope.currentProject.restaurant.total.restTotalNat / $scope.currentProject.budget.currency != $scope.currentProject.restaurant.total.restTotalUsd) {
                    toastr.warning('CHECK FAILED: ResrMain: 56');
                }
                $scope.count++;
            }
        }

        // GUESTS OPS. Fn
        $scope.addNewGuests = {
            newMguestName: null,
            newMguestRelation: null,
            newMguestGroup: null,

            newWguestName: null,
            newWguestRelation: null,
            newWguestGroup: null,

            guestData: {},
            guestUnderEdit: {},

            _clear: function () {
                this.newMguestName = null;
                this.newMguestRelation = null;
                this.newMguestGroup = null;

                this.newWguestName = null;
                this.newWguestRelation = null;
                this.newWguestGroup = null;

                this.guestData = {};
                this.guestUnderEdit = {};
            },

            addNewGuest: function (side, name, relation, group) {
                var self = this;
                if (name && relation && group && angular.isNumber(+group)) {
                    this.guestData.guestName = name;
                    this.guestData.guestRelation = relation;
                    this.guestData.guestGroup = group;
                    this.guestData.guestWillBe = true;

                    switch (side) {
                        // Fiance Side Guest
                        case "M":
                            $scope.currentProject.fianceSideGuests.push(this.guestData);
                            ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceSideGuests").then(
                                function (data) {
                                    self._clear();
                                    if (_env._dev) {
                                        toastr.success('GUEST ADD SUCCESS');
                                    }
                                },
                                function (err) {
                                    toastr.error('ERROR: Guest_M add AJAX failed');
                                    throw new Error('ERROR: Guest_M add AJAX failed' + err);
                                });
                            break;
                        // Fiancee Side Guest
                        case "W":
                            $scope.currentProject.fianceeSideGuests.push(this.guestData);
                            ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceeSideGuests").then(
                                function (data) {
                                    self._clear();
                                    if (_env._dev) {
                                        toastr.success('GUEST ADD SUCCESS');
                                    }
                                },
                                function (err) {
                                    toastr.error('ERROR: Guest_W add AJAX failed');
                                    throw new Error('ERROR: Guest_W add AJAX failed' + err);
                                });
                            break;
                    }

                } else {
                    self._clear();
                    $log.log('err');
                }
            },

            guestEdit: function (index, side) {
                switch (side) {
                    case "M" :
                        this.guestUnderEdit = $scope.currentProject.fianceSideGuests[index];
                        this.guestUnderEdit.side = "M";
                        break;

                    case "W" :
                        this.guestUnderEdit = $scope.currentProject.fianceeSideGuests[index];
                        this.guestUnderEdit.side = "W";
                        break;
                }
            },

            guestEditDone: function (side) {
                var self = this;

                switch (side) {
                    case "M":
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceSideGuests").then(
                            function (data) {
                                self._clear();
                                if (_env._dev) {
                                    toastr.success('GUEST EDIT SUCCESS');
                                }
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_M edit AJAX failed');
                                throw new Error('ERROR: Guest_M edit AJAX failed' + err);
                            });
                        break;

                    case "W":
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceeSideGuests").then(
                            function (data) {
                                self._clear();
                                if (_env._dev) {
                                    toastr.success('GUEST EDIT SUCCESS');
                                }
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_W edit AJAX failed');
                                throw new Error('ERROR: Guest_W edit AJAX failed' + err);
                            });
                        break;
                }
            },

            guestDelete: function (guest) {
                var self = this;
                switch (guest.side) {
                    case "M" :
                        $scope.currentProject.fianceSideGuests.splice($scope.currentProject.fianceSideGuests.indexOf(guest), 1);
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceSideGuests").then(
                            function (data) {
                                self._clear();
                                if (_env._dev) {
                                    toastr.success('GUEST DELETED SUCCESS');
                                }
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_M delete AJAX failed');
                                throw new Error('ERROR: Guest_M delete AJAX failed' + err);
                            });
                        break;

                    case "W" :
                        $scope.currentProject.fianceeSideGuests.splice($scope.currentProject.fianceeSideGuests.indexOf(guest), 1);
                        ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/fianceeSideGuests").then(
                            function (data) {
                                self._clear();
                                if (_env._dev) {
                                    toastr.success('GUEST DELETED SUCCESS');
                                }
                            },
                            function (err) {
                                toastr.error('ERROR: Guest_W delete AJAX failed');
                                throw new Error('ERROR: Guest_W delete AJAX failed' + err);
                            });
                        break;
                }

            }
        };

        // Guests Qty Fn
        $scope.guestsQty = function (project) {
            if (!$scope.currentProject.restaurant.quickView) {
                if ($scope.currentProjectView.mainMenu == 'restaurant') {
                    var filtArrM = project.fianceSideGuests.filter(function (guest) {
                        return guest.guestWillBe == true;
                    });
                    var filtArrW = project.fianceeSideGuests.filter(function (guest) {
                        return guest.guestWillBe == true;
                    });
                    var result = filtArrM.length + filtArrW.length + 2;
                    $scope.currentProject.restaurant.guestsQty = result;

                    return result;
                }
            }
            else {
                var interQuick = $scope.currentProject.restaurant.quickData.quickGuestsQty * $scope.currentProject.restaurant.quickData.quickCheck;

                $scope.currentProject.restaurant.quickData.planNat = interQuick + ((interQuick / 100) * $scope.currentProject.restaurant.quickData.quickPercent) + ($scope.currentProject.restaurant.quickData.quickGuestsQty * $scope.currentProject.restaurant.quickData.quickPlugs);
                $scope.currentProject.restaurant.quickData.planUsd = $scope.currentProject.restaurant.quickData.planNat / $scope.currentProject.budget.currency;

                return $scope.currentProject.restaurant.quickData.quickGuestsQty;
            }
        };

        // Quick View ops.
        $scope.quickView = function (project) {
            project.restaurant.quickView = !project.restaurant.quickView;
            /*
            ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/quickView").then(
                function (data) {
                    //console.log(data);
                    if (_env._dev) {
                        toastr.success('view changed');
                    }
                },
                function (err) {
                    toastr.error('ERROR: Guest_M edit AJAX failed');
                    throw new Error('ERROR: Guest_M edit AJAX failed' + err);
                });*/
        };

        // Restaurant Data save Fn
        $scope.restDataSave = function (data) {
            // Case for GENERAL DATA AJAX SAVE
            if (!arguments.length) {

                // Do total calculations
                restaurantTotal();

                // SAVE RESTAURANT DATA
                ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/generalDataSave").then(
                    function (data) {
                        $scope.saveHide = true;
                        if (_env._dev) {
                            toastr.success('generalData changed');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: generalData edit AJAX failed');
                        throw new Error('ERROR: generalData edit AJAX failed' + err);
                    })
                    .catch(function (err) {
                    toastr.error("ERROR: generalData edit AJAX failed");
                    $log.error("ERROR: generalData edit AJAX failed", err);
                });
            }
            // Case for QUICK RESTAURANT DATA AJAX SAVE
            else if (angular.isNumber(data.quickGuestsQty) && angular.isNumber(data.quickCheck) && angular.isNumber(data.quickPercent)) {

                ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/quickDataSave").then(
                    function (data) {
                        $scope.saveHide = true;
                        if (_env._dev) {
                            toastr.success('quickData changed');
                        }
                    },
                    function (err) {
                            toastr.error('ERROR: quickData edit AJAX failed');
                            throw new Error('ERROR: quickData edit AJAX failed' + err);
                });
            }
            else {
                toastr.error('ERROR: generalData or quickData number input failed');
                throw new Error('ERROR: generalData or quickData number input failed' + err);
            }
        };

        // Trigger for "SAVE" btn behavior in quickView
        $scope.saveHideTrigger = function () {
            $scope.saveHide = false;
        };

        // Display filter for General Restaurant Data
        $scope.restGeneralDataDisplayCheck = function (value, key) {
            if(angular.isNumber(value)){
                if(value == 0){
                    return 'нет';
                } else {
                    return value + ' ' + key;
                }
            }
            if(value != '' && angular.isString(value)){
                return value;
            }
            if(value == ''){
                return "не указан";
            } else {
                return '';
            }
        };

        //  Display Filter for Notes
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

    } // Ctrl End

    /*
    * RESTAURANT PLUS CTRL
    * */
    function restaurantPlusMainCtrl($scope, $log, toastr, _env, ResourceService) {
        // Default data
        $scope.itemToEdit = {};
        $scope.newItem = {};

        // Shortcuts
        $scope.items = $scope.currentProject.restaurantPlus.expCollection;
        $scope.total = $scope.currentProject.restaurantPlus.total;
        
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
                    $scope.total.planUsd += item.toPai;
                    $scope.total.planNat = $scope.total.planUsd * $scope.currentProject.budget.currency;

                    $scope.total.paidUsd += item.paid;
                    $scope.total.paidNat = $scope.total.paidUsd * $scope.currentProject.budget.currency;
                }
                if(!item.usd){
                    $scope.total.planNat += item.toPai;
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
            $scope.currentProject.restaurantPlus.total = $scope.total;

            // Emit Total Value Changes EVENT
            $scope.$emit('totalValuesChanged');
        }
        // Update total values immediate evoke
        updateTotalValues();

        // Add New Expense Item Fn
        $scope.addNewExpenseItem = function (item) {
          if(item.name != '' && angular.isNumber(item.tariff) && angular.isNumber(item.multiplier) && angular.isNumber(item.paid)){
              // If 'unit' is not defined
              if(item.unit == '' || item.unit == null){
                  item.unit = 'не указан';
              }
              // multiplier correction
              if(item.multiplier <= 0 ){
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
              item.toPai = item.tariff * item.multiplier;
              item.rest = item.toPai - item.paid;
              // Money type check
              if(!item.usd){
                  item.money = $scope.currentProject.budget.nationalMoney;
              } else {
                  item.money = 'USD';
              }

              // Add expense item to expCollection
              $scope.currentProject.restaurantPlus.expCollection.push(item);

              // Update total values
              updateTotalValues();
              // ADD EXPENSE ITEM to DB
              ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/restaurantPlusNewExpItemSave").then(
                  function (data) {
                      $scope.newItem = {};
                      if (_env._dev) {
                          toastr.success('New Expense Item created!');
                      }
                  },
                  function (err) {
                      toastr.error('ERROR: New Expense Item AJAX failed');
                      throw new Error('ERROR: New Expense Item AJAX failed' + err);
                  })
                  .catch(function (err) {
                      toastr.error("ERROR: New Expense Item AJAX failed");
                      $log.error("ERROR: New Expense Item AJAX failed", err);
                  });
          }
          else {
              toastr.error('ERROR: expense input check failed');
              throw new Error('ERROR: expense input check failed' + err);
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
                if(item.multiplier <= 0 ){
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
                item.toPai = item.tariff * item.multiplier;
                item.rest = item.toPai - item.paid;

                // Money type check
                if(!item.usd){
                    item.money = $scope.currentProject.budget.nationalMoney;
                } else {
                    item.money = 'USD';
                }

                // Update total values
                updateTotalValues();

                // SAVE CHANGES of EXPENSE ITEM to DB
                ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/restaurantPlusNewExpItemSave").then(
                    function (data) {
                        $scope.removeTrigger = false;
                        $scope.itemToEdit = {};
                        if (_env._dev) {
                            toastr.success('Expense Item Edited!');
                        }
                    },
                    function (err) {
                        toastr.error('ERROR: New Expense Item AJAX failed');
                        throw new Error('ERROR: New Expense Item AJAX failed' + err);
                    })
                    .catch(function (err) {
                        toastr.error("ERROR: Expense Item Edit AJAX failed");
                        $log.error("ERROR: Expense Item Edit AJAX failed", err);
                    });
            }
            else {
                toastr.error('ERROR: expense input check failed');
                throw new Error('ERROR: expense input check failed' + err);
            }
        };

        // DELETE ITEM
        $scope.deleteExpenseItem = function (index) {
            // Remove from model
            $scope.currentProject.restaurantPlus.expCollection.splice(index, 1);

            // Update total values
            updateTotalValues();

            // SAVE CHANGES in DB
            ResourceService._ajaxRequest("PUT", null, $scope.currentProject, "/restaurantPlusNewExpItemSave").then(
                function (data) {
                    $scope.removeTrigger = false;
                    $scope.itemToEdit = {};
                    if (_env._dev) {
                        toastr.warning('Expense Item removed');
                    }
                },
                function (err) {
                    toastr.error('ERROR: New Expense Item AJAX failed');
                    throw new Error('ERROR: New Expense Item AJAX failed' + err);
                })
                .catch(function (err) {
                    toastr.error("ERROR: Expense Item Edit AJAX failed");
                    $log.error("ERROR: Expense Item Edit AJAX failed", err);
                });
        }

    } // Ctrl End

    return restaurantCtrlModule;
});