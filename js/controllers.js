/* global angular */

'use strict';

var myVersion = 7;
var key = {
			backspace: 8,
			enter: 13,
			escape: 27,
			left: 37,
			up: 38,
			right: 39,
			down: 40,
			comma: 188
		};
var OBJECT_STORE_CLIENTES = 'cliente';
var OBJECT_STORE_EVENTOS = 'evento';
var OBJECT_STORE_IMOVEIS = 'imovel';
var OBJECT_STORE_CONTRATOS = 'contrato';
var OBJECT_STORE_DOCUMENTOS = 'documento';
var OBJECT_STORE_TIPODOC = 'tipoDocumento';
//var imoveisDbControllers = angular.module('imoveisDbControllers', ['imoveisDbServices']);
var imoveisDbControllers = angular.module('imoveisDbControllers', ['ngResource', 'ngAnimate', 'xc.indexedDB']);

imoveisDbControllers.config(function ($indexedDBProvider) {
	$indexedDBProvider
      .connection('imobapp-localdb')
      .upgradeDatabase(myVersion, function(event, db, tx){
      		if(!db.objectStoreNames.contains(OBJECT_STORE_TIPODOC)) {
      			var osTipoDocumentos = db.createObjectStore(OBJECT_STORE_TIPODOC, { keyPath: "tipo" });
      			osTipoDocumentos.createIndex("formato_idx", "tipo", { unique: false });
      		}
      		if(!db.objectStoreNames.contains(OBJECT_STORE_CONTRATOS)) {
			var osContratos = db.createObjectStore(OBJECT_STORE_CONTRATOS, { keyPath: "id", autoIncrement:true });
			osContratos.createIndex("cpfLocador_idx", "cpfLocador", { unique: false , multientry: true });
			osContratos.createIndex("cpfLocatario_idx", "cpfLocatario", { unique: false , multientry: true });
			osContratos.createIndex("idImovel_idx", "idImovel", { unique: false });
		}
      		if(!db.objectStoreNames.contains(OBJECT_STORE_IMOVEIS)) {
			var osImoveis = db.createObjectStore(OBJECT_STORE_IMOVEIS, { keyPath: "id", autoIncrement:true });
			osImoveis.createIndex("cpfLocador_idx", "cpfLocador", { unique: false});
			osImoveis.createIndex("cpfLocatario_idx", "cpfLocatario", { unique: false });
			osImoveis.createIndex("bairro_idx","bairro", 	{unique:false});
		}
		if(!db.objectStoreNames.contains(OBJECT_STORE_CLIENTES)) {
			var osLocatarios = db.createObjectStore(OBJECT_STORE_CLIENTES, { keyPath: "cpf"});
			//osLocatarios.createIndex("cpf_idx", "cpfCliente", { unique: false });	
			osLocatarios.createIndex("tipo_idx", "tipo", { unique: false, multientry: true });			
			osLocatarios.createIndex("doc_idx", "docs", { unique: false, multientry: true });
		}
		if(!db.objectStoreNames.contains(OBJECT_STORE_EVENTOS)) {
			var osEventos = db.createObjectStore(OBJECT_STORE_EVENTOS, { keyPath: "id", autoIncrement:true });
			osEventos.createIndex("idContrato_idx", "idContrato", { unique: false });
			osEventos.createIndex("tipoEvento_idx", "tipoEvento", { unique: false });
			osEventos.createIndex("acaoEvento_idx", "acaoEvento", { unique: false });
		}
      });
});

