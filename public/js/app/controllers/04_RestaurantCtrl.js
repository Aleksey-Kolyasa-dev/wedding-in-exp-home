define(['angular'], function (angular) {
    "use strict";
    var restaurantCtrlModule = angular.module('restaurantCtrlModule', ['wedServices']);

    restaurantCtrlModule.controller('restaurantMainCtrl', restaurantMainCtrl);

    function restaurantMainCtrl($scope, $log, toastr, _env, ResourceService) {
        // Default subView
        $scope.subView = "guests";

        // Subview shift Fn
        $scope.subViewShift = function (view) {
            switch (view) {
                case "guests" :
                    $scope.subView = view;
                    break;
                case "restaurant" :
                    $scope.subView = view;
                    break;
            }
        };

        // Add new guests Fn
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
                                    toastr.success('GUEST ADD SUCCESS');
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
                                    toastr.success('GUEST ADD SUCCESS');
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

                    var interGeneral = $scope.currentProject.restaurant.guestsQty * $scope.currentProject.restaurant.generalData.generalCheck + $scope.currentProject.restaurant.guestsQty * $scope.currentProject.restaurant.generalData.generalPlugs;
                    $scope.currentProject.restaurant.total.planNat = (interGeneral / 100) * $scope.currentProject.restaurant.generalData.generalPercent + interGeneral;

                    return result;
                }
            }
            else {
                var interQuick = $scope.currentProject.restaurant.quickData.quickGuestsQty * $scope.currentProject.restaurant.quickData.quickCheck + $scope.currentProject.restaurant.quickData.quickGuestsQty * $scope.currentProject.restaurant.quickData.quickPlugs;
                $scope.currentProject.restaurant.total.planNat = (interQuick / 100) * $scope.currentProject.restaurant.quickData.quickPercent + interQuick;

                return $scope.currentProject.restaurant.quickData.quickGuestsQty;
            }
        };

        // Quick View ops.
        $scope.quickView = function (project) {
            project.restaurant.quickView = !project.restaurant.quickView;

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
                });
        };

        // Restaurant Data save Fn
        $scope.restDataSave = function (data) {
            // Case for GENERAL DATA AJAX SAVE
            if (!arguments.length) {
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

        // Trigger for "SAVE" btn behavior
        $scope.saveHideTrigger = function () {
            $scope.saveHide = false;
        };

        // Display General Restaurant Data filter
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
    } // Ctrl End

    return restaurantCtrlModule;
});