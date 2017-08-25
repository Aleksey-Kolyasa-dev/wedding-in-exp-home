define(['angular'], function (angular) {
    "use strict";
    var usersCtrlModule = angular.module('usersCtrlModule', ['wedServices', 'authServices']);

    usersCtrlModule.controller('wedUsersMainCtrl', wedUsersMainCtrl);
    usersCtrlModule.controller('loginCtrl', loginCtrl);
    usersCtrlModule.controller('registrationCtrl', registrationCtrl);


    /*
     * USERS MAIN CTRL
     * */
    function wedUsersMainCtrl($scope, $rootScope, $log, $window, $location, $timeout, toastr, UsersResourceService, AppService) {

        // ON-EVENT: USER LOG OUT
        $scope.$on('logout', function () {

            if ($window.localStorage.userToken) {
                // remove token
                $window.localStorage.removeItem("userToken");
            }

            var request = {
                _id: $scope.currentUser._id,
                name: $scope.currentUser.realName,
                isLogged: false,
                isAuth: false
            };

            UsersResourceService._ajaxRequest("PUT", null, request, '/logout').catch(function (err) {
                toastr.error('USER LOGOUT AJAX FAILED!');
                $log.error('USER LOGOUT AJAX FAILED!', err);
            });
        });

        // ON-EVENT: REGISTRATION SUCCESS -> EVENT: Do LOGIN -> loginCtrl
        $scope.$on('registrationSuccess', function (event, data) {
            $scope.$broadcast('doLogin', data);
        });

    }// Ctrl end


    /*
     * USERS LOGIN CTRL
     * */
    function loginCtrl($scope, $window, $log, $location, $timeout, toastr, UsersResourceService, ResourceService, UserAuthService) {

        // DO LOGIN Fn
        $scope.doLogin = function (data) {

            if (!data.login || !data.password) {
                toastr.error('ERROR: INVALID LOGIN INPUT!');
                throw new Error('ERROR: INVALID LOGIN INPUT!');
            } else {

                var request = {
                    login: data.login,
                    password: $window.btoa(data.login + data.password)
                };

                // Do Login
                UsersResourceService._ajaxRequest("POST", null, request, '/login').then(
                    function (data) {
                        if (data._id && data.login && data.password) {

                            if (data.isAuth && data.isLogged) {
                                // EVENT: USER LOGGED IN -> wedMainCtrl
                                $scope.$emit('LoggedIn', data);

                                // Reset View model
                                $scope.user = {};

                                // Make User Token
                                UserAuthService._userToken(data);

                            } else {
                                $timeout(function () {
                                    $location.path('/start');
                                    toastr.error('LOGIN FAILED!');
                                    throw new Error('LOGIN FAILED!');
                                }, 300);
                            }

                        } else {
                            // Case if ERROR.property = 'USER'
                            if (data.property == 'USER') {
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

        // ON-EVENT - do login <- wedUsersMainCtrl
        $scope.$on('doLogin', function (event, data) {
           if (data.login && data.password) {
               $scope.doLogin(data);
           }
       });

        // ON-LOAD check USER TOKEN
        if ($window.localStorage.userToken) {
            var token = angular.fromJson($window.localStorage.userToken);

            // If less then 12 hrs since last login
            if (Date.now() - new Date(token.init) < 1000 * 60 * 60 * 12) {
                var user = {login: token.login, password: $window.atob(token.pass).slice(token.login.length)};
                // Do login
                $scope.doLogin(user);
            } else {
                // Else - remove token
                $window.localStorage.removeItem("userToken");
            }
        }

        // VISITOR ACCESS By KEY Fn
        $scope.accessByKey = function (key) {
            var request = { key: key };

            ResourceService._ajaxRequest("POST", null, request, "/AccessKey")
                .then(function (data) {
                    if (!data._id) {
                        toastr.error('PROJECT NOT FOUND!');
                        throw new Error('PROJECT NOT FOUND!');
                    } else {
                        // EVENT: ACCESS APPROVED -> wedMainCtrl
                        $scope.$emit('AccessApproved', data);
                    }
                })
                .catch(function (err) {
                toastr.error('VISITOR ACCESS DENIED!');
                $log.error('VISITOR ACCESS DENIED!', err);
            });
        }

    }// Ctrl end


    /*
     * USERS REGISTRATION CTRL
     * */
    function registrationCtrl($scope, $rootScope, $log, $location, $window, $timeout, toastr, UsersResourceService, AppService) {

        // NEW USER REGISTRATION Fn
        $scope.doRegister = function (user) {
            // Check if all required fields are fulfilled properly
            if (!user.login || !user.email || !user.password || !user.confirmPassword || !user.name) {
                toastr.error('ERROR: INVALID REGISTRATION DATA!');
                throw new Error('ERROR: INVALID REGISTRATION DATA!');

            // Passwords inputs must coincide
            } else if (user.password !== user.confirmPassword) {
                toastr.error('ERROR: PASSWORDS NOT COINCIDE!');
                throw new Error('ERROR: PASSWORDS NOT COINCIDE!');

            } else {

                // InterData for AUTO-LOGIN
                var interData = {
                    login : user.login,
                    password : user.password
                };

                // Modify password
                user.password = $window.btoa(user.login + user.password);

                UsersResourceService._ajaxRequest("POST", null, user, null).then(
                    function (data) {
                        if (data.login) {
                            // RESET View model
                            $scope.user = {};

                            // EVENT - Do AUTO-LOGIN if registration success -> wedUsersMainCtrl -> loginCtrl
                            $scope.$emit('registrationSuccess', interData);

                            if (_env()._dev) {
                                toastr.success("NEW USER " + data.name + " REGISTRED!");
                            }
                        } else {
                            // Case if ERROR.property = 'NAME'
                            if (data.property == 'LOGIN') {
                                toastr.error(data.message);
                                throw new Error(data.message);
                            }
                            // Case if ERROR.property = 'EMAIL'
                            if (data.property == 'EMAIL') {
                                toastr.error(data.message);
                                throw new Error(data.message);
                            }
                            // Case if ERROR.property = 'VALIDATION'
                            if (data.property == 'VALIDATION') {
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