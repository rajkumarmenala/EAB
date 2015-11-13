(function () {
    'use strict';
    var mainModule = angular.module('mainModule', ['interceptorServiceModule', 'applicationServiceModule', 'userServiceModule', 'projectModule', 'formFieldModule', 'formModule', 'alertsServiceModule', 'publishModule',
        'angular-loading-bar', 'userModule', 'ngRoute', 'ngResource', 'ngCookies', 'ngSanitize']);

    mainModule.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider, interceptorService) {
            $routeProvider


                .when("/notFound", {
                    templateUrl: '/app/Common/Views/NotFound.html',
                    publicAccess: true,
                    sessionAccess: true
                })
                .when("/internalServerError", {
                    templateUrl: '/app/Common/Views/InternalServerError.html',
                    publicAccess: true,
                    sessionAccess: true
                })
                .when("/", {
                    redirectTo: '/Home',
                    controllerUrl: '/app/Home/Controllers/ProjectController.js',
                    resolve: {
                        arguments: function ($location) {
                            //$rootScope.displayContent = true;
                            if ($cookies.getObject('isAuthenticated') == true) {
                                $scope.UserName = $cookies.get('currentUserName');
                                $scope.getUserProfile();
                                $scope.projectList();
                            } else {
                                // set timeout needed to prevent AngularJS from raising a digest error 
                                setTimeout(function () {
                                    window.location = "/login";
                                }, 10);
                            }

                        }
                    },
                    publicAccess: true,
                    sessionAccess: true
                })
                .otherwise({
                    redirectTo: '/notFound',
                    templateUrl: '/app/Common/Views/NotFound.html',
                    publicAccess: true,
                    sessionAccess: true
                })
                // $locationProvider.html5Mode(true).hashPrefix('!');
            $httpProvider.interceptors.push('interceptorService');

    }])
        .controller("defaultController", function ($scope, $rootScope, $http, $q, $routeParams, $window, $location, $resource, $cookies, applicationService, userService, projectService) {

            $scope.initializeController = function () {
                $scope.isAuthenicated = false;
                $scope.UserName = '';
                $scope.User = {};
                applicationService.initializeApplication($scope.initializeApplicationComplete, $scope.initializeApplicationError);
            }

            $scope.initializeApplicationComplete = function (response) {
                //$rootScope.displayContent = true;
                if ($cookies.getObject('isAuthenticated') == true) {
                    $scope.UserName = $cookies.get('currentUserName');
                    $scope.getUserProfile();
                    $scope.projectList();
                    $scope.title = applicationService.getApplicationTitle();
                } else {
                    // set timeout needed to prevent AngularJS from raising a digest error 
                    setTimeout(function () {
                        window.location = "/login";
                    }, 10);
                }
            }

            $scope.initializeApplicationError = function (response) {}

            $scope.logout = function () {
                applicationService.logout($scope.logoutCompleted, $scope.logoutError);
            }

            $scope.logoutCompleted = function (response) {
                if (response.status == 200) {
                    $cookies.put('currentUserName', null);
                    $cookies.put('isAuthenticated', false);
                    window.location = "/login";
                }
            }

            $scope.logoutError = function (response) {
                $scope.clearValidationErrors();
            }

            $scope.showUserProfile = function () {
                window.location = "/#/userProfile";
            }

            $scope.getUserProfile = function () {
                userService.showUserProfile($scope.UserName, $scope.getUserProfileCompleted, $scope.getUserProfileError);
            }

            $scope.getUserProfileCompleted = function (response) {
                $scope.User = response.data;
            }

            $scope.getUserProfileError = function (response) {
                $scope.clearValidationErrors();
            }


            //Project list starts
            $scope.projectList = function () {
                projectService.getProjects($scope.UserName, $scope.fetchCompleted, $scope.fetchError);
            }

            $scope.fetchCompleted = function (response) {
                $scope.projects = TrimDescription(response.data);
            }

            $scope.fetchError = function (response) {
                //
            }

            // Helper Methods
            function TrimDescription(objectData) {
                angular.forEach(objectData, function (index, value) {
                    if (index.Description.length >= 28) {
                        var substring = index.Description.substring(0, 20);
                        index.Description = substring + "...";
                    }
                });
                return objectData;
            }
            //Project list ending

        });
})();