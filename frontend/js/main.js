// ENVIRONMENT SWITCH Fn
function _env() {
    // MAIN SET
    var devEnvironment = false;

    // Auto
    return {
        _dev : devEnvironment,
        get _apiURL(){
            if(devEnvironment){
                return 'http://localhost:80/api/';
            } else {
                // return 'http://wedding-in.com.ua/api/';
                return 'https://wedding-in-home.herokuapp.com/api/';
            }
        },
        get _usersURL(){
            if(devEnvironment){
                return 'http://localhost:80/users/';
            } else {
                // return 'http://wedding-in.com.ua/users/';
                return 'https://wedding-in-home.herokuapp.com/users/';
            }
        },
        get _angularRuLocale(){
            if(devEnvironment){
                return '../libs/js/misc/jquery.ui.datepicker-ru';
            } else {
                return 'https://code.angularjs.org/1.3.5/i18n/angular-locale_ru-by';
            }
        }
    };
}

// Require.js main settings
require.config({
    baseUrl : '',
    paths :
        {
            'app'             		: '../js/app/app',
            'projServices'        		: '../js/app/services/projectServices',
            'authServices'          : '../js/app/services/userServices',
            'controllers'     		: '../js/app/controllers/01_wedMainCtrl',
            'usersCtrlModule'    	: '../js/app/controllers/01_users/01_usersMainCtrl',
            'adminCtrlModule'    	: '../js/app/controllers/01_users/02_adminMainCtrl',
            'newProjectCtrlModule' 	: '../js/app/controllers/02_projects/02_wedMain_newProjectCtrl',
            'budgetCtrlModule' 		: '../js/app/controllers/02_projects/03_BudgetCtrl',
            'restaurantCtrlModule' 	: '../js/app/controllers/02_projects/04_RestaurantCtrl',
            'arrangementCtrlModule' : '../js/app/controllers/02_projects/05_ArrangementCtrl',
            'programCtrlModule'     : '../js/app/controllers/02_projects/06_ProgramCtrl',
            'filmingCtrlModule'     : '../js/app/controllers/02_projects/07_FilmingCtrl',

            'socials'     : '../js/app/socials/likely',


            'registrationCtrlModule'     : '../js/app/controllers/02_projects/08_RegistrationCtrl',
            'marriageCtrlModule'     : '../js/app/controllers/02_projects/09_MarriageCtrl',
            'transportCtrlModule'     : '../js/app/controllers/02_projects/10_TransportCtrl',


            'dressCtrlModule' 		: '../js/app/controllers/02_projects/11_DressCtrl',
            'partyCtrlModule' 		: '../js/app/controllers/02_projects/12_PartyCtrl',

            'otherCtrlModule'     : '../js/app/controllers/02_projects/13_OtherCtrl',

            'directives'     		: '../js/app/directives/directives',
            'jQuery'		  		: '../libs/js/jquery.min',
            'jQueryUI'        		: '../libs/js/jquery-ui.min',
            'angular'         		: '../libs/js/angular',
            'angularAnimate'  		: '../libs/js/angular-animate.min',
            'angularToastr'	  		: '../libs/js/angular-toastr.tpls.min',
            'angularRoute'	  		: '../libs/js/angular_route',
            'twitterBootstrap' 		: '../libs/js/bootstrap.min',
            'angularRuLocale'  		: _env()._angularRuLocale // 'https://code.angularjs.org/1.3.5/i18n/angular-locale_ru-by'
        },

    shim :
        {
            'jQueryUI' : {
                deps : ['jQuery'],
                exports : 'jQueryUI'
            },
            'angular' : {
                deps : ['jQueryUI'],
                exports : 'angular'
            },
            'angularRoute' : {
                deps : ['angular'],
                exports : 'angularRoute'
            },
            'angularAnimate' : {
                deps : ['angularRoute'],
                exports : 'angularAnimate'
            },
            'angularToastr' : {
                deps : ['angularAnimate'],
                exports : 'angularToastr'
            },
            'usersCtrlModule' : {
                deps : ['controllers']
            },
            'adminCtrlModule' : {
                deps : ['controllers']
            },
            'newProjectCtrlModule' : {
                deps : ['controllers'],
                exports : 'newProjectCtrlModule'
            },
            'budgetCtrlModule' : {
                deps : ['controllers']
            },
            'restaurantCtrlModule' : {
                deps : ['controllers']
            },
            'arrangementCtrlModule' : {
                deps : ['controllers']
            },
            'filmingCtrlModule' : {
                deps : ['controllers']
            },
            'registrationCtrlModule' : {
                deps : ['controllers']
            },
            'marriageCtrlModule' : {
                deps : ['controllers']
            },
            'transportCtrlModule' : {
                deps : ['controllers']
            },
            'dressCtrlModule' : {
                deps : ['controllers']
            },
            'partyCtrlModule' : {
                deps : ['controllers']
            },
            'otherCtrlModule' : {
                deps : ['controllers']
            },

            'twitterBootstrap' : ['jQuery'],
            'app' : {
                deps : [
                    'angularToastr',
                    'angularRoute',
                    'twitterBootstrap',

                    'projServices',
                    'authServices',

                    'usersCtrlModule',
                    'adminCtrlModule',

                    'newProjectCtrlModule',

                    'budgetCtrlModule',
                    'restaurantCtrlModule',
                    'arrangementCtrlModule',
                    'programCtrlModule',
                    'filmingCtrlModule',
                    'registrationCtrlModule',
                    'marriageCtrlModule',
                    'transportCtrlModule',
                    'dressCtrlModule',
                    'partyCtrlModule',
                    'otherCtrlModule',

                    'directives'
                ]
            }
        },

    deps : ['../js/bootstrap']

});