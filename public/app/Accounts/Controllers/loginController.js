(function () {
    'use strict';

    angular
        .module('loginModule', ['interceptorServiceModule', 'accountServiceModule', 'applicationServiceModule', 'alertsServiceModule',
          'validation', 'validation.rule', 'angular-loading-bar', 'ngRoute', 'ngResource', 'ngCookies', 'ngSanitize'])

    .config(['$httpProvider', '$validationProvider', function ($httpProvider, $validationProvider, interceptorService) {
            $validationProvider.showSuccessMessage = false;
            $httpProvider.interceptors.push('interceptorService');

            // custom validator for password and confirmed password comapare
            $validationProvider
                .setExpression({
                    passwordCompare: function (value, scope, element, attrs, param) {
                        return (scope.$parent.Password == scope.$parent.ConfirmPassword)
                    }
                })
                .setDefaultMsg({
                    passwordCompare: {
                        error: 'Password and confirmed password is not matched!'

                    }
                });
    }])
        .controller("loginController", ['$scope', '$injector', '$rootScope', '$resource', 'accountsService', '$cookies', 'applicationService', 'alertsService', '$window', function ($scope, $injector, $rootScope, $resource, accountsService, $cookies, applicationService, alertsService, $window) {
            var $validationProvider = $injector.get('$validation');

            $scope.initializeController = function () {
                $scope.UserName = "";
                $scope.Password = "";
                $scope.ConfirmPassword = "";
                $scope.IsSuccess = true;
                $scope.RememberMe = true;
                $scope.showModal = false;
                $scope.IsLoginFailed = true;
                $scope.failedErrorMessage = "";
                $scope.title = applicationService.getApplicationTitle();
            }

            $scope.onKeyPress = function ($event) {
                var keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    if ($event.target.name == "required") {
                        $scope.login($scope.loginForm);
                    } else {
                        $scope.register($scope.registrationForm);
                    }
                }
            };

            $scope.login = function (form) {
                //                $validationProvider.validate(form)
                //                    .success($scope.loginFormsubmitSuccess)
                //                    .error($scope.loginFormSubmitError);
                $validationProvider.validate(form)
                    .success($scope.loginFormsubmitSuccess)
                    .error($scope.loginFormSubmitError);
            }

            $scope.loginFormsubmitSuccess = function () {
                var user = $scope.createLoginCredentials();
                accountsService.login(user, $scope.loginCompleted, $scope.loginError);
            }

            $scope.loginFormSubmitError = function () {

            }

            $scope.loginCompleted = function (response) {
                $scope.failedErrorMessage = "";
                $scope.errorMessage = "";
                if (response.status == 200) {
                    if (response.data === "Invalid username or password.") {
                        $scope.IsLoginFailed = false;
                        $scope.failedErrorMessage = response.data;
                    } else {
                        $cookies.put('currentUserName', response.data.User.UserName);
                        $cookies.put('isAuthenticated', true);
                        window.location = "/";
                    }
                }
            }

            $scope.loginError = function (response) {
                $scope.clearValidationErrors();
            }

            $scope.register = function (form) {
                //                $validationProvider.validate(form)
                //                    .success($scope.registrationFormsubmitSuccess)
                //                    .error($scope.registrationFormsubmitError);
                var user = $scope.createUserForRegister();
                accountsService.register(user, $scope.registerCompleted, $scope.registerError);
            }

            $scope.registrationFormsubmitSuccess = function () {
                alert('registrationFormsubmitSuccess');
                var user = $scope.createUserForRegister();
                accountsService.register(user, $scope.registerCompleted, $scope.registerError);
            }

            $scope.registrationFormsubmitError = function () {

            }

            $scope.registerCompleted = function (response) {
                $scope.failedErrorMessage = "";
                $scope.errorMessage = "";
                if ((response.status == 200) && (response.data.length == 0)) {
                    $scope.ConfirmationMessage = "Login account successfully created.";
                    $scope.showModal = true;
                }
                if (response.data.length >= 1) {
                    $scope.IsSuccess = false;
                    $scope.errorMessage = response.data[0].Description;
                }

            }

            $scope.PopUpConfirmation = function () {
                $scope.showModal = false;
                $scope.clearFormError();
                window.location = "/login";
            }

            $scope.registerError = function (response) {
                $scope.clearValidationErrors();
            }

            $scope.clearValidationErrors = function () {
                $scope.UserNameInputError = false;
                $scope.PasswordInputError = false;
                $scope.ConfirmPasswordInputError = false;
            }

            $scope.createLoginCredentials = function () {
                var user = new Object();
                user.UserName = $scope.UserName;
                user.Password = $scope.Password;
                user.RememberMe = $scope.RememberMe;
                return user;
            }

            $scope.createUserForRegister = function () {
                var user = new Object();
                user.Email = $scope.UserName;
                user.Password = $scope.Password;
                user.ConfirmPassword = $scope.ConfirmPassword;
                return user;
            }

            $scope.clearFormError = function () {
                $scope.failedErrorMessage = "";
                $scope.errorMessage = "";
                $validationProvider.reset($scope.registrationForm);
                $validationProvider.reset($scope.loginForm);
            }
    }])

    //for confirmation popup html.
    .directive('modal', function () {
        return {
            template: '<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">' +
                '<div class="modal-dialog modal-sm">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                '<span aria-hidden="true">×</span>' +
                '</button>' +
                '<h4 class="modal-title" id="myModalLabel2">Login confirmation Details.</h4>' +
                '</div>' +
                '<div class="modal-body">' +

                '<p id="pConfirmationText">{{ConfirmationMessage}}</p>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button  ng-click="PopUpConfirmation()" class="btn btn-primary yea_delete">OK</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.$watch(attrs.visible, function (value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$parent[attrs.visible] = true;
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$parent[attrs.visible] = false;
                });
            }
        };

    })
})();