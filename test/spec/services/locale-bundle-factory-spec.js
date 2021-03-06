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

            var headers = {"Accept": "application/json, text/plain, */*"};

            $httpBackend.expectGET('/i18n/:bundle_:locale.json', headers).respond({body: {a: 1, b: 2}});

            var bundle = localeBundleFactory(':bundle', ':locale');

            $httpBackend.flush();
        });

        it('should create a LocaleBundle and fetch the locale bundle', function () {

            var headers = {"Accept": "application/json, text/plain, */*"};

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

            var headers = {"Accept": "application/json, text/plain, */*", "Accept-Language": ":locale"};

            $httpBackend.expectGET('/i18n/:bundle_:locale.json', headers).respond({body: {a: 1, b: 2}});

            var bundle = localeBundleFactory(':bundle', ':locale');

            $httpBackend.flush();
        });

        it('should create a LocaleBundle and fetch the locale bundle', function () {

            var headers = {"Accept": "application/json, text/plain, */*"};

            $httpBackend.expectGET('/i18n/:bundle.json', headers).respond({body: {a: 1, b: 2}});

            var bundle = localeBundleFactory(':bundle');

            $httpBackend.flush();
        });

        describe('Class: LocaleBundle', function () {

            var bundle, translations;

            beforeEach(function () {

                translations = {
                    'user.usernameLabel': 'Username',
                    'user.usernamePlaceholder': 'enter your username',
                    'parent': 'aaa',
                    'parent.child1': 'bbb',
                    'parent.child2': 'ccc'
                };

                $httpBackend.expectGET('/i18n/:bundle.json').respond({body: translations});

                bundle = localeBundleFactory(':bundle');
            });

            it('should contain a translations promise', function () {

                var success = jasmine.createSpy('success');

                expect(bundle.translations).toBeTruthy();
                bundle.translations.then(success);

                $httpBackend.flush();

                expect(success).toHaveBeenCalledWith(translations);

            });

            it('LocaleBundle.get should return a promise that resolves to a translation value', function () {

                var success = jasmine.createSpy('success');

                var promise = bundle.get('user.usernameLabel');

                expect(promise.$isResolved).toBe(false);
                expect(promise.$resolved).toBeUndefined();

                promise.then(success);

                $httpBackend.flush();

                expect(promise.$isResolved).toBe(true);
                expect(promise.$resolved).toBe('Username');
                expect(success).toHaveBeenCalledWith('Username');

            });

            describe('LocaleBundle.addToScope', function () {

                it('should add translations to the passed scope prefixed with "bundle"', inject(function ($rootScope, $parse) {

                    var scope = $rootScope.$new();

                    bundle.addToScope(scope);

                    $httpBackend.flush();

                    expect($parse('bundle.user.usernameLabel')(scope)).toBe('Username');
                    expect($parse('bundle.user.usernamePlaceholder')(scope)).toBe('enter your username');

                }));

                it('should add translations to the passed scope prefixed with "translations"', inject(function ($rootScope, $parse) {

                    var scope = $rootScope.$new();

                    bundle.addToScope(scope, 'translations');

                    $httpBackend.flush();

                    expect($parse('translations.user.usernameLabel')(scope)).toBe('Username');
                    expect($parse('translations.user.usernamePlaceholder')(scope)).toBe('enter your username');
                }));

                it('should add translations to the passed scope BUT "child" namespaces will clobbered by "parent" namespaces', inject(function (
                    $rootScope,
                    $parse,
                    $log
                ) {

                    var scope = $rootScope.$new();

                    bundle.addToScope(scope);

                    $httpBackend.flush();

                    expect($parse('bundle.parent')(scope)).toBe('aaa');
                    expect($parse('bundle.parent.child1')(scope)).toBeUndefined();
                    expect($parse('bundle.parent.child2')(scope)).toBeUndefined();

                    expect($log.warn.logs).toEqual([
                        ['Cannot set `bundle.parent.child1` to `bbb`. Parent is already set to a string primitive.'],
                        ['Cannot set `bundle.parent.child2` to `ccc`. Parent is already set to a string primitive.']
                    ]);
                }));
            });

            describe('LocaleBundle.filter', function () {

                it('should filter translations based on the predicate function', inject(function ($rootScope, $parse) {
                    var scope = $rootScope.$new();

                    var filteredBundle = bundle.filter(function (value, key) {
                        return key.indexOf('parent.') > -1;
                    });

                    var success = jasmine.createSpy('success');

                    expect(filteredBundle.translations).toBeTruthy();
                    filteredBundle.translations.then(success);

                    filteredBundle.addToScope(scope, 'filtered');

                    $httpBackend.flush();

                    expect(success).toHaveBeenCalledWith({
                        'parent.child1': 'bbb',
                        'parent.child2': 'ccc'
                    });

                    expect($parse('filtered.parent.child1')(scope)).toBe('bbb');
                    expect($parse('filtered.parent.child2')(scope)).toBe('ccc');

                }));
            });

        });

    });
});
