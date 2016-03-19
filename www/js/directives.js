angular.module('hauntApp.directives', ['hauntApp.controllers'])

.directive('headerButtons', function() {
	return {
		restrict: 'E',
    // replace: 'true',
		templateUrl: 'templates/header.html',		
		controller: 'HeaderCtrl'
	}
})