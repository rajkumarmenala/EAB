(function () {
    'use strict';
    angular
        .module('projectServiceModule', [])
        .factory('projectService', projectService);

    projectService.$inject = ['$http'];

    function projectService($http) {
        var service = {
            getProjects: getProjects,
            getProject: getProject,
            addProject: addProject,
            editProject: editProject,
            deleteProject: deleteProject,
            buildProject: buildProject,
            projectExistsDetails: projectExistsDetails

        };
        return service;
        

        function getProjects(userName, successFunction, errorFunction) {
            $http.get('/api/project/GetProjects?userName=' + userName).
              then(successFunction, errorFunction);
        }

        function getProject(projectId, successFunction, errorFunction) {
            $http.get('/api/project/GetProject?projectId=' + projectId).
              then(successFunction, errorFunction);
        }

        function addProject(project, successFunction, errorFunction) {
            $http.post('/api/project/AddProject', project).
              then(successFunction, errorFunction);
        }

        function editProject(project, successFunction, errorFunction) {
            $http.post('/api/project/EditProject', project).
              then(successFunction, errorFunction);
        }

        function deleteProject(project, successFunction, errorFunction) {
            $http.post('/api/project/DeleteProject', project).
              then(successFunction, errorFunction);
        }

        function buildProject(project, successFunction, errorFunction) {
            $http.post('/api/project/BuildProject', project).
              then(successFunction, errorFunction);
        }

        function projectExistsDetails(projectName, successFunction, errorFunction) {
            $http.post('/api/project/ProjectExistsDetails', projectName).
              then(successFunction, errorFunction);
        }
        
    }
})();