imoveisDbControllers.controller('HomeCtrl', ['$scope', '$indexedDB', 
		function($scope,  $indexedDB) {
			
	
	//init();
	
	/**
	* @type Contratos
	*/
	var contratosObjectStore = $indexedDB.objectStore(OBJECT_STORE_CONTRATOS);
	
	
	
    	function buscaContratos() {
		contratosObjectStore.getAll().then(function(contratosList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listViewContratos = contratosList;
		});		
	};		
	
	/**
	* @type Eventos
	*/
	var eventosObjectStore = $indexedDB.objectStore(OBJECT_STORE_EVENTOS);
	
    	function buscaEventos() {
		eventosObjectStore.getAll().then(function(eventosList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listViewEventos = eventosList;
		});		
	};	
	
	   
	function init() {
		/**
		* @type {ObjectStore} CLIENTES
		*/
		var ObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);
		ObjectStore.clear();
		ObjectStore
			.insert({	"cpf": "05171062722",
				"tipo": {"locador":true,"locatario":true,"dono":true,"fiador":true},
				"nome": "Leonardo Almeida Silva Ferreira",
				"email": "teste@teste.com",
				"telefones": {"celular": "21987662612","fixo": "2122058301"},
				"documentos":{	"1":{	"id":"1",
							"nome": "Archi User Guide PDF",
							"tipo": "PDF",
							"descricao": "Archi User Guide in PDF format (this is already included in the application download)", 
							"link": "http://www.archimatetool.com/downloads/latest/Archi%20User%20Guide.pdf",
							"versao": "1",
							"historico": {},
							"updated":new Date()},
						"2":{	"id":"2",
							"nome": "Archi User Guide eBook",
							"tipo": "PDF",
							"descricao": "Archi User Guide in ePub format", 
							"link": "http://www.archimatetool.com/downloads/latest/Archi%20User%20Guide.epub",
							"versao": "1",
							"historico": {},
							"updated":new Date()},
						"3":{	"id":"3",
							"nome": "Desenvolvimento de Softwares",
							"tipo": "PDF",
							"descricao": "Manual de Procedimentos para Desenvolvimento de Softwares", 
							"link": "http://www.sin.ufscar.br/manual-procedimento-desenvolvimento-software",
							"versao": "1",
							"historico": {},
							"updated":new Date()},
						"4":{	"id":"4",
							"nome": "Partitura Walpaper",
							"tipo": "IMG",
							"descricao": "Papel de parede no estilo de partitura", 
							"link": "http://files.partiturasearranjos1.webnode.com/200000058-b6a6cb79de/partitura-wallpaper-11944.jpg",
							"versao": "1",
							"historico": {},
							"updated":new Date()}},
				"enderecos": {"Principal":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"},"Adicional":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"}},
				"updated":new Date()});
		ObjectStore
			.insert({"cpf": "3140486819",
				"tipo": {"locador":true,"locatario":true,"dono":true,"fiador":true},
				"nome": "Thais de Moura Cardoso",
				"email": "teste@teste.com",
				"telefones": {"celular": "21984369758","fixo": "2122058301"}, 
				"documentos":{},
				"enderecos": {"Principal":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"},"Adicional":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"}},
				"updated":new Date()});
		ObjectStore
			.insert({"cpf": "49300008749",
				"tipo": {"locador":true,"locatario":true,"dono":true,"fiador":true},
				"nome": "Sandra Lucia dos Santos",
				"email": "teste@teste.com",
				"telefones": {"celular": "21988488175","fixo": "2122058301"}, 
				"documentos":{},
				"enderecos": {"Principal":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"},"Adicional":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"}},
				"updated":new Date()});
		ObjectStore
			.insert({"cpf": "12345678900",
				"tipo": {"locador":false,"locatario":false,"dono":true,"fiador":false},
				"nome": "Américo Guagliardi",
				"email": "teste@teste.com",
				"telefones": {"celular": "21988488175","fixo": "2122058301"}, 
				"documentos":{},
				"enderecos": {"Principal":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"},"Adicional":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"}},
				"updated":new Date()});
		ObjectStore
			.insert({"cpf": "23456789100",
				"tipo": {"locador":false,"locatario":false,"dono":true,"fiador":false},
				"nome": "Alone Maria dos Santos Almeida",
				"email": "teste@teste.com",
				"telefones": {"celular": "21988488175","fixo": "2122058301"}, 
				"documentos":{},
				"enderecos": {"Principal":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"},"Adicional":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"}},
				"updated":new Date()});
		ObjectStore
			.insert({"cpf": "34567891200",
				"tipo": {"locador":false,"locatario":false,"dono":false,"fiador":true},
				"nome": "José Amorim",
				"email": "teste@teste.com",
				"telefones": {"celular": "21988488175","fixo": "2122058301"}, 
				"documentos":{},
				"enderecos": {"Principal":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"},"Adicional":{"tipoimovel": "casa",
						"tipo":"Rua",
						"rua": "Buarque de Macedo", 
						"numero": 32,
						"complemento": "202",
						"bairro": "Flamengo",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"}},
				"updated":new Date()});
		
		       		
		/**
		* @type {ObjectStore} IMOVEIS
		*/
		
		var ObjectStore = $indexedDB.objectStore(OBJECT_STORE_IMOVEIS);
		ObjectStore.clear();		
		
		ObjectStore
			.insert({"proprietarios": {"Principal":"05171062722", "Adicional":"31404860819"},
				"tipoimovel": "Apartamento",
				"endereco":{"tipo": "Rua",
						"rua": "Almirante Baltazar", 
						"numero": 194,
						"complemento": "apt 1105 bl 1",
						"bairro": "São Cristóvão",
						"cidade": "Rio de Janeiro",
						"estado": "RJ",
						"pais": "Brasil"},
				"status": "Alugado",
				"documentos":{	"1":{	"id":"1",
							"nome": "Archi User Guide PDF",
							"tipo": "PDF",
							"descricao": "Archi User Guide in PDF format (this is already included in the application download)", 
							"link": "http://www.archimatetool.com/downloads/latest/Archi%20User%20Guide.pdf",
							"versao": "1",
							"historico": {},
							"updated":new Date()},
						"2":{	"id":"2",
							"nome": "Archi User Guide eBook",
							"tipo": "PDF",
							"descricao": "Archi User Guide in ePub format", 
							"link": "http://www.archimatetool.com/downloads/latest/Archi%20User%20Guide.epub",
							"versao": "1",
							"historico": {},
							"updated":new Date()},
						"3":{	"id":"3",
							"nome": "Desenvolvimento de Softwares",
							"tipo": "PDF",
							"descricao": "Manual de Procedimentos para Desenvolvimento de Softwares", 
							"link": "http://www.sin.ufscar.br/manual-procedimento-desenvolvimento-software",
							"versao": "1",
							"historico": {},
							"updated":new Date()},
						"4":{	"id":"4",
							"nome": "Partitura Walpaper",
							"tipo": "IMG",
							"descricao": "Papel de parede no estilo de partitura", 
							"link": "http://files.partiturasearranjos1.webnode.com/200000058-b6a6cb79de/partitura-wallpaper-11944.jpg",
							"versao": "1",
							"historico": {},
							"updated":new Date()}},
				"vencimento": new Date()+10,				
				"updated":new Date()});
		
		/**
		* @type {ObjectStore} CONTRATOS
		*/
		
		var ObjectStore = $indexedDB.objectStore(OBJECT_STORE_CONTRATOS);
		ObjectStore.clear();
		
		ObjectStore
			.insert({	"imovel": "1",
				"locador": {"Principal":"05171062722", "Adicional":"49300008749"},
				"locatario": {"Principal":"12345678900","Adicional":"23456789100"},								
				"status": "Ativo",
				"vencimento": new Date()+10,				
				"updated":new Date()});
		
		/**
		* @type {ObjectStore} ATIVIDADES/EVENTOS
		*/
		
		var ObjectStore = $indexedDB.objectStore(OBJECT_STORE_EVENTOS);
		ObjectStore.clear();
		
		ObjectStore
			.insert({	"contrato": "1",
				"tipo": "BOLETO",
				"descricao": "Envio de boleto de cobrança ao locatario", 
				"title": "Emitir boleto e envio por email",
				"status": "Ativo",
				"start": new Date()+10,
				"end": new Date()+10,					
				"updated":new Date()});
		ObjectStore
			.insert({	"contrato": "1",
				"tipo": "CONTRATO",
				"descricao": "Assinatura de contrato pelo locador", 
				"title": "Enviar contrato para assinatura do locador",
				"status": "Ativo",
				"start": new Date()+10,
				"end": new Date()+10,				
				"updated":new Date()});
		ObjectStore
			.insert({	"contrato": "1",
				"tipo": "RENOVACAO",
				"descricao": "Contrato próximo da data de expiração.", 
				"title": "Enviar renovação para locador e locatário",
				"status": "Ativo",
				"start": new Date()+10,
				"end": new Date()+10,					
				"updated":new Date()});
			
		ObjectStore
			.insert({	"contrato": "1",
				"tipo": "PAGAMENTO",
				"descricao": "Contrato próximo da data de expiração.", 
				"title": "Enviar renovação para locador e locatário",
				"status": "Fechado",
				"start": new Date()+10,
				"end": new Date()+10,					
				"updated":new Date()});
			
		/**
		* @type {ObjectStore} TIPOS DE DOCUMENTOS
		*/
		
		var ObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
		ObjectStore.clear();		
		
		ObjectStore
			.insert({	
				tipo: 'PDF',
				icon: "fa-file-pdf-o"
			    });
		ObjectStore 
			.insert({
				tipo: 'TXT',
				icon: "fa-file-text-o"
			    });
		ObjectStore 
			.insert({
				tipo: 'Excel',
				icon: "fa-file-excel-o"				
			    });
		ObjectStore 
			.insert({
				tipo: 'CSV',
				icon: "fa-file-excel-o"
			    });
		ObjectStore 
			.insert({
				tipo: 'VÃ­deo',
				icon: "fa-file-video-o"				
			    });
		ObjectStore 
			.insert({
				tipo: 'IMG',
				icon: "fa-file-image-o"				
			    });
		ObjectStore 
			.insert({
				tipo: 'SOM',
				icon: "fa-file-sound-o"				
			    });
		ObjectStore 
			.insert({
				tipo: 'DOC',
				icon: "fa-file-word-o"				                                                              
			    });
	
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaContratos();
		buscaEventos();
	};
			
}]);

