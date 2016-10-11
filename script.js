angular.module('app', [])
    .directive('smartButton', function($timeout){
        return {
            template: '<button class="btn"><span ng-if="showSpinner">SPINNER</span>{{test}}</button>',
            scope: {
                loading: '=',
                test: '@'
            },
            require: 'smartButton',
            controller: function() {
                this._handlers =[];// массив фунуций директив, котрые подписаны на событие в smart-button
                this.onSpinnerChange = function(fn) {
                    this._handlers.push(fn);
                }
            },
            link: function(scope, $element, $attrs, smartButtonCtrl) {
                scope.showSpinner = false;
                scope.$watch('loading', function(newValue) {
                    if(newValue) {
                        $timeout(function() {
                            scope.showSpinner = true;
                            console.log(smartButtonCtrl._handlers);
                            smartButtonCtrl._handlers.forEach(function(item) {
                                item(scope.showSpinner);
                            });
                        }, 1000);
                    } else {
                        scope.showSpinner = false;
                        smartButtonCtrl._handlers.forEach(function(item) {
                            item(scope.showSpinner);
                        });
                    }
                })
            }
        }
    })
    .directive('makeTransparent', function() {
        return {
            require: 'smartButton',
            link: function(scope, $element, $attrs, smartButtonCtrl) {
                smartButtonCtrl.onSpinnerChange(function(value) {
                    $element[0].style.opacity = value ? 0.5 : 1;
                });
            }
        }
    });

