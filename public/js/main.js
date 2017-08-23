// ENVIRONMENT SWITCH Fn
function _env() {
	// MAIN SET
	var devEnvironment = false;

	// Auto
    return {
        _dev : devEnvironment,
		get _apiURL(){
            if(devEnvironment){
                return 'http://localhost:5000/api/';
            } else {
                return 'https://wedding-in.herokuapp.com/api/';
            }
		},
		get _usersURL(){
            if(devEnvironment){
                return 'http://localhost:5000/users/';
            } else {
                return 'https://wedding-in.herokuapp.com/users/';
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
		'newProjectCtrlModule' 	: '../js/app/controllers/02_projects/02_wedMain_newProjectCtrl',
        'budgetCtrlModule' 		: '../js/app/controllers/02_projects/03_BudgetCtrl',
        'restaurantCtrlModule' 	: '../js/app/controllers/02_projects/04_RestaurantCtrl',
        'decorCtrlModule' 		: '../js/app/controllers/02_projects/05_DecorCtrl',
        'flowerCtrlModule' 		: '../js/app/controllers/02_projects/06_FlowerCtrl',
        'leaderCtrlModule' 		: '../js/app/controllers/02_projects/07_LeaderCtrl',
        'musicCtrlModule' 		: '../js/app/controllers/02_projects/08_MusicCtrl',
        'photoCtrlModule' 		: '../js/app/controllers/02_projects/09_PhotoCtrl',
        'videoCtrlModule' 		: '../js/app/controllers/02_projects/10_VideoCtrl',

		'directives'     		: '../js/app/directives/directives',
		'jQuery'		  		: '../libs/js/jquery.min',
		'jQueryUI'        		: '../libs/js/jquery-ui.min',
		'angular'         		: '../libs/js/angular',
		'angularAnimate'  		: '../libs/js/angular-animate.min',
		'angularToastr'	  		: '../libs/js/angular-toastr.tpls.min',
		'angularRoute'	  		: '../libs/js/angular_route',
		'twitterBootstrap' 		: '../libs/js/bootstrap.min',
		'angularRuLocale'  		: '../libs/js/misc/jquery.ui.datepicker-ru' // 'https://code.angularjs.org/1.3.5/i18n/angular-locale_ru-by'
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
        'decorCtrlModule' : {
            deps : ['controllers']
        },
        'flowerCtrlModule' : {
            deps : ['controllers']
        },
        'leaderCtrlModule' : {
            deps : ['controllers']
        },
		'musicCtrlModule' : {
       		 deps : ['controllers']
    	},
        'photoCtrlModule' : {
            deps : ['controllers']
        },
        'videoCtrlModule' : {
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
				'newProjectCtrlModule',
				'budgetCtrlModule',
				'restaurantCtrlModule',
				'decorCtrlModule',
				'flowerCtrlModule',
				'leaderCtrlModule',
				'musicCtrlModule',
                'photoCtrlModule',
                'videoCtrlModule',


				'directives'
			]
		}
	},

	deps : ['../js/bootstrap']

});