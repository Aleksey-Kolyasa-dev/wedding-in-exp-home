define(['angular'], function (angular) {
    "use strict";
    var adminCtrlModule = angular.module('adminCtrlModule', ['wedServices', 'authServices']);


    adminCtrlModule.controller('adminMainCtrl', adminMainCtrl);
    adminCtrlModule.controller('mainCtrl', mainCtrl);
    adminCtrlModule.controller('patchCtrl', patchCtrl);



    /*
     * ADMIN MAIN CTRL
     * */
    function adminMainCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, UsersResourceService, AppService) {
        $scope.adminViewMainMenu = 'main';
        $scope.adminMode = function () {
            if($scope.currentUser.isAdmin){
                $location.path('admin');
            }
        };

        // Project LEFT MENU navigation
        $scope.adminMainViewShift = function (view) {
            switch (view) {

                case "main" :
                    $scope.adminViewMainMenu = view;
                    $scope.subView = "patchNotes";
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
                case "svrAnnouncements" :
                    $scope.subView = view;
                    break;
                case "patchNotes" :
                    $scope.subView = view;
                    break;
                case "patches" :
                    $scope.subView = view;
                    break;
            }
        };
    }// Ctrl end

    /*
     * MAIN CTRL
     * */
    function patchCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, UsersResourceService, AppService) {
        // Announcement Send
        $scope.announcementSend = function (note) {
            note.type = 'announcement';
            note.date = new Date();

            var request = {
                _id: $scope.currentProject._id,
                keyURL : "/admin/announcement",
                data : note
            };

            // SAVE CHANGES in DB
            UsersResourceService._ajaxRequest("POST", null, request, request.keyURL).then(
                function (data) {
                    if (_env()._dev) {
                        toastr.info('SENT!');
                    } else {
                        toastr.info('OK');
                    }
                },
                function (err) {
                    toastr.error('ERROR: ANNOUNCEMENT  AJAX failed');
                    throw new Error('ERROR: ANNOUNCEMENT  AJAX failed');
                })
                .catch(function (err) {
                    toastr.error('ERROR: ANNOUNCEMENT  AJAX failed');
                    $log.error('ERROR: ANNOUNCEMENT  AJAX failed', err);
                });
        };


        // Patch Note Send
        $scope.patchNoteSend = function (note) {
            note.type = 'patch';
            note.date = new Date();
            note.version = $scope.version;

            var request = {
                _id: $scope.currentProject._id,
                keyURL : "/admin/patchNotes",
                data : note
            };

            // SAVE CHANGES in DB
            UsersResourceService._ajaxRequest("POST", null, request, request.keyURL).then(
                function (data) {
                    if (_env()._dev) {
                        toastr.info('PATCHED!');
                    } else {
                        toastr.info('OK');
                    }
                },
                function (err) {
                    toastr.error('ERROR: PATCH Notes AJAX failed');
                    throw new Error('ERROR: PATCH Notes AJAX failed');
                })
                .catch(function (err) {
                    toastr.error('ERROR: PATCH Notes AJAX failed');
                    $log.error('ERROR: PATCH Notes AJAX failed', err);
                });
        };




    }// Ctrl end



    return adminCtrlModule;
});