imoveisDbControllers.controller('ClientesCtrl', ['$scope', '$indexedDB', 
		function($scope,  $indexedDB) {
	
	$scope.objects = [];
	$scope.entidade = "Lista de clientes";
	$scope.formatosSelecionados = [];	
	 	
	var documentosObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
	documentosObjectStore.getAll().then(function(typeList) { 
		$scope.tipoDocList = typeList;
	});
	
	
	//init();
	
	/**
	* @type {ObjectStore}
	*/
	var clientesObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);
	
	
	
    	function buscaClientes() {
		clientesObjectStore.getAll().then(function(clientesList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listView = clientesList;
		});		
	};	
	
	$scope.setSelectedDocTypes = function () {
		var tipo = this.tipoDoc.tipo;
		if (_.contains($scope.formatosSelecionados, tipo)) {
		    $scope.formatosSelecionados = _.without($scope.formatosSelecionados, tipo);
		} else {
		    $scope.formatosSelecionados.push(tipo);
		}
		return false;
	};
	
	$scope.isChecked = function (id) {
		if (_.contains($scope.formatosSelecionados, id)) {
		    return 'fa fa-check pull-right';
		}
		return false;
	};
	
	$scope.checkAll = function () {
		$scope.formatosSelecionados = _.pluck($scope.tipoDocList, 'tipo');
	};
	
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	}
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	}
		
	
	$scope.removeCliente = function(key) {
		locObjectStore.delete(key).then(function() {			
			buscaLocadores();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaClientes();
	};

}]);


