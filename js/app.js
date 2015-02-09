/* global angular,window */
var imobDbApp = angular.module('imobDbApp', ['angular-gestures', 'ngRoute', 'ngResource', 'loginDbControllers','imoveisDbControllers', 'imoveisDbFilters', 'imoveisDbServices', 'calcController', 'calendarDbControllers']);

imobDbApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

imobDbApp.config(['$routeProvider', '$locationProvider', 'hammerDefaultOptsProvider',
	function($routeProvider , $locationProvider, hammerDefaultOptsProvider)
	{			
		$routeProvider.
			when('/home', {
				templateUrl: 'partials/home.html',
				controller: 'HomeCtrl',
				access: { requiredLogin: true }
			}).
      when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'AdminUserCtrl',
        css: 'css/login.css',
        access: { requiredLogin: false }
      }).
      when('/logout', {
          templateUrl: 'partials/logout.html',
          controller: 'AdminUserCtrl',
          access: { requiredLogin: true }
      }).
			when('/cadastro/clientes', { 
				templateUrl: 'partials/listViewClientes.html',
				controller: 'ClientesCtrl',
				access: { requiredLogin: true }
			}).
			when('/cadastro/clientes/:type', {  
				templateUrl: 'partials/formNewClientes.html',
				controller: 'ClientesEditCtrl',
				access: { requiredLogin: true }
			}).
			when('/cadastro/clientes/:type/:id', { 
				templateUrl: 'partials/formNewClientes.html',
				controller: 'ClientesEditCtrl',	
				access: { requiredLogin: true }
			}).
			when('/cadastro/imoveis', { 
				templateUrl: 'partials/listViewImoveis.html',
				controller: 'ImoveisCtrl',
				access: { requiredLogin: true }
			}).
			when('/cadastro/imoveis/:type', {  
				templateUrl: 'partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl',
				access: { requiredLogin: true }	
			}).
			when('/cadastro/imoveis/:type/:id', {
				templateUrl: 'partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl',
				access: { requiredLogin: true }
			}).
			when('/cadastro/contratos', { 
				templateUrl: 'partials/listViewContratos.html',
				controller: 'ContratosCtrl',
				access: { requiredLogin: true }
			}).
			when('/cadastro/contratos/:type', {  
				templateUrl: 'partials/formNewContratos.html',
				controller: 'ContratosEditCtrl',
				access: { requiredLogin: true }			
			}).
			when('/cadastro/contratos/:type/:id', {
				templateUrl: 'partials/formNewContratos.html',
				controller: 'ContratosEditCtrl',
				access: { requiredLogin: true }
			}).
			when('/cadastro/eventos', { 
				templateUrl: 'partials/listViewEventos.html',
				controller: 'EventosCtrl',
				access: { requiredLogin: true }
			}).
			when('/cadastro/eventos/:type', {  
				templateUrl: 'partials/formNewEventos.html',
				controller: 'EventosEditCtrl',
				access: { requiredLogin: true }	
			}).
			when('/cadastro/eventos/:type/:id', {
				templateUrl: 'partials/formNewEventos.html',
				controller: 'EventosEditCtrl',
				access: { requiredLogin: true }
			}).						
			when('/unsupported', {
				templateUrl: 'partials/unsupported.html'
			}).
			when('/dashboard', {  
				templateUrl: 'partials/home.html',
				controller: 'ClientesCtrl',
				access: { requiredLogin: true }
			}).
			when('/calendario', {  
				templateUrl: 'partials/calendario.html',
				controller: 'CalendarCtrl',
				css: 'css/calendar.css',
				access: { requiredLogin: true }
			}).
			when('/calculadoras/emprestimo', {  
				templateUrl: 'partials/calculadoraEmprestimo.html',
				controller: 'calculadoraCtrl',
				access: { requiredLogin: false }
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

imobDbApp.run(function($rootScope, $location, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        if (nextRoute.access.requiredLogin && !AuthenticationService.isLogged) {
            $location.path("/login").replace();
        }
    });
});
		
// Registering a directive after app bootstrap
imobDbApp.directive('head', ['$rootScope','$compile',
    function($rootScope, $compile){
        return {
            restrict: 'E',
            link: function(scope, elem){
                var html = '<link rel="stylesheet" ng-repeat="(routeCtrl, cssUrl) in routeStyles" ng-href="{{cssUrl}}" />';
                elem.append($compile(html)(scope));
                scope.routeStyles = {};
                $rootScope.$on('$routeChangeStart', function (e, next, current) {
                    if(current && current.$$route && current.$$route.css){
                        if(!angular.isArray(current.$$route.css)){
                            current.$$route.css = [current.$$route.css];
                        }
                        angular.forEach(current.$$route.css, function(sheet){
                            delete scope.routeStyles[sheet];
                        });
                    }
                    if(next && next.$$route && next.$$route.css){
                        if(!angular.isArray(next.$$route.css)){
                            next.$$route.css = [next.$$route.css];
                        }
                        angular.forEach(next.$$route.css, function(sheet){
                            scope.routeStyles[sheet] = sheet;
                        });
                    }
                });
            }
        };
    }
]);
		
imobDbApp.directive('contentItem', function ($compile) {
    var imageTemplate = '<div class="entry-photo"><h2>&nbsp;</h2><div class="entry-img"><span><a href="{{rootDirectory}}{{content.data}}"><img ng-src="{{rootDirectory}}{{content.data}}" alt="entry photo"></a></span></div><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.description}}</div></div></div>';
    var videoTemplate = '<div class="entry-video"><h2>&nbsp;</h2><div class="entry-vid"><iframe ng-src="{{content.data}}" width="280" height="200" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.description}}</div></div></div>';
    var noteTemplate = '<div class="entry-note"><h2>&nbsp;</h2><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.data}}</div></div></div>';    
		

    var linker = function(scope, element, attrs) {
        // DO SOMETHING
    };

    var getTemplate = function(contentType) {
        var template = '';

        switch(contentType) {
            case 'image':
                template = imageTemplate;
                break;
            case 'video':
                template = videoTemplate;
                break;
            case 'notes':
                template = noteTemplate;
                break;
        }

        return template;
    };
    
    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
});
