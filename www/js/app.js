// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('hauntApp', ['ionic', 'hauntApp.controllers', 'hauntApp.services', 'hauntApp.directives',  'ui.bootstrap'])

.run(function($ionicPlatform, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $ionicPlatform.registerBackButtonAction(
    function () {
      if($state.is('login') || $state.is('home')) {
        navigator.app.exitApp();  // ionic.Platform.exitApp();
      }
      else {
        navigator.app.backHistory();
      }
    }, 101
  );
  // $scope.$on('$destroy', deregister);
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('prepare', {
    url: "/main",
    templateUrl: "templates/main.html",
    controller: "MainCtrl"
  })

  .state('upgrade', {
    url: "/upgrade",
    templateUrl: "templates/upgrade.html",
    controller: "UpgradeCtrl"
  })

  .state('login', {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "UserCtrl"
  })

  // About
  .state('about', {
    url: "/about",
    templateUrl: "templates/about.html",
    controller: 'AboutCtrl'
  })

  .state('home', {
    url: "/home",
    templateUrl: "templates/home.html",
    controller: 'HomeCtrl'
  })

  .state('submit', {
    url: "/submit",
    templateUrl: "templates/submit.html",
    controller: "SubmitCtrl"
  })

  .state('history', {
    url: "/history/:name",
    templateUrl: "templates/history.html",
    controller: "HistoryCtrl"
  })

  .state('test', {
    url: "/test",
    templateUrl: "templates/test.html",
    controller: "TestCtrl"
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/main');
})

.constant('Config', {
  apiUrlBase: 'Here put your api_url',
  urlBase: 'Here put your base url',
  isPhonegap: false
})
