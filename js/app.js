/* global angular,window */
var imobDbApp = angular.module('imobDbApp', ['angular-gestures', 'ngRoute', 'ngResource', 'loginDbControllers','imoveisDbControllers', 'imoveisDbFilters', 'imoveisDbServices', 'calcController', 'calendarDbControllers', 'syncDbControllers', 'imoveisDbDirectives']);

 
var loginDbControllers = angular.module('loginDbControllers', []);
var syncDbControllers = angular.module('syncDbControllers', ['ui.bootstrap', 'ngAnimate', 'xc.indexedDB']);
var calendarDbControllers = angular.module('calendarDbControllers', ['ui.calendar', 'ui.bootstrap', 'ngDraggable', 'ngAnimate', 'xc.indexedDB']);
var calcController = angular.module('calcController', []);
var imoveisDbControllers = angular.module('imoveisDbControllers', ['ui.bootstrap', 'ngResource', 'ngAnimate', 'xc.indexedDB']);
var imoveisDbDirectives = angular.module('imoveisDbDirectives', []);
var imoveisDbServices = angular.module('imoveisDbServices', []);
var imoveisDbFilters = angular.module('imoveisDbFilters', []);


var options = {};
options.api = {};
options.api.base_url = "http://localhost:3001";
options.api.msgs = {"nottosync":{text:"Não há informações para sincronizar",type:"info"},
                    "syncing":{text:"Aguarde, estamos em sincronização com o servidor!!",type:"warning"},
                    "failtosync":{text:"Falha na sincronização com o servidor!!",type:"danger"},
                    "finalsync":{text:"Sincronização finalizada",type:"success"}
                   };
options.api.equipid = "default";

imobDbApp.config(['$routeProvider', '$locationProvider', 'hammerDefaultOptsProvider',
	function($routeProvider , $locationProvider, hammerDefaultOptsProvider)
	{			
		$routeProvider.
		  when('/', {
				templateUrl: 'partials/home.html',
				controller: 'HomeCtrl',
				access: { requiredAuthentication: true }
			}).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'AdminUserCtrl',
        css: 'css/login.css'
      }).
      when('/logout', {
          templateUrl: 'partials/logout.html',
          controller: 'AdminUserCtrl',
          access: { requiredAuthentication: true  }
      }).
      when('/sync', {
				templateUrl: 'partials/sync.html',
				controller: 'syncCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/clientes', { 
				templateUrl: 'partials/listViewClientes.html',
				controller: 'ClientesCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/clientes/:type', {  
				templateUrl: 'partials/formNewClientes.html',
				controller: 'ClientesEditCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/clientes/:type/:id', { 
				templateUrl: 'partials/formNewClientes.html',
				controller: 'ClientesEditCtrl',	
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/imoveis', { 
				templateUrl: 'partials/listViewImoveis.html',
				controller: 'ImoveisCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/imoveis/:type', {  
				templateUrl: 'partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl',
				access: { requiredAuthentication: true }	
			}).
			when('/cadastro/imoveis/:type/:id', {
				templateUrl: 'partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/contratos', { 
				templateUrl: 'partials/listViewContratos.html',
				controller: 'ContratosCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/contratos/:type', {  
				templateUrl: 'partials/formNewContratos.html',
				controller: 'ContratosEditCtrl',
				access: { requiredAuthentication: true }			
			}).
			when('/cadastro/contratos/:type/:id', {
				templateUrl: 'partials/formNewContratos.html',
				controller: 'ContratosEditCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/eventos', { 
				templateUrl: 'partials/listViewEventos.html',
				controller: 'EventosCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/cadastro/eventos/:type', {  
				templateUrl: 'partials/formNewEventos.html',
				controller: 'EventosEditCtrl',
				access: { requiredAuthentication: true }	
			}).
			when('/cadastro/eventos/:type/:id', {
				templateUrl: 'partials/formNewEventos.html',
				controller: 'EventosEditCtrl',
				access: { requiredAuthentication: true }
			}).						
			when('/unsupported', {
				templateUrl: 'partials/unsupported.html'
			}).
			when('/dashboard', {  
				templateUrl: 'partials/home.html',
				controller: 'ClientesCtrl',
				access: { requiredAuthentication: true }
			}).
			when('/calendario', {  
				templateUrl: 'partials/calendario.html',
				controller: 'CalendarCtrl',
				css: 'css/calendar.css',
				access: { requiredAuthentication: true }
			}).
			when('/calculadoras/emprestimo', {  
				templateUrl: 'partials/calculadoraEmprestimo.html',
				controller: 'calculadoraCtrl',
				access: { requiredAuthentication: false }
			}).
			otherwise({
				redirectTo: '/login'
			});
			
		$locationProvider.html5Mode(true).hashPrefix('!');
		hammerDefaultOptsProvider.set({
        recognizers: [[Hammer.Tap, {time: 100}]]
    });		
	
		//$controllerProvider.register('HomeCtrl', function($scope)
		//{
		    
		//});
	
	}
]);

imobDbApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

imobDbApp.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
         if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
            $rootScope.hidemenu = true;
            $location.path("/login").replace();            
        }
        
        if (nextRoute.access.requiredAuthentication 
            && AuthenticationService.isAuthenticated 
            && $window.sessionStorage.token){        
            $rootScope.hidemenu = false;
            options.api.equipid = $window.sessionStorage.equipid;
        }
    });    
});
