module.exports = {
  plugins: [
    'removeDimensions',
    'removeXMLNS',
    'sortAttrs',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['stroke', 'path:stroke-width'],
      },
    },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          { 'stroke-width': '2' },
          { stroke: 'currentColor' },
          { 'aria-hidden': 'true' },
        ],
      },
    },
  ],
}
