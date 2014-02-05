/*jshint expr: true*/
define(['chai', 'widgetjs/router/router'], function(chai, router) {
    var expect = chai.expect;

    describe('Router', function() {

        var my, aRouter;

        beforeEach(function() {
            my = {};
            aRouter = router({}, my);
        });

        describe('defaults', function() {

            it('empty route table', function() {
                expect(my.routeTable).to.be.empty;
            });

            it('no route matched', function() {
                expect(my.lastMatch).to.be.undefined;
            });
        });

        describe('options', function() {
            it('can have location handler', function() {
                router = router({
                    locationHandler: { isFake: true, on: function() {} }
                }, my);

                expect(my.location.isFake).to.be.true;
            });

        });
    });
});