imoveisDbControllers.controller('ClientesEditCtrl', ['$scope', '$log', '$rootScope', '$routeParams', '$location',  '$indexedDB',  
		function($scope, $log, $rootScope, $routeParams, $location, $indexedDB) {
		
	if ($rootScope == "view") $scope.entidade = "Alterar cliente";
	else $scope.entidade = "Incluir cliente";
	/**
	* @type {ObjectStore}
	*/
	
	$scope.cliente = {};
	$scope.cliente.tipo = {
      locador: false,
      locatario: false,
      dono: false,
      fiador: false
	};
	$scope.endereco = {};
	$scope.endereco.tpEndereco = "Residencial";	
	$scope.telefone = {};
	$scope.telefone.tpTelefone = "Residencial";
	$scope.documentos = [];
	$scope.cliente.enderecos = [];	
	$scope.cliente.telefones = [];	
	$scope.cliente.documentos = [];
		
	var clientesObjectStore = $indexedDB.objectStore(OBJECT_STORE_CLIENTES);
	
	$scope.incluirEndereco = function(){
      $scope.cliente.enderecos.push($scope.endereco);
      $scope.endereco = {};
      $scope.endereco.tpEndereco = "Residencial";
	};

	$scope.removeEndereco = function($index){
		  $scope.cliente.enderecos.splice(index, 1);		
	};
	
	$scope.incluirTelefone = function(){
	    //if (tapButton !== key.enter) return;
	   
	    if ($scope.telefone.nrTelefone !== ''){
          $scope.cliente.telefones.push($scope.telefone);
          $scope.telefone = {};
          $scope.telefone.tpTelefone = "Residencial";
      }
	};
	
	$scope.removeTelefone = function($index){
	    $scope.cliente.telefones.splice(index, 1);
	};
	
	$scope.cancel = function() {
			
	};
	
	$scope.submit = function() {
      //if($scope.cpf == "") $scope.cpf = 1;
      //alert($scope.myForm.serializeArray());
      
      $scope.cliente.updated = new Date();
      
      alert(JSON.stringify($scope.cliente));
      
      clientesObjectStore
      .upsert($scope.cliente)
      .then(function(e){
          $log.info('Cliente' + $scope.cliente.nome + 'included with CPF:'+  $scope.cliente.cpf +  ' at:' + new Date());
          $location.path('/cadastro/cliente')
      });
		
	};
	
	function buscaInfo(key) {
		
		if(key) {
			var myQuery = $indexedDB.queryBuilder().$eq(key).$asc().compile();
			clientesObjectStore.each(
				function(cliente){
					$scope.cpf = cliente.value.cpf;
					if (_.contains(cliente.value.tipo,"Locador"))
						$scope.locador.active
					$scope.locatario = _.contains(cliente.value.tipo,"Locatario");
					$scope.dono = _.contains(cliente.value.tipo,"Dono");
					$scope.fiador = _.contains(cliente.value.tipo,"Fiador");
					$scope.nome = cliente.value.nome;
					$scope.email = cliente.value.email;
					//$scope.telefones = _.(cliente.value.telefones))
					$scope.enderecos = cliente.value.enderecos;
					//$scope.locadorSelected=true;
					//$location.path('#/locadores/edit/'+key);
				}
			,myQuery);
		}
	};
		
	
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaInfo($routeParams.id);
	};
	
}]);

