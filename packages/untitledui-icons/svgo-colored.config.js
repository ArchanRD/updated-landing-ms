module.exports = {
  plugins: [
    'removeDimensions',
    'removeXMLNS',
    'sortAttrs',
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [{ 'aria-hidden': 'true' }],
      },
    },
  ],
}
