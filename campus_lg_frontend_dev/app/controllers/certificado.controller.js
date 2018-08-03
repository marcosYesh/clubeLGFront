LGApp.controller("CertificadoController", function ($scope, $rootScope, $cookies, $location, $timeout,apiService) {
	    $scope.nome = "";
	
	    $timeout(function () {
            $rootScope.userAuthWithSessionId(function (userResponse) {
            	apiService.authenticate(1, userResponse.Token).then(function (response) {
            		$scope.nome = response.data.ReturnData.Name;            		
                });
            	
            	
            	
            	
            	html2canvas(document.getElementById('ContentPrint'), {
                    onrendered: function(canvas) {
                        // document.body.appendChild(canvas);
        				var data = canvas.toDataURL();
                        var docDefinition = {
                        	pageOrientation: 'landscape',	
                            content: [{
                                image: data,
                                width: 600
        						
                            }]
                        };
                        pdfMake.createPdf(docDefinition).download();
                    }
                });	
            	
            })            
        }, 10)
    }
);