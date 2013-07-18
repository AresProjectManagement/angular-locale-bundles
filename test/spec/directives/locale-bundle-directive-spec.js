describe('Directive: localeBundle', function () {
    'use strict';

    var localeBundleFactory;

    beforeEach(function () {
        module('angular-locale-bundles');
        localeBundleFactory = jasmine.createSpy('localeBundleFactory');
        module(function ($provide) {
            $provide.value('localeBundleFactory', localeBundleFactory);
        })
    });

    it('should add the "foo" bundle translations to the scope prefixed with bundle', inject(function ($rootScope, $compile) {

        var bundle = jasmine.createSpyObj('bundle', ['addToScope']);

        localeBundleFactory.andReturn(bundle);

        var element = angular.element('<div locale-bundle="foo"></div>');
        element = $compile(element)($rootScope);

        expect(localeBundleFactory).toHaveBeenCalledWith('foo');
        expect(bundle.addToScope).toHaveBeenCalledWith($rootScope, 'bundle');
    }));

    it('should add the "foo" bundle translations to the scope prefixed with _t', inject(function ($rootScope, $compile) {

        var bundle = jasmine.createSpyObj('bundle', ['addToScope']);

        localeBundleFactory.andReturn(bundle);

        var element = angular.element('<div locale-bundle="foo as _t"></div>');
        element = $compile(element)($rootScope);

        expect(localeBundleFactory).toHaveBeenCalledWith('foo');
        expect(bundle.addToScope).toHaveBeenCalledWith($rootScope, '_t');
    }));
});
