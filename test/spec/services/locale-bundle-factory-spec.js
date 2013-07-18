describe('Service: localeBundleFactory', function () {
    'use strict';


    // load the service's module
    beforeEach(function () {
        module('angular-locale-bundles');
    });

    describe('Config Option: useAcceptLanguageHeader = false', function () {
        // load the service's module
        beforeEach(function () {
            module(function (localeBundleFactoryProvider) {
                localeBundleFactoryProvider.bundleLocaleUrl('/i18n/{{bundle}}_{{locale}}.json');
                localeBundleFactoryProvider.bundleUrl('/i18n/{{bundle}}.json');
                localeBundleFactoryProvider.useAcceptLanguageHeader(false);
            });
        });

        // instantiate service
        var localeBundleFactory,
            $httpBackend;

        beforeEach(inject(function (_localeBundleFactory_, $injector) {
            localeBundleFactory = _localeBundleFactory_;
            $httpBackend = $injector.get('$httpBackend');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should create a LocaleBundle and fetch the locale bundle with the locale set in the url', function () {

            var headers = {"Accept": "application/json, text/plain, */*", "X-Requested-With": "XMLHttpRequest"};

            $httpBackend.expectGET('/i18n/:bundle_:locale.json', headers).respond({body: {a: 1, b: 2}});

            var bundle = localeBundleFactory(':bundle', ':locale');

            $httpBackend.flush();
        });

        it('should create a LocaleBundle and fetch the locale bundle', function () {

            var headers = {"Accept": "application/json, text/plain, */*", "X-Requested-With": "XMLHttpRequest"};

            $httpBackend.expectGET('/i18n/:bundle.json', headers).respond({body: {a: 1, b: 2}});

            var bundle = localeBundleFactory(':bundle');

            $httpBackend.flush();
        });
    });


    describe('Config Option: : useAcceptLanguageHeader = true', function () {

        // load the service's module
        beforeEach(function () {
            module(function (localeBundleFactoryProvider) {
                localeBundleFactoryProvider.bundleLocaleUrl('/i18n/{{bundle}}_{{locale}}.json');
                localeBundleFactoryProvider.bundleUrl('/i18n/{{bundle}}.json');
                localeBundleFactoryProvider.useAcceptLanguageHeader(true);
                localeBundleFactoryProvider.responseTransformer(function (response) {
                    return response.data.body;
                });
            });
        });

        // instantiate service
        var localeBundleFactory,
            $httpBackend;

        beforeEach(inject(function (_localeBundleFactory_, $injector) {
            localeBundleFactory = _localeBundleFactory_;
            $httpBackend = $injector.get('$httpBackend');
        }));

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });


        it('should create a LocaleBundle and fetch the locale bundle with the locale set in the "Accept-Language" header', function () {

            var headers = {"Accept": "application/json, text/plain, */*", "X-Requested-With": "XMLHttpRequest", "Accept-Language": ":locale"};

            $httpBackend.expectGET('/i18n/:bundle_:locale.json', headers).respond({body: {a: 1, b: 2}});

            var bundle = localeBundleFactory(':bundle', ':locale');

            $httpBackend.flush();
        });

        it('should create a LocaleBundle and fetch the locale bundle', function () {

            var headers = {"Accept": "application/json, text/plain, */*", "X-Requested-With": "XMLHttpRequest"};

            $httpBackend.expectGET('/i18n/:bundle.json', headers).respond({body: {a: 1, b: 2}});

            var bundle = localeBundleFactory(':bundle');

            $httpBackend.flush();
        });

        describe('Class: LocaleBundle', function () {

            var bundle, translations;

            beforeEach(function () {

                translations = {
                    'user.usernameLabel': 'Username',
                    'user.usernamePlaceholder': 'enter your username'
                };

                $httpBackend.expectGET('/i18n/:bundle.json').respond({body: translations});

                bundle = localeBundleFactory(':bundle');
            });

            it('should contain a translations promise', function () {

                var then = jasmine.createSpy('success');

                expect(bundle.translations).toBeTruthy();
                bundle.translations.then(then);

                $httpBackend.flush();

                expect(then).toHaveBeenCalledWith(translations);

            });

            it('LocaleBundle.addToScope should add translations to the passed scope prefixed with "bundle"', inject(function ($rootScope, $parse) {

                var scope = $rootScope.$new();

                bundle.addToScope(scope);

                $httpBackend.flush();

                expect($parse('bundle.user.usernameLabel')(scope)).toBe('Username');
                expect($parse('bundle.user.usernamePlaceholder')(scope)).toBe('enter your username');

            }));

            it('LocaleBundle.addToScope should add translations to the passed scope prefixed with "_t"', inject(function ($rootScope, $parse) {

                var scope = $rootScope.$new();

                bundle.addToScope(scope, '_t');

                $httpBackend.flush();

                expect($parse('_t.user.usernameLabel')(scope)).toBe('Username');
                expect($parse('_t.user.usernamePlaceholder')(scope)).toBe('enter your username');

            }));

            it('LocaleBundle.get should return a promise that resolves to a translation value', function () {

                var then = jasmine.createSpy('success');

                bundle.get('user.usernameLabel').then(then);

                $httpBackend.flush();

                expect(then).toHaveBeenCalledWith('Username');

            });

        });

    });
});
