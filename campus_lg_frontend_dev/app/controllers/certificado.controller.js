LGApp.controller("CertificadoController", function($scope, $rootScope,
		$cookies, $location, $timeout, video, apiService, $sce, $http,
		$interval, $routeParams, $route) {
	$scope.nome = "";
	$scope.currentVideoId = $location.search().video != undefined ? $location.search().video : null;

	$timeout(function() {
		$rootScope.userAuthWithSessionId(function(userResponse) {
			$scope.nome = userResponse.Name;
			html2canvas(document.getElementById('ContentPrint'), {
				onrendered : function(canvas) {
					// document.body.appendChild(canvas);
					var data = canvas.toDataURL();
					var docDefinition = {
						pageOrientation : 'landscape',
						content : [ {
							image : data,
							width : 600
						} ]
					};
					pdfMake.createPdf(docDefinition).download(); 
				}
			});
		})
	}, 10)
});