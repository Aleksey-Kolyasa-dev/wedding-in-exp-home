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
    function loginCtrl($scope, $window, $log, $location, $timeout, toastr, _env, UsersResourceService, AppService) {

        // DO LOGIN Fn
        $scope.doLogin = function(data){
            if(!data.name || !data.password){
                toastr.error('ERROR: INVALID LOGIN INPUT!');
                throw new Error('ERROR: INVALID LOGIN INPUT!');
            } else {
                // Prepare request Obj.
                var request = {
                    name : data.name,
                    password : data.name + $window.btoa(data.password)
                };
                // Do Login
                UsersResourceService._ajaxRequest("POST", null, request, '/login').then(
                    function (data) {
                        if (data._id && data.userName && data.userPassword) {
                            // Do EVENT - USER IS LOGGED IN and Authorized
                            if(data.isAuth && data.isLogged){
                                $scope.$emit('LoggedIn', data);
                                $log.log(data);

                                // Set newProject to Default for View
                                $scope.user = {};

                                toastr.success("WELCOME DEAR " + data.userName + " !");

                            } else {
                                $timeout(function () {
                                    $location.path('/404');
                                },300);
                            }
                        } else {
                            // Case if ERROR.property = 'USER'
                            if(data.property == 'USER'){
                                toastr.error(data.message);
                                throw new Error(data.message);
                            }
                        }
                    },
                    function (err) {
                        toastr.error('ERROR, check and try again!');
                        $log.log(err);
                    })
                    .catch(function (err) {
                        toastr.error('ERROR: LOGIN AJAX failed');
                        $log.warn('ERROR: LOGIN AJAX failed', err);
                    });
            }

        };



    }// Ctrl end


    /*
     * USERS REGISTRATION CTRL
     * */
    function registrationCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, _env, UsersResourceService, AppService) {

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
                // Modify password
                user.password = user.name + $window.btoa(user.password);

                UsersResourceService._ajaxRequest("POST", null, user, null).then(
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
                                toastr.error(data.message);
                                throw new Error(data.message);
                            }
                            // Case if ERROR.property = 'EMAIL' returned
                            if(data.property == 'EMAIL'){
                                toastr.error(data.message);
                                throw new Error(data.message);
                            }
                            // Case if ERROR.property = 'VALIDATION' returned
                            if(data.property == 'VALIDATION'){
                                toastr.error(data.message);
                                throw new Error(data.message);
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