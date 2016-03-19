angular.module('hauntApp.controllers', ['hauntApp.services'])

.controller('MainCtrl', function($rootScope, $scope, $state, CheckService, Config) {  

  $scope.init = function() {
    // $state.go('upgrade');
    var serviceStatus = "";
    var intVersion = 100;
    var elStatus = document.querySelector(".text-status");

    // Check Service status
    CheckService.check().then(function(response) {
      var data = response.result;
      if ( data !== null || data !== undefined ) {
        if (data[0].value === "1") {          
          console.log("service status OK...");
          serviceStatus = true;

          if ( Config.isPhonegap ) {
            // Active Check app version text
            angular.element(elStatus).text("Checking app version compatibility...");
            // get current app version
            cordova.getAppVersion.getVersionNumber().then(function (version) {
              var appversion = version;
              var arrVersion = appversion.split(".");
              intVersion = parseInt(arrVersion[0] + arrVersion[1]);            
            });

            CheckService.checkAppVersion().then(function(response) {
              var data = response.result;
              if ( data !== null || data !== undefined ) {
                var strAllowAppVersion = data[0].value;
                var arrAllowAppVersion = strAllowAppVersion.split(".");
                var intAllowedAppVersion = parseInt(arrAllowAppVersion[0] + arrAllowAppVersion[1]);

                if (intAllowedAppVersion <= intVersion) {
                  console.log("Check App version OK...");
                  $state.go('login');
                  $rootScope.appversion = strAllowAppVersion;
                }
                else {
                  console.log("Found new version...");
                  $state.go('upgrade');
                }
              }
            })
          }
          else {
            console.log("Skiped checking app version..");
            $state.go('login');
          }

        } else {          
          serviceStatus = false;           //.text("The service is temporarily OFFLINE.<br>Please try again later.");
          angular.element(elStatus).html("The service is temporarily OFFLINE.<br>Please try again later.");
        }
      }
    });

  };

})

.controller('UpgradeCtrl', function($scope, $ionicLoading, Config) {
  $scope.doUpgrade = function() {

    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i> Downloading...'
    });

    var sourceUrl = Config.urlBase + "downloads/HAUNT.apk";
    var fileURL = "cdvfile://localhost/persistent/HAUNT.apk";

    var fileTransfer = new FileTransfer();
    // var uri = encodeURI(sourceUrl.android);

    fileTransfer.download(
        sourceUrl,
        fileURL,
        function (entry) {

            console.log("download complete: " + entry.fullPath);

            window.plugins.webintent.startActivity({
                  action: window.plugins.webintent.ACTION_VIEW,
                  url: entry.toURL(),
                  type: 'application/vnd.android.package-archive'
              },
              function () {
                $ionicLoading.hide();
              },
              function () {
                $ionicLoading.hide();
                alert('Failed to open URL via Android Intent.');
                console.log("Failed to open URL via Android Intent. URL: " + entry.fullPath);
              }
            );
        },
        function (error) {
          $ionicLoading.hide();
          console.log("download error source " + error.source);
          console.log("download error target " + error.target);
          console.log("upload error code" + error.code);
          alert('Error downloading apk: '+ error.code);
        }
    );
  }

})

.controller('UserCtrl', function($rootScope, $scope, $state, AuthService, Config) {
  var user = {};

  // Expose the user object to HTML templates via the root scope
  $rootScope.user = user;
  $rootScope.user.loggedin = false;

  $scope.doLogin = function(userData) {

    if (userData === null || userData === undefined || 
      userData.username === null || userData.username === undefined || 
      userData.password === null || userData.password === undefined) {

      if ( Config.isPhonegap ) {
        window.plugins.toast.show("You must entered username and password.", 'long', 'bottom');
      }
      else {
        alert("You must entered username and password.");
      }
      return;
    }
    // $state.go('home');

    AuthService.login(userData).then(function(data) {
      console.log("Login Successed!");      

      if (data.loggedin === true) {
        $rootScope.user.loggedin = true;
        $rootScope.user.name = userData.username;
        $rootScope.user.fullname = data.fullname;
        // goto home
        $state.go('home');
      }
      else {
        if ( Config.isPhonegap ) {
          window.plugins.toast.show("Username/Password is wrong. Try again.", 'long', 'bottom');
        }
        else {
          alert("Username/Password is wrong. Try again.");
        }
      }
    });

  };
})

.controller('AboutCtrl', function($scope, AboutService, Config) { 
  var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  var _appinfo = {
    version: '1.00.00',
    code: 'Web',
    device_model: isMobile.any(),
    build_version: ""
  };

  $scope.init = function() {
    if ( Config.isPhonegap ) {
      $scope.appinfo = AboutService.all();
    } 
    else {
      $scope.appinfo = _appinfo;
    }
  };
})

.controller('HomeCtrl', function($rootScope, $scope, $state, $ionicPopup, HomeService) { 

  $scope.init = function() {
    // get show notice
    HomeService.showNotice().then(function(responseData) {
      if (responseData !== null || responseData !== undefined) {        
        var result = responseData.result[0];

        if (result.value === "1") {          
          $scope.showAlert(result.notice);
        }
        else {
          $scope.fetchData();
        }
      }
    })
  };

  $scope.fetchData = function() {
    HomeService.summary().then(function(data) {
      console.log("Success Fetch data!");
      console.log("# Home response : ", data);
      $scope.summary = data.summary;
    });        
  };

  $scope.showAlert = function(content) {
    var alertPopup = $ionicPopup.alert({
      title: 'Notice',
      template: content
    });
    alertPopup.then(function(res) {
      console.log('Tapped!', res);
      $scope.fetchData();
    });
  };

  $scope.showHistory = function(student) {
    $state.go('history', {name: student.fullname});
  };

})

