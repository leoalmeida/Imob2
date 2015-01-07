/* global angular */

var imoveisDbFilters = angular.module('imoveisDbFilters', [])
	.filter('dateFormat', function() {
		return function(input) {
			if(!input) return "";
			input = new Date(input);
			var res = (input.getMonth()+1) + "/" + input.getDate() + "/" + input.getFullYear() + " ";
			var hour = input.getHours();
			var ampm = "AM";
			if(hour === 12) ampm = "PM";
			if(hour > 12){
				hour-=12;
				ampm = "PM";
			}
			var minute = input.getMinutes()+1;
			if(minute < 10) minute = "0" + minute;
			res += hour + ":" + minute + " " + ampm;
			return res;
		
		};
	}).filter('enderecoFormat', function() {
		return function(input) {
			if(!input) return "";
			
			return input.tipo + input.rua + input.numero + input.complemento + input.bairro + input.cidade + input.estado;
		
		};
	})
	.filter('docFilter', [function () {
	    return function (documents, selectedDocTypes) {
		var tempDocuments = [];
		if (!angular.isUndefined(documents) && !angular.isUndefined(selectedDocTypes) && selectedDocTypes.length > 0) {
		    
		    angular.forEach(selectedDocTypes, function (key) {
			angular.forEach(documents, function (document) {
			    if (angular.equals(document.tipo, key)) {
				tempDocuments.push(document);
			    }
			});
		    });                    
		}
		return tempDocuments;
	    };
	}])
	.filter('ativosFilter', [function () {
	    return function (lista) {
		var tempList = [];
		if (!angular.isUndefined(lista) && lista.length > 0) {
		    
		   
			angular.forEach(lista, function (item) {
			    if (angular.equals(item.status, "Ativo")) {
				tempList.push(item);
			    }
			});
		                       
		}
		return tempList;
	    };
	}]);
