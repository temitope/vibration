// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic','ngCordova']);
var media;
var src= "beep.wav";
ionicApp.run(function($ionicPlatform) {
  
  $ionicPlatform.ready(function() {
    
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    //setup sound stuff
    /*var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    }*/
    if (device.platform == 'Android') {
        src = '/android_asset/www/' + src;  // Android needs the search path explicitly specified
    }
    console.log(src);
    try{
      media = new Media(src, null, null, null);
    }catch(ex){
      console.log("error " + ex);
    }

  });
});

var hi = 3;
var start = 0;

ionicApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('page1', {
    url: '/1',
    templateUrl: 'page1.html',
    controller : "MyCtrl"
  })
  .state('page2', {
    url: '/2',
    templateUrl: 'page2.html',
    //https://gist.github.com/Alexintosh/8e8dd716860c8fdcd08a
    controller : "SettingsCtrl"
  })
  
  $urlRouterProvider.otherwise("/1");
});


ionicApp.factory('$localstorage', ['$window', function($window) {
      return {
        set: function(key, value) {
          $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
          return $window.localStorage[key] || defaultValue || false;
        },
        setObject: function(key, value) {
          $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
          if($window.localStorage[key] != undefined)
            return JSON.parse($window.localStorage[key] || false );
    
          return false;
        },
        remove: function(key){
          $window.localStorage.removeItem(key);
        },
        clear: function(){
          $window.localStorage.clear();
        }
      }
}]);


ionicApp.controller('SettingsCtrl', function($scope, $localstorage){
  console.log("entered settings...set defaults or current saved values");
  //$localstorage.clear();
  $(".csize").val($localstorage.get("csize", "3"));
  $(".cyclenotification").val($localstorage.get("cyclenotification", 1));
  $(".intervalnotification").val($localstorage.get("intervalnotification", 1));

  $(".contentsettings input.csize").change(function(){ 
    //console.log($(this).val()); 
    //console.log($(".csize").val());
    $scope.savesettings();
    $scope.resetcounter();//reset counter when the cycle size changes
    hi = $localstorage.get("csize", 3);
  });
  $(".contentsettings select").change(function(){ 
    $scope.savesettings();
  });
  
  $scope.savesettings= function(){
      console.log("about to save stuff");
      //run any time to set values to storage based on inputs
      $localstorage.set("csize", (isNaN($(".csize").val())?"3":$(".csize").val()));
      $localstorage.set("cyclenotification", $(".cyclenotification").val());
      $localstorage.set("intervalnotification", $(".intervalnotification").val());
  }

  $scope.resetcounter = function(){
      console.log("resetting counter");
      start = 0;
      $(".dacount").html(start +"");
  }

  $scope.$on('$stateChangeStart', 
             function(event, toState, toParams, fromState, fromParams){ 
    $scope.savesettings();
  });

});

ionicApp.controller('MyCtrl', function($scope ,$localstorage, $cordovaVibration, $cordovaMedia, $cordovaDevice){  
    hi = $localstorage.get("csize", "3");
    console.log("cycle size" + hi);
    

    $scope.toggle = function(){
      start++;
      $(".dacount").html(start +"");
      if(start % hi == 0){
        if(trip>0)
          return;//dont interfere with the alert process if its in the middle of intervals
        
        //start=0;
        var trip = 0;

        $cordovaVibration.vibrate(500);//vibrate off bat, then 2 more will come
        if(media)
          media.play();
        else
          console.log("no media var avail");
        var trip_interval = setInterval(function(){
            if(trip<2){
              $cordovaVibration.vibrate(500);
              if(media)
                media.play();
              trip++;
            }else{
              clearInterval(trip_interval);
              trip=0;
            }
        }, 1000);  
      }else{//} if(start<hi){      
          $cordovaVibration.vibrate(500);
      }
    }

});
