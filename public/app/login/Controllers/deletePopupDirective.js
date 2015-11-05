(function () {

    "use strict";
    angular
         .module('popUpModel', [])
        .directive('modal',['$timeout', function($timeout) {
            return {
                template: '<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-hidden="true">' +
                    '<div class="modal-dialog modal-sm">' +
                         '<div class="modal-content">' +
                             '<div class="modal-header">' +
                                 '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                                     '<span aria-hidden="true">×</span>' +
                                 '</button>' +
                                 '<h4 class="modal-title" id="myModalLabel2">{{TitleMessage}}</h4>' +
                             '</div>' +
                             '<div class="modal-body">' +

                                 '<p id="pConfirmationText">{{ConfirmationMessage}}</p>' +
                             '</div>' +
                             '<div ng-show="buttonsShowHide" class="modal-footer">' +
                                 '<button  ng-click="popupCancel()" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
                                 '<button  ng-click="deletePopUpConfirmation()" class="btn btn-primary yea_delete">OK</button>' +
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
                        $timeout(function () {
                            scope.$parent[attrs.visible] = true;
                        });
                    });

                    $(element).on('hidden.bs.modal', function () {
                        $timeout(function () {
                            scope.$parent[attrs.visible] = false;
                        });
                    });
                }
            };

        }]);


})();