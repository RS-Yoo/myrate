const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/media",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7011',
        secure: false
    });

    app.use(appProxy);
};
