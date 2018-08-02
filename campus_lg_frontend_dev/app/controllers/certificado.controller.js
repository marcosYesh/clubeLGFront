LGApp.controller("CertificadoController", function ($scope, $rootScope, $cookies, $location, $timeout) {
        $timeout(function () {
            $rootScope.userAuthWithSessionId(function (userResponse) {})
            
            html2canvas(document.body, {
                onrendered: function(canvas) {
                    // document.body.appendChild(canvas);
    				var data = "Olá mundo!";
                    var docDefinition = {
                    		content: [
                    		          // if you don't need styles, you can use a simple string to define a paragraph
                    		          'This is a standard paragraph, using default style',

                    		          // using a { text: '...' } object lets you set styling properties
                    		          { text: 'This paragraph will have a bigger font', fontSize: 15 },

                    		          // if you set pass an array instead of a string, you'll be able
                    		          // to style any fragment individually
                    		          {
                    		            text: [
                    		              'This paragraph is defined as an array of elements to make it possible to ',
                    		              { text: 'restyle part of it and make it bigger ', fontSize: 15 },
                    		              'than the rest.'
                    		            ]
                    		          }
                    		        ]
                    };
                    pdfMake.createPdf(docDefinition).open();
                }
            });
        }, 10)
    }
);