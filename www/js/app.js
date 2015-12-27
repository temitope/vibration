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


  });
});

var hi = 14;
var start = 0;
ionicApp.controller('myCtrl', function($scope , $cordovaVibration, $cordovaMedia, $cordovaDevice){
    
    $scope.toggle = function(){
          /*var mediaStatusCallback = function(status) {
              if(status == 1) {
                  $ionicLoading.show({template: 'Loading...'});
              } else {
                  $ionicLoading.hide();
              }
          }*/
          //if (device.platform == 'Android') {
           //   src = '/android_asset/www/' + src;  // Android needs the search path explicitly specified
          //}
          console.log(src);
          console.log(JSON.stringify($cordovaMedia));
          
          try{
            media = new Media(src, null, null, null);
          }catch(ex){
            console.log("error " + ex);
          }
      

      start++;
      $(".dacount").html(start +"");
      if(start==hi){
        if(trip>0)
          return;//dont interfere with the alert process if its in the middle of intervals
        
        start=0;
        var trip = 0;

        $cordovaVibration.vibrate(500);//vibrate off bat, then 2 more will come
        if(media)
          media.play();
        else
          console.log("no media var avail");
        var trip_interval = setInterval(function(){
            if(trip<2){
              $cordovaVibration.vibrate(500);
              trip++;
            }else{
              clearInterval(trip_interval);
              trip=0;
            }
        }, 1000);  
      }else if(start<hi){
          
          $cordovaVibration.vibrate(500);
      }
      

    }

});
