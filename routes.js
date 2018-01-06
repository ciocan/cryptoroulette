const routes = module.exports = require('next-routes')();

routes.add({ name: 'shared', pattern: '/:date?/:symbols?', page: 'index' });