imoveisDbControllers.controller('ImoveisCtrl', ['$scope', '$indexedDB',
		function($scope,  $indexedDB) {

	
	$scope.objects = [];
	$scope.entidade = "Lista de imóveis";
	$scope.formatosSelecionados = [];
	
	var documentosObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
	documentosObjectStore.getAll().then(function(typeList) { 
		$scope.tipoDocList = typeList;
	});
	
	
	/**
	* @type {ObjectStore}
	*/
	var imoveisObjectStore = $indexedDB.objectStore(OBJECT_STORE_IMOVEIS);
	
	
	
    	function buscaImoveis() {
		imoveisObjectStore.getAll().then(function(imoveisList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listView = imoveisList;
		});		
	};	
	
	$scope.setSelectedDocTypes = function () {
		var tipo = this.tipoDoc.tipo;
		if (_.contains($scope.formatosSelecionados, tipo)) {
		    $scope.formatosSelecionados = _.without($scope.formatosSelecionados, tipo);
		} else {
		    $scope.formatosSelecionados.push(tipo);
		}
		return false;
	};
	
	$scope.isChecked = function (id) {
		if (_.contains($scope.formatosSelecionados, id)) {
		    return 'fa fa-check pull-right';
		}
		return false;
	};
	
	$scope.checkAll = function () {
		$scope.formatosSelecionados = _.pluck($scope.tipoDocList, 'tipo');
	};
	
	  
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	}
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	}
		
	
	$scope.removeImovel = function(key) {
		imoveisObjectStore.delete(key).then(function() {			
			buscaImoveis();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaImoveis();
	};

			
}]);

imoveisDbControllers.controller('ContratosCtrl', ['$scope', '$indexedDB',
		function($scope,  $indexedDB) {

	
	$scope.objects = [];
	$scope.entidade = "Lista de contratos";
	$scope.formatosSelecionados = [];
	
	var documentosObjectStore = $indexedDB.objectStore(OBJECT_STORE_TIPODOC);
	documentosObjectStore.getAll().then(function(typeList) { 
		$scope.tipoDocList = typeList;
	});
	
	
	/**
	* @type {ObjectStore}
	*/
	var contratosObjectStore = $indexedDB.objectStore(OBJECT_STORE_CONTRATOS);
	
	
	
    	function buscaContratos() {
		contratosObjectStore.getAll().then(function(contratosList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listView = contratosList;
		});		
	};	
	
	$scope.setSelectedDocTypes = function () {
		var tipo = this.tipoDoc.tipo;
		if (_.contains($scope.formatosSelecionados, tipo)) {
		    $scope.formatosSelecionados = _.without($scope.formatosSelecionados, tipo);
		} else {
		    $scope.formatosSelecionados.push(tipo);
		}
		return false;
	};
	
	$scope.isChecked = function (id) {
		if (_.contains($scope.formatosSelecionados, id)) {
		    return 'fa fa-check pull-right';
		}
		return false;
	};
	
	$scope.checkAll = function () {
		$scope.formatosSelecionados = _.pluck($scope.tipoDocList, 'tipo');
	};
	
	  
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	}
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	}
		
	
	$scope.removeContrato = function(key) {
		contratosObjectStore.delete(key).then(function() {			
			buscaContratos();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaContratos();
	};

			
}]);


