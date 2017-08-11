define(['angular'], function (angular) {
    "use strict";
    var wedServices = angular.module('wedServices', ['toastr', 'ngAnimate']);

    wedServices.service('_env', [_env]);
    wedServices.service('ResourceService', ['toastr', '$http', '$q', '$log', '$location', ResourceService]);
    wedServices.service('AppService', ['toastr', AppService]);

    function _env() {
        return {
            _dev : true
            };
    }

    function ResourceService(toastr, $http, $q, $log, $location, wedURL) {
        return {
            baseURL: 'http://localhost:5000/api/',
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
                            $http({method: "POST", url: self.baseURL, data: data}).success(function (data) {
                                deferred.resolve(data);
                            }).error(function (err) {
                                toastr.error('ERROR: POST method failed');
                                deferred.reject('ERROR: POST method failed');
                                throw new Error('ERROR: POST method failed: ' + err);
                            });
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
                                    switch (keyURL) {
                                        case "/fianceSideGuests":
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
                                            break;

                                        case "/fianceeSideGuests":
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
                                            break;

                                        case "/budget":
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
                                            break;

                                        case "/budgetNotes":
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
                                            break;

                                        case "/restNotes":
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
                                            break;

                                        case "/guestsNotes":
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
                                            break;

                                        case "/menuNotes":
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
                                            break;

                                        case "/cakesNotes":
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
                                            break;

                                        case "/plusNotes":
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
                                            break;

                                        case "/decorNotes":
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
                                            break;

                                            case "/flowerNotes":
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
                                            break;

                                        case "/quickView":
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
                                            break;

                                        case "/quickDataSave":
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
                                            break;

                                        case "/useMenuCheckDataSave":
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
                                            break;

                                        case "/generalDataSave":
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
                                            break;

                                        case "/restaurantMenuDataSave":
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
                                            break;

                                        case "/restaurantCakesDataSave":
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
                                            break;

                                        case "/restaurantPlusNewExpItemSave":
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
                                            break;

                                        case "/decorDataSave":
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
                                            break;

                                        case "/flowerDataSave":
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
                                            break;


                                    }
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
            _objectTodateString: function (dateString) {
                if (angular.isString(dateString)) {
                    var date = new Date(dateString);
                    var dateArr = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
                    if(dateArr[0] < 10){
                        dateArr[0] = "0" + dateArr[1];
                    }
                    if(dateArr[1] < 10){
                        dateArr[1] = "0" + dateArr[1];
                    }
                    return dateArr.join('.');
                }
                else {
                    toastr.error('ERROR: Date transformation error');
                    throw new Error('ERROR: Date transformation error');
                }
            }
        };
    }

    return wedServices;
});