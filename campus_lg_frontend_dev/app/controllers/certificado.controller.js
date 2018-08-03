LGApp.controller("CertificadoController", function ($scope, $rootScope, $cookies, $location, $timeout) {
	    $scope.nome = "bruno";
	
	    $timeout(function () {
            $rootScope.userAuthWithSessionId(function (userResponse) {
            	$scope.nome = "Bruno";
            	
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