// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var ionicApp = angular.module('starter', ['ionic','ngCordova']);
var media_interval;
var media_cycle;
var src_beepintervalnotification= "beepshort.wav";
var src_beepcyclenotification= "beepthrice.wav";
//var src= "beep.wav";
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
        src_beepintervalnotification = '/android_asset/www/' + src_beepintervalnotification;  // Android needs the search path explicitly specified
        src_beepcyclenotification = '/android_asset/www/' + src_beepcyclenotification;  // Android needs the search path explicitly specified
    }
    console.log(src_beepcyclenotification);
    console.log(src_beepintervalnotification);
    try{
      media_interval = new Media(src_beepintervalnotification, null, null, null);
      media_cycle = new Media(src_beepcyclenotification, null, null, null);
    }catch(ex){
      console.log("error " + ex);
    }

  });
});

var hi = 7;
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

        var cnote = $localstorage.get("cyclenotification", 1);

        if(cnote == 1 || cnote ==3)
          $cordovaVibration.vibrate(400);//vibrate off bat, then 2 more will come
        
        if(media_cycle && (cnote ==3 || cnote ==2))
          media_cycle.play();
        
        var trip_interval = setInterval(function(){
            if(trip<2){
              if(cnote == 1 || cnote ==3)
                $cordovaVibration.vibrate(400);
              
              trip++;
            }else{
              clearInterval(trip_interval);
              trip=0;
            }
        }, 500);  
      }else{//} if(start<hi){      
          var inote = $localstorage.get("intervalnotification", 1);
          if(media_interval && inote==2)
            media_interval.play();

          if(inote==1)
            $cordovaVibration.vibrate(400);
      }
    }

});
