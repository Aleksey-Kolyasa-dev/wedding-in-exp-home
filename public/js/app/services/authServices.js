define(['angular'], function (angular) {
    "use strict";
    var authServices = angular.module('authServices', ['toastr', 'ngAnimate']);


    authServices.service('UsersResourceService', ['toastr', '$http', '$q', '$log', '$location', UsersResourceService]);
    authServices.service('UserAuthService', ['toastr', '$window', UserAuthService]);


    function UsersResourceService(toastr, $http, $q, $log, $location, wedURL) {
        return {
            baseURL: 'http://localhost:5000/users/',
            _ajaxRequest: function (method, url, data, keyURL) {
                var self = this;
                var deferred = $q.defer();
                var result = Promise.resolve();

                result.then(function () {
                    switch (method) {
                        case "GET" :
                            if (!url) {
                                $http({url: self.baseURL}).success(function (data) {
                                    deferred.resolve(data);
                                }).error(function (err) {
                                    toastr.error('ERROR: GET method failed');
                                    deferred.reject('ERROR: GET method failed');
                                    throw new Error('ERROR: GET method failed: ' + err);
                                });
                            }
                            if (url) {
                                $http({url: self.baseURL + url}).success(function (data) {
                                    deferred.resolve(data);
                                }).error(function (err) {
                                    toastr.error('ERROR: GET method failed');
                                    deferred.reject('ERROR: GET method failed');
                                    throw new Error('ERROR: GET method failed: ' + err);
                                });
                            }
                            break;

                        case "POST" :
                            if(!keyURL){
                                $http({method: "POST", url: self.baseURL, data: data}).success(function (data) {
                                    deferred.resolve(data);
                                }).error(function (err) {
                                    toastr.error('ERROR: POST method failed');
                                    deferred.reject('ERROR: POST method failed');
                                    throw new Error('ERROR: POST method failed: ' + err);
                                });
                            }
                            if(keyURL){
                                $http({method: "POST", url: self.baseURL + keyURL, data: data}).success(function (data) {
                                    deferred.resolve(data);
                                }).error(function (err) {
                                    toastr.error('ERROR: POST method failed');
                                    deferred.reject('ERROR: POST method failed');
                                    throw new Error('ERROR: POST method failed: ' + err);
                                });
                            }
                            break;

                        case "PUT" :
                            if (!keyURL) {
                                $http({
                                    method: "PUT",
                                    url: self.baseURL + data._id,
                                    data: data
                                }).success(function (data) {
                                    deferred.resolve(data);
                                }).error(function (err) {
                                    toastr.error('ERROR: PUT method failed');
                                    deferred.reject('ERROR: PUT method failed');
                                    throw new Error('ERROR: PUT method failed: ' + err);
                                });
                            }
                            if (keyURL) {
                                if (angular.isString(keyURL)) {
                                    /*switch (keyURL) {
                                        case "/userLoginStatus":*/
                                            $http({
                                                method: "PUT",
                                                url: self.baseURL + data._id + keyURL,
                                                data: data
                                            }).success(function (data) {
                                                deferred.resolve(data);
                                            }).error(function (err) {
                                                toastr.error('ERROR: PUT method failed');
                                                deferred.reject('ERROR: PUT method failed');
                                                throw new Error('ERROR: PUT method failed: ' + err);
                                            });
                                           /* break;*/

                                    }
                                }
                            break;

                        case "DELETE" :
                            $http({method: "DELETE", url: self.baseURL + url}).success(function (data) {
                                deferred.resolve(data);
                                //toastr.warning('DELETE OPS SUCCESS');
                            }).error(function (err) {
                                toastr.error('ERROR: DELETE method failed');
                                deferred.reject('ERROR: DELETE method failed');
                                throw new Error('ERROR: DELETE method failed: ' + err);
                            });
                            break;
                    }
                }).catch(function (err) {
                    toastr.error("ERROR: AJAX ops faild");
                    $log.warn(err);
                });
                return deferred.promise;
            }
        };
    }

    function UserAuthService(toastr, $window) {
        return {
            // User Token Fn.
            _userToken : function (data) {
                // TOKEN CASH OPS.
                if($window.localStorage){
                    $window.localStorage.userToken = angular.toJson({
                        name : data.userName,
                        pass : data.userPassword,
                        init : data.lastLogin
                    });
                }
            }
        };
    }

    return authServices;
});