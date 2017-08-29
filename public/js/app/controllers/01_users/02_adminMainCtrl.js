define(['angular'], function (angular) {
    "use strict";
    var adminCtrlModule = angular.module('adminCtrlModule', ['wedServices', 'authServices']);


    adminCtrlModule.controller('adminMainCtrl', adminMainCtrl);
    adminCtrlModule.controller('mainCtrl', mainCtrl);
    adminCtrlModule.controller('patchNoteCtrl', patchNoteCtrl);



    /*
     * ADMIN MAIN CTRL
     * */
    function adminMainCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, UsersResourceService, AppService) {
        $scope.adminMode = function () {
            if($scope.currentUser.isAdmin){
                $location.path('admin');
                $scope.dynamicBackground = 'projects_main';
                $scope.currentProjectView.mainMenu = 'main';

            }
        };

        // Project LEFT MENU navigation
        $scope.projectView = function (view) {
            switch (view) {

                case "main" :
                    $scope.currentProjectView.mainMenu = view;
                    $scope.subView = "announcement";
                    break;

                case "restaurant" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

                case "arrangement" :
                    $scope.currentProjectView.mainMenu = view;
                    break;

            }
        };

        // Subview shift Fn
        $scope.subViewShift = function (view) {
            switch (view) {
                case "announcement" :
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
            }
        };

    }// Ctrl end

    /*
     * MAIN CTRL
     * */
    function mainCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, UsersResourceService, AppService) {
        $scope.subView = 'patchNotes';
        // Subview shift Fn
        $scope.subViewShift = function (view) {
            switch (view) {
                case "patchNotes" :
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
            }
        };
    }// Ctrl end

    /*
     * MAIN CTRL
     * */
    function patchNoteCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, UsersResourceService, AppService) {
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
    }// Ctrl end



    return adminCtrlModule;
});