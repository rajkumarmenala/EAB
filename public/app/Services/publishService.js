(function () {
    'use strict';
    angular
        .module('publishServiceModule', [])
        .factory('publishService', publishService);

    publishService.$inject = ['$http'];

    function publishService($http) {
        var service = {
            getDatabaseConfiguration: getDatabaseConfiguration,
            addDatabaseConfiguration: addDatabaseConfiguration,
            editDatabaseConfiguration: editDatabaseConfiguration,
            deleteDatabaseConfiguration: deleteDatabaseConfiguration,
            getWebAppConfiguration: getWebAppConfiguration,
            addWebAppConfiguration: addWebAppConfiguration,
            editWebAppConfiguration: editWebAppConfiguration,
            deleteWebAppConfiguration: deleteWebAppConfiguration,
            getPublishStatus: getPublishStatus,
            getBuildStatus: getBuildStatus,
            getDownloadFile: getDownloadFile,
            portExistsDetails: portExistsDetails
        };
        return service;

        function getDatabaseConfiguration(projectId, successFunction, errorFunction) {
            $http.get('/api/publish/GetDatabaseConfiguration?projectId=' + projectId).
              then(successFunction, errorFunction);
        }

        function addDatabaseConfiguration(databaseConfiguration, successFunction, errorFunction) {
            $http.post('/api/publish/AddDatabaseConfiguration', databaseConfiguration).
              then(successFunction, errorFunction);
        }

        function editDatabaseConfiguration(databaseConfiguration, successFunction, errorFunction) {
            $http.post('/api/publish/EditDatabaseConfiguration', databaseConfiguration).
              then(successFunction, errorFunction);
        }

        function deleteDatabaseConfiguration(webAppConfiguration, successFunction, errorFunction) {
            $http.post('/api/publish/DeleteDatabaseConfiguration', databaseConfiguration).
              then(successFunction, errorFunction);
        }

        function getWebAppConfiguration(projectId, successFunction, errorFunction) {
            $http.get('/api/publish/GetWebAppConfiguration?projectId=' + projectId).
              then(successFunction, errorFunction);
        }

        function addWebAppConfiguration(webAppConfiguration, successFunction, errorFunction) {
            $http.post('/api/publish/AddWebAppConfiguration', webAppConfiguration).
              then(successFunction, errorFunction);
        }

        function editWebAppConfiguration(webAppConfiguration, successFunction, errorFunction) {
            $http.post('/api/publish/EditWebAppConfiguration', webAppConfiguration).
              then(successFunction, errorFunction);
        }

        function deleteWebAppConfiguration(webAppConfiguration, successFunction, errorFunction) {
            $http.post('/api/publish/DeleteWebAppConfiguration', webAppConfiguration).
              then(successFunction, errorFunction);
        }

        function getPublishStatus(projectId, successFunction, errorFunction) {
            $http.get('/api/publish/getPublishStatus?projectId=' + projectId).
              then(successFunction, errorFunction);
        }

        function getBuildStatus(projectId, successFunction, errorFunction) {
            $http.get('/api/publish/getPublishStatus?projectId=' + projectId).
              then(successFunction, errorFunction);
        }

        function getDownloadFile(projectId, successFunction, errorFunction) {
            $http.get('/api/publish/GetDownloadFile?projectId=' + projectId).
              then(successFunction, errorFunction);
        }

        function portExistsDetails(portNumber, successFunction, errorFunction) {
            $http.post('/api/publish/PortExistsDetails?portNumber=' + portNumber).
              then(successFunction, errorFunction);
        }
    }
})();