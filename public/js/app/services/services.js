define(['angular'], function (angular) {
    "use strict";
    var wedServices = angular.module('wedServices', ['toastr', 'ngAnimate']);

    //wedServices.constant('wedURL', 'http://localhost:2403/wedding/');
    wedServices.service('ResourceService', ['toastr', '$http', '$q', '$log', '$location', ResourceService]);
    wedServices.service('AppService', ['toastr', AppService]);

    function ResourceService(toastr, $http, $q, $log, $location, wedURL) {
        return {
            // 'http://localhost:2403/wedding/'
            // 'http://localhost:27017/weddings/'
            // 'https://mlab.com/databases/alkol_db/collections/weddings'
            baseURL: 'http://localhost:5000/api/',
            _ajaxRequest: function (method, url, data, keyURL) {
                var self = this;
                var deferred = $q.defer();
                var result = Promise.resolve();

                result.then(function () {
                    switch (method) {
                        case "GET" :
                            if (!url/* && method == "GET"*/) {

                                $http({url: self.baseURL}).success(function (data) {
                                    deferred.resolve(data);
                                }).error(function (err) {
                                    toastr.error('ERROR: GET method failed');
                                    deferred.reject('ERROR: GET method failed');
                                    throw new Error('ERROR: GET method failed: ' + err);
                                });

                            }
                            if (url/* && method == "GET"*/) {

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
                            $http({method: "POST", url: self.baseURL, data: data}).success(function (data) {
                                deferred.resolve(data);
                            }).error(function (err) {
                                toastr.error('ERROR: POST method failed');
                                deferred.reject('ERROR: POST method failed');
                                throw new Error('ERROR: POST method failed: ' + err);
                            });
                            break;

                        case "PUT" :
                            if(!keyURL){
                                $http({method: "PUT", url: self.baseURL + data._id, data: data}).success(function (data) {
                                    deferred.resolve(data);
                                }).error(function (err) {
                                    toastr.error('ERROR: PUT method failed');
                                    deferred.reject('ERROR: PUT method failed');
                                    throw new Error('ERROR: PUT method failed: ' + err);
                                });
                            }
                            if(keyURL){
                                if(angular.isString(keyURL)){
                                    switch (keyURL){
                                        case "/fianceSideGuests":
                                            $http({method: "PUT", url: self.baseURL + data._id + keyURL, data: data}).success(function (data) {
                                                deferred.resolve(data);
                                            }).error(function (err) {
                                                toastr.error('ERROR: PUT method failed');
                                                deferred.reject('ERROR: PUT method failed');
                                                throw new Error('ERROR: PUT method failed: ' + err);
                                            });
                                        break;

                                        case "/fianceeSideGuests":
                                            $http({method: "PUT", url: self.baseURL + data._id + keyURL, data: data}).success(function (data) {
                                                deferred.resolve(data);
                                            }).error(function (err) {
                                                toastr.error('ERROR: PUT method failed');
                                                deferred.reject('ERROR: PUT method failed');
                                                throw new Error('ERROR: PUT method failed: ' + err);
                                            });
                                        break;

                                    }
                                }

                            }
                            break;

                        case "DELETE" :
                            $http({method: "DELETE", url: self.baseURL + url}).success(function (data) {
                                //deferred.resolve(data);
                                toastr.info('User with name ' + data.name + ' was deleted');
                            }).error(function (err) {
                                toastr.error('DELETE: PUT method failed');
                                deferred.reject('DELETE: PUT method failed');
                                throw new Error('DELETE: PUT method failed: ' + err);
                            });
                            break;
                    }


                }).catch(function (err) {
                    toastr.error("ERROR: AJAX ops faild");
                    $log.warn(err);
                });
                return deferred.promise;
            },
        };
    }

    function AppService(toastr) {
        return {
            // Transform date String "dd.mm.yyyy" to Date Obj.
            _dateStringToObject: function (dateString) {
                if (angular.isString(dateString)) {
                    var dateArr = dateString.split('.');
                    return new Date(dateArr[2], dateArr[1] - 1, dateArr[0]);
                }
                else {
                    toastr.error('ERROR: Date transformation error');
                    throw new Error('ERROR: Date transformation error');
                }
            },

        };
    }

    return wedServices;
});