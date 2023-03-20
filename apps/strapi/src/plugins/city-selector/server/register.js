"use strict";

module.exports = ({ strapi }) => {
  // registration phase
  strapi.customFields.register({
    name: "city-selector",
    plugin: "city-selector",
    type: "json",
  });
};
