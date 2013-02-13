module('tAMD/resolve', {
    setup: function() {
        var that = this;
        stop();
        reinitialize().then(function() {
            that.foo = {};
            that.bar = {};

            define('namespace/foo', that.foo);
            define('namespace/bar', that.bar);

            start();
        });
    },
    teardown: function() {}
});

test('resolves relative paths', 1, function() {
    require(['tAMD/resolve'], function(resolve) {
        equal(resolve('./foo', 'namespace/bar'), 'namespace/foo');
    });
});

test('resolves relative dependency paths automatically', 1, function() {
    var that = this;

    define('namespace/nao', ['./foo'], function(foo) {
        strictEqual(foo, that.foo);
        return {};
    });
});

test('resolves paths on sync require', 1, function() {
    var that = this;

    define('namespace/nao', ['require'], function(require) {
        var foo = require('./foo');
        strictEqual(foo, that.foo, 'got `namespace/foo` via sync require');
    });
});

test('walks up path structure', 1, function() {
    var that = this;

    define('namespace/sub/part/foo', ['../../bar'], function(bar) {
        strictEqual(bar, that.bar, 'resolved "../../bar" to "namespace/bar"');
    });
});

test('throws error if relative path would break out of root context', 1, function() {
    throws(function() {
        require(['../foo'], function(foo) {
            ok(false, 'the dependency "../foo" should not be possible to satisfy');
        });
    }, 'cannot include too many ".." components in paths');
});
