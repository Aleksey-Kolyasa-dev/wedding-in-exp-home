define(['angular'], function (angular) {
    "use strict";
    var newProjectCtrlModule = angular.module('newProjectCtrlModule', ['wedServices']);

    newProjectCtrlModule.controller('newProjectCtrl', newProjectCtrl);
    newProjectCtrlModule.controller('editProjectCtrl', editProjectCtrl);
    /*
    *  NEW PROJECT CTRL
    * */
    function newProjectCtrl($scope, $log, toastr, _env, ResourceService, AppService) {
        $scope.createNewProject = function (newProject) {
            // New Project Constructor
            function NewProjectCtor(project) {
                // INIT DATA
                this.fianceName = project.fianceName;
                this.fianceeName = project.fianceeName;
                this.weddingDate = AppService._dateStringToObject(project.weddingDate);
                this.email = project.email;
                this.telephones = project.telephones;
                this.notes = project.notes;
                this.fianceSideGuests = [];
                this.fianceeSideGuests = [];

                //NOTES
                this.budgetNotes = null;
                this.restNotes = null;
                this.guestsNotes = null;
                this.menuNotes = null;
                this.cakesNotes = null;
                this.plusNotes = null;
                this.decorNotes = null;

                //INTERMEDIATE DATA
                this.useMenuCheck = false;

                // MENU DATA
                this.budget = {
                    budgetUSD : project.wedBudget,
                    budgetNat : 0,
                    nationalMoney : 'units',
                    currency : 1,
                    total : {
                        // TTL SUM ALL PLANS
                        wedPlanTotalNat : 0,
                        wedPlanTotalUsd : 0,

                        // TTL SUM ALL PAID
                        wedPaidTotalNat : 0,
                        wedPaidTotalUsd : 0,

                        // TTL SUM ALL REST
                        wedRestTotalNat : 0,
                        wedRestTotalUsd : 0,

                        // TOTAL WED BUDGET REST by PLAN
                        wedBudgetRestPlanUsd : 0,
                        wedBudgetRestPlanNat : 0,

                        // TOTAL WED BUDGET REST by FACT
                        wedBudgetRestFactUsd : 0,
                        wedBudgetRestFactNat : 0
                    }
                };
                this.restaurant = {
                    name : null,
                    address : null,
                    telephones : null,
                    website : null,
                    guestsQty : 2,
                    quickView : false,
                    quickData : {
                        quickGuestsQty : 2,
                        quickCheck : 0,
                        quickPercent : 0,
                        quickPlugs : 0,
                        planNat : 0,
                        planUsd : 0
                    },
                    generalData : {
                        generalCheck : 0,
                        generalPercent : 0,
                        generalPlugs : 0,

                        sumCheckNat : 0,
                        sumPercentNat : 0,
                        sumPlugsNat : 0,
                        fullCheckNat : 0
                    },
                    total : {
                        planUsd : 0,
                        planNat : 0,
                        paidUsd : 0,
                        paidNat : 0,
                        restUsd : 0,
                        restNat : 0,
                        planTotalUsd : 0,
                        planTotalNat : 0,
                        paidTotalUsd : 0,
                        paidTotalNat : 0,
                        restTotalUsd : 0,
                        restTotalNat : 0
                    }
                };
                this.restaurantMenu = {
                    expCollection : [
                       /* {
                        name : 'ТОРТ', // *<input S
                        portionWeight : 0, // *<input N
                        portionPrice : 0, // *<input N
                        portionQty : 0, // *<input N
                        toPay : 0, // portionPrice * portionQty
                        totalWeight: 0, // portionWeight * portionQty
                        category : null // *<input S
                    }*/
                    ],
                    total : {
                        totalMenuPriceNat : 0, // sum[toPai]
                        totalMenuWeight : 0, // sum[totalWeight]

                        calculatedCheck : 0, // sum[toPay] / guestsQty
                        weightPerGuest : 0 // sum[totalWeight] / guestsQty
                    },
                    categories : [
                        "Холодные закуски",
                        "Салаты",
                        "Горячие закуски",
                        "Основные блюда",
                        "Дисерт",
                        "Напитки А",
                        "Напитки Б/А",
                        "Фуршет",
                        "Инное"
                    ]
                };
                this.restaurantCakes = {
                    expCollection : [
                        /*{
                             name : 'ТОРТ', // *<input S
                             grPerGuest : 0, // *<input N
                             totalKg : 0, // guestsQ * grPerGuest
                             kgPrice : 0, // *<input N
                             toPai : 0, // totalKg * kgPrice
                             paid : 0, // *<input N
                             rest : 0, // toPai - paid
                             usd : false,
                             money : null
                         }*/
                     ],
                    total : {
                        planUsd : 0, // planNat / currency
                        planNat : 0, // sum[toPai]
                        paidUsd : 0, // paidNat / currency
                        paidNat : 0, // sum[paid]
                        paidTotalUsd : 0, //
                        paidTotalNat : 0, //
                        restTotalUsd : 0,
                        restTotalNat : 0
                    }
                };
                this.restaurantPlus = {
                    expCollection : [/*{
                        name : 'ТОРТ',
                        tariff : 200,
                        multiplier : 5,
                        unit : 'kg',
                        toPay : 0,
                        paid : 0,
                        rest : 0,
                        usd : false,
                        money : null
                    }*/],
                    total : {
                        planUsd : 0,
                        planNat : 0,
                        paidUsd : 0,
                        paidNat : 0,
                        paidTotalUsd : 0,
                        paidTotalNat : 0,
                        restTotalUsd : 0,
                        restTotalNat : 0
                    }
                };
                this.decor = {
                    expCollection : [/*{
                     name : 'ТОРТ',
                     tariff : 200,
                     multiplier : 5,
                     unit : 'kg',
                     toPai : 0,
                     paid : 0,
                     rest : 0,
                     usd : false,
                     money : null
                     }*/],
                    total : {
                        planUsd : 0,
                        planNat : 0,
                        paidUsd : 0,
                        paidNat : 0,
                        paidTotalUsd : 0,
                        paidTotalNat : 0,
                        restTotalUsd : 0,
                        restTotalNat : 0
                    }
                };
                this.flower = {
                    expCollection : [/*{
                     name : 'ТОРТ',
                     tariff : 200,
                     multiplier : 5,
                     unit : 'kg',
                     toPai : 0,
                     paid : 0,
                     rest : 0,
                     usd : false,
                     money : null
                     }*/],
                    total : {
                        planUsd : 0,
                        planNat : 0,
                        paidUsd : 0,
                        paidNat : 0,
                        paidTotalUsd : 0,
                        paidTotalNat : 0,
                        restTotalUsd : 0,
                        restTotalNat : 0
                    }
                };
            }

            ResourceService._ajaxRequest("POST", null, new NewProjectCtor(newProject))
                .then(function (project) {
                    // Set newProject to Default for View
                    $scope.newProject = {};
                    // Emit 'newProject' event
                    $scope.$emit('projectsListChange');
                    if(_env._dev){
                        toastr.success("НОВЫЙ ПРОЕКТ СВАДЬБЫ " + project.fianceName + " и " + project.fianceeName + " СОЗДАН УСПЕШНО!");
                    }
                })
                .catch(function (err) {
                    toastr.error("ERROR: Create New Project ops failed");
                    $log.warn("ERROR: Create New Project ops failed", err);
                });
        };
    } // End of newProjectCtrl


    /*
    * EDIT PROJECT CTRL
    * */
    function editProjectCtrl($scope, $log, toastr, _env, ResourceService, AppService) {
        // Default values
        $scope.editProject = {};

        // Budget update Fn
        function budgetUpdate() {
            $scope.editProject.budget.budgetNat = $scope.editProject.budget.budgetUSD * $scope.editProject.budget.currency;
        }

        // On 'editProject' EVENT => get edited project
        $scope.$on('editProject', function (e, args) {
           ResourceService._ajaxRequest("GET", args.id, null, null).then(function (project) {
               project.weddingDate = AppService._objectTodateString(project.weddingDate);
               $scope.editProject = project;
               // Budget update
               budgetUpdate();
           }).catch(function (err) {
               toastr.error("ERROR: GET init data failed");
               $log.warn("ERROR: GET init data failed", err);
           });
        });

        // Apply changes
        $scope.editProjectApply = function(editedProject){
            $scope.deleteProjectTrigger = false;
            if(editedProject.weddingDate.length < 12){
                editedProject.weddingDate = AppService._dateStringToObject(editedProject.weddingDate);
            }
            // Budget update
            budgetUpdate();

            // Save to DB
            ResourceService._ajaxRequest("PUT", null, editedProject, null).then(
                function (project) {
                    $log.log(project);
                    if(_env._dev){
                        toastr.info('PROJECT EDITED WITH SUCCESS');
                    }
                    $scope.$emit('projectsListChange');
                },
                function (err) {
                    toastr.error('ERROR: project Edit & AJAX PUT failed');
                    throw new Error('ERROR: project Edit & AJAX PUT failed' + err);
                });
        };

        $scope.deleteProject = function (id) {
            ResourceService._ajaxRequest("DELETE", id, null, null).then(function (data) {
                if(_env._dev){
                    toastr.warning('PROJECT WAS DELETED');
                }
                $scope.$emit('projectsListChange');
                $scope.deleteProjectTrigger = false;
            }).catch(function (err) {
                toastr.error("ERROR: DELETE PROJECT AJAX failed");
                $log.warn("ERROR: DELETE PROJECT AJAX failed", err);
            });
        };
    }

    return newProjectCtrlModule;
});