(function () {
    'use strict';
    angular
        .module('userServiceModule', [])
        .factory('userService', userService);

    userService.$inject = ['$http'];

    function userService($http) {
        var service = {
            showUserProfile: showUserProfile,
            editUserProfile: editUserProfile,
            uploadImage: uploadImage,
            getUploadedImage: getUploadedImage

        };
        return service;

        function showUserProfile(userName, successFunction, errorFunction) {
            $http.get('/api/user/GetUserDetails?userName=' + userName).
            then(successFunction, errorFunction);
        }

        function editUserProfile(user, successFunction, errorFunction) {
            $http.post('/api/user/EditUserProfile', user).
            then(successFunction, errorFunction);
        }

        function uploadImage(image, successFunction, errorFunction) {
            $http.post('/api/user/UploadImage', image).
           then(successFunction, errorFunction);
        }

        function getUploadedImage(imageName, successFunction, errorFunction) {
            $http.get('/api/user/GetUploadedImage?imageName=' + imageName).
           then(successFunction, errorFunction);
        }

    }
})();

