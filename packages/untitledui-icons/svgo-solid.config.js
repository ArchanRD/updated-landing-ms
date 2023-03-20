module.exports = {
  plugins: [
    'removeDimensions',
    'removeXMLNS',
    'sortAttrs',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['fill'],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [{ 'aria-hidden': 'true' }, {'fill': 'currentColor'}],
      },
    },
  ],
}
