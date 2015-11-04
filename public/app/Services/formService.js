(function () {
    'use strict';
    angular
        .module('formServiceModule', [])
        .factory('formService', formService);

    formService.$inject = ['$http'];

    function formService($http) {
        var service = {
            getForms: getForms,
            getForm: getForm,
            addForm: addForm,
            editForm: editForm,
            deleteForm: deleteForm

        };
        return service;


        function getForms(projectId, successFunction, errorFunction) {
            $http.get('/api/form/GetForms?projectId=' + projectId).
              then(successFunction, errorFunction);
        }

        function getForm(formId, successFunction, errorFunction) {
            $http.get('/api/form/GetForm?formId=' + formId).
              then(successFunction, errorFunction);
        }

        function addForm(form, successFunction, errorFunction) {
            $http.post('/api/form/AddForm', form).
              then(successFunction, errorFunction);
        }

        function editForm(form, successFunction, errorFunction) {
            $http.post('/api/form/EditForm', form).
              then(successFunction, errorFunction);
        }

        function deleteForm(form, successFunction, errorFunction) {
            $http.post('/api/form/DeleteForm', form).
              then(successFunction, errorFunction);
        }

    }
})();