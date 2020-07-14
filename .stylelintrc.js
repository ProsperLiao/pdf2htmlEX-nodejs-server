module.exports = {
    extends: [
        'stylelint-config-ydj/scss', // your stylint config
        './node_modules/prettier-stylelint/config.js',
    ],
    rules: {
        'string-quotes': 'double',
    },
};
