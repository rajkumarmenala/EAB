(function () {
    'use strict';

    angular
       .module('interceptorServiceModule', [])
       .factory('interceptorService', interceptorService);

    interceptorService.$inject = ['$q', '$rootScope'];

    function request(config) {
        return config || $q.when(config);
    };

    function requestError(request) {
        return $q.reject(request);
    };

    function response(response) {
        return response || $q.when(response);
    };

    function responseError(response) {

        if (response && response.status === 404) {
            window.location = "#/notFound";
        }

        if (response && response.status >= 500) {
            window.location = "#/internalServerError";
        }

        return $q.reject(response);
    };

    function interceptorService($q, $rootScope) {
        var service = {
            request: request,
            requestError: requestError,
            response: response,
            responseError: responseError
        };
        return service;
    }
})();