imoveisDbControllers.controller('EventosCtrl', ['$scope', '$indexedDB',
		function($scope,  $indexedDB) {

	
	$scope.entidade = "Lista de eventos";
	
	/**
	* @type {ObjectStore}
	*/
	var eventosObjectStore = $indexedDB.objectStore(OBJECT_STORE_EVENTOS);
	
    	function buscaEventos() {
		eventosObjectStore.getAll().then(function(eventosList) {  
		//persistanceService.buscaImoveis().then(function(imoveisList) {
			$scope.listView = eventosList;
		});		
	};	
	
	$scope.setMaster = function(section) {
	    $scope.selected = section;
	}
	
	$scope.isSelected = function(section) {
	    return $scope.selected === section;
	}
		
	$scope.removeEvento = function(key) {
		eventosObjectStore.delete(key).then(function() {			
			buscaEventos();
		});
	};
	
	if($indexedDB.onDatabaseError) {
		$location.path('/unsupported');
	} else {
		buscaEventos();
	};
			
}]);

imoveisDbControllers.controller('CalendarCtrl', ['$scope', '$indexedDB',
		function($scope,  $indexedDB) {
			
	
	$scope.entidade = "Lista de eventos";
	
	/**
	* @type {ObjectStore}
	*/
	var eventosObjectStore = $indexedDB.objectStore(OBJECT_STORE_EVENTOS);
	
    			
	//$(this).ready(function() {
	
		var calendar = $('#calendar').fullCalendar({
			
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			eventLimit: true, // allow "more" link when too many events
			allDayDefault: true,
			selectable: true,
			selectHelper: true,
			select: function(start, end) {
				endtime = $.fullCalendar.formatDate(end,'h:mm tt');
				starttime = $.fullCalendar.formatDate(start,'ddd, MMM d, h:mm tt');
				var mywhen = starttime + ' - ' + endtime;
				$('#createEventModal #apptStartTime').val(start);
				$('#createEventModal #apptEndTime').val(end);
				$('#createEventModal #apptAllDay').val(allDay);
				$('#createEventModal #when').text(mywhen);
				$('#createEventModal').modal('show');
		        },		        
			editable: true,	
			events: function(start, end, timezone, callback) {
				eventosObjectStore.getAll().then(function(eventosList) {  
					//persistanceService.buscaImoveis().then(function(imoveisList) {
					
					var events = [];
					var obj;
					eventosList.forEach(function(obj){					
					//eventosList.forEach(function(obj) {
					    events.push({
						title: obj.contrato + ": " + obj.title,
						start: obj.start // will be parsed
					    });
					});
					callback(events);					
				});	
			},
			loading: function(bool) {
				$('#loading').toggle(bool);
			}
			
			/*
			googleCalendarApiKey: 'AIzaSyA1PV7T8RZBnVHhEEPi_cFvpBacY8liJVY',
			googleCalendarId: 'e1cpgfuqlpbk78ru2u8085fluk@group.calendar.google.com',
			
			editable: true,
			
			loading: function(bool) {
				$('#loading').toggle(bool);
			}
			*/
		});	
		
	/*	
		$('#submitButton').on('click', function(e){
		    // We don't want this to act as a link so cancel the link action
		    e.preventDefault();
		
		    doSubmit();
		});
		
		function doSubmit(){
		    $("#createEventModal").modal('hide');
		    console.log($('#apptStartTime').val());
		    console.log($('#apptEndTime').val());
		    console.log($('#apptAllDay').val());
		    alert("form submitted");
			
		    $("#calendar").fullCalendar('renderEvent',
			{
			    title: $('#patientName').val(),
			    start: new Date($('#apptStartTime').val()),
			    end: new Date($('#apptEndTime').val()),
			    allDay: ($('#apptAllDay').val() == "true"),
			},
			true);
		}
		*/
	//});		
}]);
