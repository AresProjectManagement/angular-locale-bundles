'use strict';

angular.module('angularLocaleBundlesApp', ['angular-locale-bundles'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }])
    .config(['localeBundleFactoryProvider', function (localeBundleFactoryProvider) {
        // URL pattern to fetch locale bundles.  Placeholders: {{bundle}}
        localeBundleFactoryProvider.bundleUrl('/i18n/{{bundle}}.json');

        // URL pattern to fetch locale bundles.  Placeholders: {{bundle}} and {{locale}}
        localeBundleFactoryProvider.bundleLocaleUrl('/i18n/{{bundle}}-{{locale}}.json');

        // Add the locale to the 'Accept-Language' header.  Default is true.
        localeBundleFactoryProvider.useAcceptLanguageHeader(true);

        // Cache AJAX requests.  Default is true.
        localeBundleFactoryProvider.enableHttpCache(true);

        // Transform responses.  Default returns 'response.data'.
        localeBundleFactoryProvider.responseTransformer(function (response) {
            return response.data.body;
        });
    }]);
