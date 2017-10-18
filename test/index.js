var tests = require.context('../test', true, /\.test\.js$/);
tests.keys().forEach(tests);
