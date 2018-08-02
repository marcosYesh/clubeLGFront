LGApp.controller("CertificadoController", function ($scope, $rootScope, $cookies, $location, $timeout) {
        $timeout(function () {
            $rootScope.userAuthWithSessionId(function (userResponse) {})
            
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    // document.body.appendChild(canvas);
    				var data = canvas.toDataURL();
                    var docDefinition = {
                        content: [{
                            image: data,
                            width: 600,
    						pageOrientation: 'landscape'
                        }]
                    };
                    pdfMake.createPdf(docDefinition).download();
                }
            });
        }, 10)
    }
);