(function () {
    'use strict';
    angular
        .module('formFieldServiceModule', [])
        .factory('formFieldService', formFieldService);
    formFieldService.$inject = ['$http'];

    function formFieldService($http) {
        var service = {
            getFields: getFields,
            getField: getField,
            addField: addField,
            editField: editField,
            deleteField: deleteField,
            getFieldTypes: getFieldTypes,
            getFormFieldView: getFormFieldView,
            getFieldView: getFieldView,
            editFormFieldView: editFormFieldView
        };
        return service;


        function getFields(formID, successFunction, errorFunction) {
            $http.get('/api/formField/GetFormFields?formId=' + formID).
              then(successFunction, errorFunction);
        }

        function getField(fieldID, successFunction, errorFunction) {
            $http.get('/api/formField/GetFormField?fieldID=' + fieldID).
              then(successFunction, errorFunction);
        }

        function addField(FormField, successFunction, errorFunction) {
            $http.post('/api/formField/AddFormField', FormField).
              then(successFunction, errorFunction);
        }

        function editField(formFields, successFunction, errorFunction) {
            $http.post('/api/formField/EditFormField', formFields).
              then(successFunction, errorFunction);
        }

        function deleteField(formFields, successFunction, errorFunction) {
            $http.post('/api/formField/DeleteFormField', formFields).
              then(successFunction, errorFunction);
        }

        function getFieldTypes(successFunction, errorFunction) {
            $http.get('/api/formField/GetFieldTypes').
              then(successFunction, errorFunction);
        }

        function getFormFieldView(fieldID, successFunction, errorFunction) {
            $http.get('/api/formField/GetFormFieldView?fieldID=' + fieldID).
              then(successFunction, errorFunction);
        }

        function getFieldView(formFieldViewId, successFunction, errorFunction) {
            $http.get('/api/formField/GetFieldView?formFieldViewId=' + formFieldViewId).
              then(successFunction, errorFunction);
        }
        
        function editFormFieldView(formFieldView, successFunction, errorFunction) {
            $http.post('/api/formField/EditFormFieldView', formFieldView).
              then(successFunction, errorFunction);
        }
    }
})();