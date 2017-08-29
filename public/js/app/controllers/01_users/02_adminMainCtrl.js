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
        $scope.adminViewMainMenu = 'main';
        $scope.adminMode = function () {
            if($scope.currentUser.isAdmin){
                $location.path('admin');
                $scope.dynamicBackground = 'projects_main';
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
                case "patchNotes" :
                    $scope.subView = view;
                    break;
            }
        };
    }// Ctrl end

    /*
     * MAIN CTRL
     * */
    function patchNoteCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, UsersResourceService, AppService) {


        // Notes Save
        $scope.noteSave = function (note) {
            note.type = 'patch';
            note.date = new Date();
            note.version = $scope.version;

            var request = {
                _id: $scope.currentProject._id,
                key: "nnnn",
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