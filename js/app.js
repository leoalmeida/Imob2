/* global angular,window */
var imoveisDbApp = angular.module('imoveisDbApp', ['ngRoute', 'ngResource', 'imoveisDbControllers', 'imoveisDbFilters', 'imoveisDbEvents']);

imoveisDbApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider ,$locationProvider)
	{			
		$routeProvider.
			when('/', {
				templateUrl: 'partials/home.html',
				controller: 'HomeCtrl'
			}).
			when('/dashboard', {  
				templateUrl: 'partials/home.html',
				controller: 'ClientesCtrl'			
			}).
			when('/calendario', {  
				templateUrl: 'partials/calendario.html',
				controller: 'CalendarCtrl',
				css: 'css/fullcalendar.min.css'			
			}).
			when('/cadastro/clientes', { 
				templateUrl: 'partials/listViewClientes.html',
				controller: 'ClientesCtrl'			
			}).
			when('/cadastro/clientes/new', {  
				templateUrl: 'partials/formNewClientes.html',
				controller: 'ClientesEditCtrl'			
			}).
			when('/cadastro/clientes/view/:id', { 
				templateUrl: 'partials/formNewClientes.html',
				controller: 'ClientesEditCtrl'			
			}).			
			/*when('/cadastro/locatario/view/:id', { 
				templateUrl: 'partials/listView.html',
				controller: 'ClientesCtrl'			
			}).
			when('/cadastro/locatario/new', {  
				templateUrl: 'partials/formNew.html',
				controller: 'ClientesEditCtrl'			
			}).
			when('/cadastro/locatarios/edit/:key', {
				templateUrl: 'partials/locatario_form.html',
				controller: 'ClientesEditCtrl'
			}).*/
			when('/cadastro/imoveis', { 
				templateUrl: 'partials/listViewImoveis.html',
				controller: 'ImoveisCtrl'			
			}).
			when('/cadastro/imoveis/new', {  
				templateUrl: 'partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl'			
			}).
			when('/cadastro/imoveis/view/:key', {
				templateUrl: 'partials/formNewImoveis.html',
				controller: 'ImoveisEditCtrl'
			}).
			when('/cadastro/contratos', { 
				templateUrl: 'partials/listViewContratos.html',
				controller: 'ContratosCtrl'			
			}).
			when('/cadastro/contratos/edit', {  
				templateUrl: 'partials/formNewContratos.html',
				controller: 'ContratosEditCtrl'			
			}).
			when('/cadastro/contratos/edit/:key', {
				templateUrl: 'partials/formNewContratos.html',
				controller: 'ContratosEditCtrl'
			}).
			when('/cadastro/eventos', { 
				templateUrl: 'partials/listViewEventos.html',
				controller: 'EventosCtrl'			
			}).
			when('/cadastro/eventos/edit', {  
				templateUrl: 'partials/formNewEventos.html',
				controller: 'EventosEditCtrl'			
			}).
			when('/cadastro/eventos/edit/:key', {
				templateUrl: 'partials/formNewEventos.html',
				controller: 'EventosEditCtrl'
			}).						
			when('/unsupported', {
				templateUrl: 'partials/unsupported.html'
			}).
			otherwise({
				redirectTo: '/'
			});
			
		$locationProvider.html5Mode(true).hashPrefix('!');		
	
		//$controllerProvider.register('HomeCtrl', function($scope)
		//{
		    
		//});
	
	}
]);


		
// Registering a directive after app bootstrap
imoveisDbApp.directive('head', ['$rootScope','$compile',
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
		
imoveisDbApp.directive('contentItem', function ($compile) {
    var imageTemplate = '<div class="entry-photo"><h2>&nbsp;</h2><div class="entry-img"><span><a href="{{rootDirectory}}{{content.data}}"><img ng-src="{{rootDirectory}}{{content.data}}" alt="entry photo"></a></span></div><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.description}}</div></div></div>';
    var videoTemplate = '<div class="entry-video"><h2>&nbsp;</h2><div class="entry-vid"><iframe ng-src="{{content.data}}" width="280" height="200" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.description}}</div></div></div>';
    var noteTemplate = '<div class="entry-note"><h2>&nbsp;</h2><div class="entry-text"><div class="entry-title">{{content.title}}</div><div class="entry-copy">{{content.data}}</div></div></div>';    
		

    var linker = function(scope, element, attrs) {
        // DO SOMETHING
    }

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
    }
    
    return {
        restrict: "E",
        link: linker,
        scope: {
            content:'='
        }
    };
});

