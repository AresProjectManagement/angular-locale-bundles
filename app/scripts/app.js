'use strict';

angular.module('angularLocaleBundlesApp', ['angular-locale-bundles'])
    .config(['$routeProvider', 'localeBundleFactoryProvider', function ($routeProvider, localeBundleFactoryProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        localeBundleFactoryProvider.url('/i18n/{{bundle}}.json');
        localeBundleFactoryProvider.useAcceptLanguageHeader(false);
    }]);
