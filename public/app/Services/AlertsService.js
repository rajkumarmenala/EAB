(function () {
    'use strict';

    angular
        .module('alertsServiceModule', [])
        .factory('alertsService', alertsService);

    alertsService.$inject = ['$http', '$rootScope'];

    function alertsService($http, $rootScope) {
        var service = {
            RenderErrorMessage: RenderErrorMessage,
            RenderSuccessMessage: RenderSuccessMessage,
            RenderWarningMessage: RenderWarningMessage,
            RenderInformationalMessage: RenderInformationalMessage
        };

        $rootScope.alerts = [];
        $rootScope.MessageBox = "";

        function RenderErrorMessage(message) {
            var messageBox = buildMessage(message);
            $rootScope.alerts = [];
            $rootScope.MessageBox = messageBox;
            $rootScope.alerts.push({ 'type': 'danger', 'msg': '' });
        };

        function RenderSuccessMessage(message) {
            var messageBox = buildMessage(message);
            $rootScope.alerts = [];
            $rootScope.MessageBox = messageBox;
            $rootScope.alerts.push({ 'type': 'success', 'msg': '' });
        };

        function RenderWarningMessage(message) {

            var messageBox = buildMessage(message);
            $rootScope.alerts = [];
            $rootScope.MessageBox = messageBox;
            $rootScope.alerts.push({ 'type': 'warning', 'msg': '' });
        };

        function RenderInformationalMessage(message) {
            var messageBox = buildMessage(message);
            $rootScope.alerts = [];
            $rootScope.MessageBox = messageBox;
            $rootScope.alerts.push({ 'type': 'info', 'msg': '' });
        };

        function buildMessage(message) {
            var messageBox = "";
            if (angular.isArray(message) == true) {
                for (var i = 0; i < message.length; i++) {
                    messageBox = messageBox + message[i] + "<br/>";
                }
            }
            else {
                messageBox = message;
            }
            return messageBox;
        }

        return service;
    }
})();