var viewProjectController_FormRecord = "";
var viewProjectController_CurrentModule = "";
var tempTableState = [];
var itemsToBeDisplayed = 5;
(function () {
    'use strict';

    var pModule = angular.module('projectModule', ['projectServiceModule', 'alertsServiceModule', 'userServiceModule', 'validation', 'validation.rule', 'ngRoute', 'smart-table'])

    pModule.config(['$routeProvider', '$validationProvider', function ($routeProvider, $validationProvider) {
        $validationProvider.showSuccessMessage = false;

        //Custom validation
        $validationProvider
       .setExpression({
           noSpaceForProject: function (value, scope, element, attrs, param) {
               var regexp = /^\S*$/;
               return (regexp.test(scope.$parent.Name))
           }
       })
             .setDefaultMsg({
                 noSpaceForProject: {
                     error: 'Spaces are not allowed.'
                 }
             })

            .setExpression({
                noSpecialCharector: function (value, scope, element, attrs, param) {
                    var regexp = /[-!$%^&*()_+ |~=`\\@#{}\[\]:";'<>?,\/]/;
                    return (!regexp.test(scope.$parent.RootNamespace))
                }
            })
       .setDefaultMsg({
           noSpecialCharector: {
               error: 'Special charector are not allowed.'
           }
       })

        .setExpression({
            noSpecialCharectorForCompany: function (value, scope, element, attrs, param) {
                var regexp = /[-!$%^&*()_+|~=`\\@#{}\[\]:";'<>?,\/]/;
                return (!regexp.test(scope.$parent.CompanyName))
            }
        })
       .setDefaultMsg({
           noSpecialCharectorForCompany: {
               error: 'Special charector are not allowed.'
           }
       })

        .setExpression
        ({
            noSpecialCharectorForProjectName: function (value, scope, element, attrs, param) {
                var regexp = /[-!$%^&*()_+ |~=`\\@#{}\[\]:";'<>?,.\/]/;
                return (!regexp.test(scope.$parent.Name))
            }
        })
      .setDefaultMsg({
          noSpecialCharectorForProjectName: {
              error: 'Special charector are not allowed.'
          }
      });

        $routeProvider
           .when("/addProject", {
               templateUrl: '/app/Home/Views/ProjectAdd.html',
               controllerUrl: '/app/Home/Controllers/projectController.js',
               publicAccess: true,
               sessionAccess: true
           })
            .when("/viewProject/:projectId", {
                templateUrl: '/app/Home/Views/viewProject.html',
                controllerUrl: '/app/Home/Controllers/projectController.js',
                publicAccess: true,
                sessionAccess: true
            })
            .when("/projectEdit/:projectId", {
                templateUrl: '/app/Home/Views/ProjectEdit.html',
                controllerUrl: '/app/Home/Controllers/projectController.js',
                publicAccess: true,
                sessionAccess: true
            })
    }])
        .config(['$httpProvider', function ($httpProvider) {

            if (!$httpProvider.defaults.headers.get) {
                $httpProvider.defaults.headers.get = {};
            }
            $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
            $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        }])

        .controller("projectController", ['$scope', '$injector', '$cookies', '$routeParams', 'projectService', 'userService', 'alertsService', '$window', 'formService', function ($scope, $injector, $cookies, $routeParams, projectService, userService, alertsService, $window, formService) {
            var $validationProvider = $injector.get('$validation');

            $scope.initializeController = function () {
                $scope.userName = $cookies.get('currentUserName');
                $scope.projects = {};
                var projectId = ($routeParams.projectId || "");
                $scope.projectId = projectId;
                $scope.Name = "";
                $scope.Title = "";
                $scope.Description = "";
                $scope.CurrentFormName = "";
                $scope.CurrentFormTitle = "";
                $scope.CurrentFormDescription = "";
                $scope.RootNamespace = "";
                $scope.CompanyName = "";
                $scope.isProjectExistMessage = false;
                $scope.existErrorMessage = "";
                projectService.getProject(projectId, $scope.fetchProjectCompleted, $scope.fetchError);
                //formService.getForms(projectId, $scope.fetchFormCompleted, $scope.fetchFormError);

                $scope.getUserProfile($scope.userName);
            }

            // ********************* Start project **************************

            $scope.fetchProjectCompleted = function (response) {
                var project = response.data;
                $cookies.put('projectId', $scope.projectId);
                $scope.Name = project.Name;
                $scope.Title = project.Title;
                $scope.Description = project.Description;
                $scope.RootNamespace = project.RootNamespace;
                $scope.CompanyName = project.CompanyName;
                $cookies.put('projectName', $scope.Name);
                $scope.getPages();
            }

            $scope.getProjects = function () {
                projectService.getProjects($scope.userName, $scope.fetchCompleted, $scope.fetchError);
            }

            $scope.fetchCompleted = function (response) {
                $scope.projects = $scope.trimDescription(response.data);
            }

            $scope.fetchError = function (response) {
                //
            }

            $scope.viewProject = function (projectId) {
                $cookies.put('projectId', projectId);
                window.location = "#/viewProject/" + projectId;
            }

            // Helper Methods
            $scope.trimDescription = function (objectData) {
                angular.forEach(objectData, function (index, value) {
                    if (index.Description != null && index.Description.length >= 28) {
                        var substring = index.Description.substring(0, 28);
                        index.Description = substring + "...";
                    }
                });
                return objectData;
            }

            $scope.addProject = function () {
                var form = $scope.addProjectForm;
                $validationProvider.validate(form)
                .success($scope.addProjectSuccess)
                .error($scope.addProjectFormError)
            }

            $scope.addProjectSuccess = function () {
                $scope.$broadcast('show-errors-check-validity');
                if ($scope.addProjectForm.$valid) {
                    $scope.getDublicateProjectDetails();
                }
            }

            $scope.addCompleted = function (response) {
                window.location = "#/Home";
                $window.location.reload();
                alertsService.RenderSuccessMessage('Project added');
            }

            $scope.addProjectFormError = function () {

            }

            $scope.createProject = function () {
                var project = new Object();
                project.Name = $scope.Name;
                project.Id = $cookies.get('projectId');
                project.Title = $scope.Title;
                project.Description = $scope.Description;
                project.RootNamespace = $scope.RootNamespace;
                project.CompanyName = $scope.CompanyName;
                project.UserName = $scope.userName;
                return project;
            }

            $scope.cancel = function (response) {
                window.location = "#/Home";
            }

            $scope.buildStatus = function () {
                window.location = "#/BuildStatus";
            }

            $scope.updateProject = function () {
                var form = $scope.updateProjectForm;
                $validationProvider.validate(form)
                .success($scope.updateProjectSuccess)
                .error($scope.updateProjectSuccessError)
            }

            $scope.updateProjectSuccess = function () {
                var project = $scope.createProject();
                console.log(project);
                if ($scope.updateProjectForm.$valid) {
                    projectService.editProject(project, $scope.updateProjectComplete, $scope.editError);
                }
            }

            $scope.updateProjectSuccessError = function () {

            }

            $scope.updateProjectComplete = function () {
                window.location = "#/Home";
            }

            $scope.editProject = function () {
                window.location = "#/projectEdit/" + $scope.projectId;
            }

            $scope.editError = function (response) {
                //
            }

            $scope.editProjectCancel = function (response) {
                window.location = "#/viewProject/" + $routeParams.projectId;
            }

            $scope.deleteProject = function (projectId) {
                viewProjectController_CurrentModule = "project";
                $scope.TitleMessage = "Delete confirmation";
                $scope.ConfirmationMessage = "Are you sure you want to delete " + $scope.Title;
                $scope.buttonsShowHide = true;
                $scope.showModal = true;
            }

            // *********************** End project *************

            // *********************** Start Form  *************

            $scope.buildPublish = function () {
                window.location = "#/PublishDownload";
            }

            $scope.showAddForm = function () {
                window.location = "#/addProject";
            }

            $scope.addNewForm = function () {
                $cookies.put('currentFormId', "0");
                window.location = "#/formAdd";
            }

            $scope.viewFormRecord = function (formId) {
                $cookies.put('formId', formId);
                formService.getForm(formId);
                window.location = "#/ViewForm/" + formId;
            }

            $scope.getForms = function (projectId) {
                formService.getForms(projectId, $scope.fetchFormCompleted, $scope.fetchFormError);
            }

            $scope.fetchFormCompleted = function (response) {
                $scope.dividePageSlot(response);
            }

            //Pagination Logic start

            $scope.getPages = function (tableState) {
                if (tableState != null) {
                    var start = 0;
                    var pagination = tableState.pagination;
                    start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.
                    $scope.itemsByPage = itemsToBeDisplayed; //no of items to be displayed.
                    tableState.pagination.number = itemsToBeDisplayed;
                    tempTableState = tableState;
                    formService.getForms($scope.projectId, $scope.fetchFormCompleted, $scope.fetchFormError);
                }
            }

            $scope.dividePageSlot = function (response) { //logic for pagination
                $scope.rowCollection = [];
                var totalLength = response.data.length;
                var pageCount = parseInt(totalLength / itemsToBeDisplayed);
                var pageModulo = totalLength % itemsToBeDisplayed;
                if (pageModulo != 0) {
                    pageCount++;
                }
                tempTableState.pagination.numberOfPages = pageCount;
                var dataRange = parseInt(tempTableState.pagination.start) + parseInt(tempTableState.pagination.number);
                if (dataRange > totalLength) {
                    dataRange = totalLength;
                }
                for (var i = tempTableState.pagination.start; i < dataRange; i++) {
                    $scope.rowCollection.push(response.data[i]);
                }
                $scope.displayedCollection = [].concat($scope.rowCollection);
            }

            //Pagination Logic End

            $scope.fetchFormError = function (response) {
                //
            }

            $scope.editFormRecord = function (formId) {
                $cookies.put('currentFormId', formId);
                window.location = "#/formEdit/" + formId;
            }

            $scope.deleteFormRecord = function (crrForm) {
                viewProjectController_FormRecord = crrForm;
                viewProjectController_CurrentModule = "form";
                $scope.TitleMessage = "Delete confirmation";
                $scope.ConfirmationMessage = "Are you sure you want to delete " + crrForm.Title;
                $scope.buttonsShowHide = true;
                $scope.showModal = true;
            }

            $scope.deleteFormCompleted = function (response) {
                formService.getForms($scope.projectId, $scope.fetchFormCompleted, $scope.fetchFormError);
                $scope.showModal = false;
            }

            $scope.deleteFormError = function (response) {
                //
            }

            // *********************** End Form  *************

            $scope.deletePopUpConfirmation = function () {
                if (viewProjectController_CurrentModule == "project") {
                    var project = $scope.createProject();
                    projectService.deleteProject(project, $scope.deleteCompleted, $scope.deleteError);
                }
                else if (viewProjectController_CurrentModule == "form") {
                    formService.deleteForm(viewProjectController_FormRecord, $scope.deleteFormCompleted, $scope.deleteFormError);
                }
            }

            $scope.deleteCompleted = function (response) {
                window.location = "#/Home";
                $window.location.reload();
            }

            // *********************** Build Project  *************
            $scope.buildProject = function () {
            }

            $scope.createProjectBuildObject = function () {
                var project = new Object();
                project.Id = $cookies.get('projectId');
                project.UserName = $scope.UserName;
                project.Name = $scope.Name;
                project.Title = $scope.Title;
                project.Description = $scope.Description;
                project.RootNamespace = $scope.RootNamespace;
                project.CompanyName = $scope.CompanyName;
                return project;
            }

            $scope.buildProjectCompleted = function (response) {
                $window.location.reload();
                alert('Project built successfully!');
                // alertsService.RenderSuccessMessage('Project built successfully!');
            }

            $scope.buildProjectError = function (response) {
                alert('Project build failed!');
                //  alertsService.RenderSuccessMessage('Project built failed!');
            }

            //load profile image functionalities
            //Start

            $scope.getUserProfile = function (UserName) {
                userService.showUserProfile(UserName, $scope.getUserProfileCompleted, $scope.getUserProfileError);
            }

            $scope.getUserProfileCompleted = function (response) {
                $scope.User.FirstName = response.data.FirstName;
                $scope.User.LastName = response.data.LastName;
                if (response.data.ProfilePicture != null) {
                    $cookies.put('profilePicture', response.data.ProfilePicture);
                    $scope.getUploadedImage(response.data.ProfilePicture);
                }
            }

            $scope.getUploadedImage = function (pictureName) {
                userService.getUploadedImage(pictureName, $scope.getUploadedImageCompleted, $scope.getUserProfileError);
            }

            $scope.getUploadedImageCompleted = function (response) {
                $scope.User.imageData = response.data;
            }

            //implementation of checking dublicate project
            $scope.getDublicateProjectDetails = function () {
                projectService.projectExistsDetails($scope.createProject(), $scope.fetchProjectsCompleted, $scope.fetchError);
            }

            $scope.fetchProjectsCompleted = function (response) {
                if (response.data) {
                    $scope.isProjectExistMessage = true;
                    $scope.existErrorMessage = "Project name already registered with you or some different User. Please use some alternative name!";
                }
                else {
                    $scope.isProjectExistMessage = false;
                    $scope.existErrorMessage = "";
                    projectService.addProject($scope.createProject(), $scope.addCompleted);
                }
            }

        }]);
})();
