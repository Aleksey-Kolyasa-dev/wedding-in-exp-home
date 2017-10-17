define(['angular'], function (angular) {
    "use strict";
    var wedDirectives = angular.module("wedDerictives", []);
    //Date Picker
    wedDirectives.directive("directiveDatepicker", function () {
        return {
            require: 'ngModel',
            link : function (scope, element, attrs, ngModelCtrl) {
                jQuery(element).datepicker({
                        changeYear: true,
                        changeMonth: true,
                        dateFormat: 'dd.mm.yy',
                        yearRange: '2000:2020',

                        onSelect: function (dateText, inst) {
                            ngModelCtrl.$setViewValue(dateText);
                            scope.$apply();
                        }
                });
            }
        };
    });
    // Sortable
    wedDirectives.directive('directiveSortable', function () {
        return {
            link: function (scope, element, attrs) {
                jQuery(element).resizable();
            }
        }
    });

    //



    return wedDirectives;
});