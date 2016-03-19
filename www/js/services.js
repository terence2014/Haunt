angular.module('hauntApp.services', [])

.service('CheckService', function($http, $q, Config) {
  return {
    check: function() {
      var dfd = $q.defer()

      $http.get(Config.apiUrlBase + '/get_servicestatus.php')
      .success(function(response) {        
        dfd.resolve(response);
      })
      .error(function(err) {        
        dfd.reject(err);
      });

      return dfd.promise;
    },
    checkAppVersion: function() {
      var dfd = $q.defer()

      $http.get(Config.apiUrlBase + '/get_allowedappversion.php')
      .success(function(response) {        
        dfd.resolve(response);
      })
      .error(function(err) {        
        dfd.reject(err);
      });

      return dfd.promise;
    }
  }
})

.factory('AuthService', function($http, $q, $ionicLoading, Config) { 
  return {
    login: function(data) {
      var def = $q.defer();
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i> Loading...'
      });

      var loginData = 'username=' + data.username + '&password=' + data.password;

      $http.post(Config.apiUrlBase + '/check_login.php', loginData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
      })
      .success(function(response) {
        $ionicLoading.hide();
        def.resolve(response);
      })
      .error(function(err) {
        $ionicLoading.hide();
        console.log('err:' + err);
        def.reject(err);
      });

      return def.promise;
    },
  }
})

.factory('HomeService', function($http, $q, $ionicLoading, Config) {  
  return {
    showNotice: function() {
      var dfd = $q.defer();
      $http.get(Config.apiUrlBase + '/get_notice.php')
      .success(function(rep) {
        $ionicLoading.hide();
        dfd.resolve(rep);
      })
      .error(function(err) {
        $ionicLoading.hide();
        dfd.reject(err);
      })
      return dfd.promise;
    },
    summary: function() {
      var def = $q.defer();
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i> Fetching data...'
      });
      var currentTime = new Date();

      $http.get(Config.apiUrlBase + '/get_summary.php?year='+ currentTime.getFullYear()) // 
      .success(function(response) {
        $ionicLoading.hide();
        def.resolve(response);
      })
      .error(function(err) {
        $ionicLoading.hide();
        console.log('err:' + err);
        def.reject(err);
      });

      return def.promise;
    }
  }
})

.factory('SubmitService', function($rootScope, $http, $q, $ionicLoading, Config) {
  return {
    getClass: function() {
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i> Fetching Data...'
      });
      var def = $q.defer();

      $http.get(Config.apiUrlBase + '/get_class.php')
      .success(function(response) {
        $ionicLoading.hide();
        def.resolve(response);
      })
      .error(function(err) {
        $ionicLoading.hide();
        def.reject(err);
      });

      return def.promise;
    },
    getOffenceType: function() {
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i> Fetching Data...'
      });
      var def = $q.defer();

      $http.get(Config.apiUrlBase + '/get_offencetype.php')
      .success(function(response) {
        $ionicLoading.hide();
        def.resolve(response);
      })
      .error(function(err) {
        $ionicLoading.hide();
        def.reject(err);
      });

      return def.promise;
    },
    getClassList: function(classname) {
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i> Fetching Data...'
      });
      var def = $q.defer();
      var currentTime = new Date();

      $http.get(Config.apiUrlBase + '/get_classlist.php?year=' + currentTime.getFullYear() + '&class=' + classname)
      .success(function(response) {
        $ionicLoading.hide();
        def.resolve(response);
      })
      .error(function(err) {
        $ionicLoading.hide();
        def.reject(err);
      });

      return def.promise;
    },
    setOffenceIncident: function(className, studentName, offence) {
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i> Sending Data...'
      });
      var def = $q.defer();

      $http.get(Config.apiUrlBase + '/set_offenceincident.php?class=' + className + '&name=' + studentName + '&offence=' + offence + '&teacher=' + $rootScope.user.name)
      .success(function(response) {
        $ionicLoading.hide();
        def.resolve(response);
      })
      .error(function(err) {
        $ionicLoading.hide();
        def.reject(err);
      });

      return def.promise;
    }
  }
})

.factory("HistoryService", function($http, $q, $ionicLoading, Config) {
  return {
    getOffenceHistory: function(fullname) {
      $ionicLoading.show({
        template: '<i class="ion-loading-c"></i> Fetching Data...'
      });
      var dfd = $q.defer();
      var currentTime = new Date();

      $http.get(Config.apiUrlBase + '/get_offencehistory.php?fullname=' + fullname + '&year=' + currentTime.getFullYear())
      .success(function(response) {
        $ionicLoading.hide();
        dfd.resolve(response);
      })
      .error(function(err) {
        $ionicLoading.hide();
        dfd.reject(err);
      });

      return dfd.promise;
    }
  }
})

.factory('AboutService', function($rootScope, Config) {
  var appInfo = {
    version: '1.00.00',
    code: 'Web',
    device_model: "",
    build_version: ""
  };

  return {
    all: function() {
      // Get app version and code
      cordova.getAppVersion.getVersionNumber().then(function(version) {
        appInfo.version = version;
      });
      cordova.getAppVersion.getVersionCode().then(function(code) {
        appInfo.code = code;
      });

      appInfo.device_model = device.model;
      appInfo.build_version = device.platform + " " + device.version;

      return appInfo;
    }
  }
})

