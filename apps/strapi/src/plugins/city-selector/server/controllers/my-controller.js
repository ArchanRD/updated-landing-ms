'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('city-selector')
      .service('myService')
      .getWelcomeMessage();
  },
});
