define(['angular'], function (angular) {
    "use strict";
    var usersCtrlModule = angular.module('usersCtrlModule', ['wedServices', 'authServices']);

    usersCtrlModule.controller('wedUsersMainCtrl', wedUsersMainCtrl);
    usersCtrlModule.controller('loginCtrl', loginCtrl);
    usersCtrlModule.controller('registrationCtrl', registrationCtrl);


    /*
     * USERS MAIN CTRL
     * */
    function wedUsersMainCtrl($scope, $rootScope, $log, $location, $timeout, toastr, _env, UsersResourceService, AppService) {


    }// Ctrl end


    /*
     * USERS LOGIN CTRL
     * */
    function loginCtrl($scope, $rootScope, $log, $location, $timeout, toastr, _env, UsersResourceService, AppService) {


    }// Ctrl end


    /*
     * USERS REGISTRATION CTRL
     * */
    function registrationCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, _env, UsersResourceService, AppService) {
        function User(user) {
            this.userName = user.name;
            this.userPassword = this.passwordCrypt(user);
            this.userEmail = user.email;
            this.registrationDate = new Date();
            this.isAuth = true;
            this.isOnline = true;
            this.admin = false;
            this.lastLogin = null;
        }

        User.prototype.passwordCrypt = function (user) {
            return user.name + $window.btoa(user.password);
        };

        $scope.doRegister = function (user) {
            // Check if all required fields are fulfilled properly
            if (!user.name || !user.email || !user.password || !user.confirmPassword) {
                toastr.error('ERROR: INVALID REGISTRATION DATA!');
                throw new Error('ERROR: INVALID REGISTRATION DATA!');
            // Passwords inputs must coincide
            } else if (user.password !== user.confirmPassword) {

                toastr.error('ERROR: PASSWORDS NOT COINCIDE!');
                throw new Error('ERROR: PASSWORDS NOT COINCIDE!');

            } else {
                UsersResourceService._ajaxRequest("POST", null, new User(user), null).then(
                    function (data) {
                        if (data.userName) {
                            // Set newProject to Default for View
                            $scope.user = {};
                            if (_env._dev) {
                                toastr.success("NEW USER " + data.userName + " REGISTRED!");
                            }
                        } else {
                            // Case if ERROR.property = 'NAME' returned
                            if(data.property == 'NAME'){
                                toastr.error('ERROR: NAME OCCUPIED');
                                throw new Error('ERROR: NAME OCCUPIED');
                            }
                            // Case if ERROR.property = 'EMAIL' returned
                            if(data.property == 'EMAIL'){
                                toastr.error('ERROR: EMAIL OCCUPIED');
                                throw new Error('ERROR: EMAIL OCCUPIED');
                            }
                        }
                    },
                    function (err) {
                        toastr.error('ERROR, check and try again!');
                        $log.log(err);
                    })
                    .catch(function (err) {
                        toastr.error('ERROR: REGISTER NEW USER "POST" AJAX failed');
                        $log.warn('ERROR: REGISTER NEW USER "POST" AJAX failed', err);
                    });
            }
        };

    }// Ctrl end


    return usersCtrlModule;
});