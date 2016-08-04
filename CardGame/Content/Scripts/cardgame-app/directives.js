'use strict';

angular.module('CardGameApp')
.directive('onReturnKey',
    function() {
        var link = function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.onReturnKey);
                    });
                    event.preventDefault();
                }
            });
        };

        return {
            link: link
        }
    }
);