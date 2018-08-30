var app =angular.module("myApp",["ngRoute"]);

app.config(function($routeProvider){
    $routeProvider.when("/",{
      templateUrl:"templates/home.html"
    }).when("/top",{
        templateUrl:"templates/top.html"
    }).when("/worldmap",{
        templateUrl:"templates/worldmap.html"
    }).when("/findplace",{
      templateUrl:"templates/findplace.html"
    }).when("/aboutus",{
      templateUrl:"templates/aboutus.html"
    }).when("/contactus",{
      templateUrl:"templates/contactus.html"
    }).when("/livechat",{
      templateUrl:"templates/livechat.html"
    }).when("/request",{
      templateUrl:"templates/request.html"
    });

});
