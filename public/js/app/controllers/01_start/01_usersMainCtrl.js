define(['angular'], function (angular) {
    "use strict";
    var usersCtrlModule = angular.module('usersCtrlModule', ['wedServices']);

    usersCtrlModule.controller('wedUsersMainCtrl', wedUsersMainCtrl);


    /*
     * USERS MAIN CTRL
     * */
    function wedUsersMainCtrl($scope, $rootScope, $log, $location, $timeout, toastr, _env, ResourceService, AppService) {


    }// Ctrl end




    return usersCtrlModule;
});