.controller('HeaderCtrl', function($rootScope, $scope, $state, Config) {
  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    console.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    // $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.notAvailable = function($event) {
    // $event.preventDefault();
    if ( Config.isPhonegap ) {
      window.plugins.toast.show("Not Available.", 'long', 'bottom');
    }
    else {
      alert("Not Available.");
    }
  };

  $scope.logout = function($event) {
    // $event.preventDefault();
    $rootScope.user = {};    
    $state.go("login");
  };
})

.controller('HistoryCtrl', function($scope, $stateParams, HistoryService) {

  $scope.name = $stateParams.name;

  $scope.offencehistory = {};

  $scope.init = function() {
    // loading data by name
    HistoryService.getOffenceHistory($scope.name).then(function(data) {
      if (data.offencehistory !== null || data.offencehistory !== undefined ) {
        $scope.offencehistory = data.offencehistory;
        for (i = 0; i < $scope.offencehistory.length; i++ ) {
          var item = $scope.offencehistory[i];
          var submittedDate = item.submitteddate;

          var submittedDateArray = submittedDate.split(" ");
          item.submittedDate = submittedDateArray[0];
          item.submittedTime = submittedDateArray[1];
          item.imgSrc = $scope.getImgSrc(item.offencetype);
          $scope.offencehistory[i] = item;
        }
      }
    });
  };

  $scope.getImgSrc = function(offencetype) {
    var src = "img/";
    switch (offencetype) {
      case "Accessories":
        src = src + "icon_a.png";
        break;

      case "Hair":
        src = src + "icon_h.png";
        break;

      case "Uniform":
        src = src + "icon_u.png";
        break;

      case "Nails":
        src = src + "icon_n.png";
        break;
      case "Tattoos":
        src = src + "icon_t.png";
        break;
    }
    return src;
  }
})

.controller('SubmitCtrl', function($scope, $ionicPopup, $state, SubmitService, Config) {

  $scope.incident = null;

  $scope.students = {};

  $scope.init = function() {
    // load class name
    SubmitService.getClass().then(function(data) {
      console.log("# class response :", data);
      if (data.result !== null) {
        $scope.classes = data.result;       
      }
    });
    // load offence type
    SubmitService.getOffenceType().then(function(data) {
      console.log("# offence type response :", data);
      if (data.result !== null) {
        $scope.offencetypes = data.result;
      }
    });
  };

  // Change the select class option
  $scope.classChanged = function(classItem) {
    var selClass = classItem.class;

    if (selClass === '') {
      return;
    }
    
    document.querySelector("#select-name").disabled = false;

    SubmitService.getClassList(selClass).then(function(data) {
      console.log("# class list response :", data);
      if (data.result !== null) {
        $scope.students = data.result;
      }
    });
  };

  $scope.doSubmit = function(incident) {
    // Check fields
    if (incident === null || incident === undefined ||
      incident.classItem === null || incident.classItem === undefined || 
      incident.student === null || incident.student === undefined || 
      incident.offence === null || incident.offence === undefined ) {

      if (Config.isPhonegap) {
        window.plugins.toast.show("Fields cannot be empty!", 'long', 'bottom');
      }
      else {
        alert("Fields cannot be empty!");
      }

      return;
    }

    // Set the value.
    $scope.incident = incident;

    // confirm Submission
    $scope.showConfirm().then(function(res) {
      if(res) {
        console.log('You are sure');
        SubmitService.setOffenceIncident(incident.classItem.class, incident.student.fullname, incident.offence.offencetype)
        .then(function(data) {
          console.log("# Submit Successed!");
          if (data.error !== null && data.error === false) {
            // goto home
            $state.go('home');
          }
          else {
            if ( Config.isPhonegap ) {
              window.plugins.toast.show("Submission failed!", 'long', 'bottom');
            }
            else {
              alert("Submission failed!");
            }
          }
        });
      } else {
        console.log('You are not sure');
      }
    });

  };

  // A confirm dialog
  $scope.showConfirm = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Confirm Submission',
      template: 'Do you want to submit the following?<br>' +
        'Class: ' + $scope.incident.classItem.class + '<br>' +
        'Name: ' + $scope.incident.student.fullname + '<br>' +
        'Offence: ' + $scope.incident.offence.offencetype
    });
    return confirmPopup;
  };

  $scope.reset = function() {
    $scope.student = {};
    document.getElementById("submitForm").reset();
    document.querySelector("#select-name").disabled = true;
  };

  $scope.reset();
})

.controller('TestCtrl', function($scope, $log) {
  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    // $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.summary = [
    {
      fullname: "Chong Wei Ling",
      class: "104",
      score: "2"
    },
    {
      fullname: "Cai Zhy",
      class: "102",
      score: "1"
    },
    {
      fullname: "MyongHun Li",
      class: "401",
      score: "2"
    },
    {
      fullname: "Zhejin Li",
      class: "602",
      score: "5"
    }
  ];
})