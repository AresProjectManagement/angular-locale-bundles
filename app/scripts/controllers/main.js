'use strict';

angular.module('angularLocaleBundlesApp')
    .controller('MainCtrl', ['$scope', 'localeBundleFactory', function ($scope, localeBundleFactory) {

        $scope.numbers = localeBundleFactory('numbers', 'en_US').translations;

        $scope.$watch('bundle.locale', function (locale) {
            $scope.numbers = localeBundleFactory('numbers', locale).translations;
        });

        $scope.locales = [
            {name: 'default', value: ''},
            {name: 'English (US)', value: 'en_US'},
            {name: 'English (AU)', value: 'en_AU'},
            {name: 'Spanish (US)', value: 'es_US'}
        ];

    }]);
