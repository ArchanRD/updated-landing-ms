const {
  identifier,
  tsTypeAnnotation,
  tsTypeReference,
  tsTypeParameterInstantiation,
  jsxClosingElement,
  jsxElement,
  jsxIdentifier,
  jsxOpeningElement,
  jsxSpreadAttribute,
} = require('@babel/types')

const template = ({ jsx, imports, interfaces, props, componentName, exports }, { tpl }) => {
  const wrappedJsx = jsxElement(
    jsxOpeningElement(jsxIdentifier('svg'), [
      ...jsx.openingElement.attributes,
      jsxSpreadAttribute(identifier('props')),
      jsxSpreadAttribute(identifier('dimensions')),
    ]),
    jsxClosingElement(jsxIdentifier('svg')),
    jsx.children,
    false
  )

  componentName.typeAnnotation = tsTypeAnnotation(
    tsTypeReference(
      identifier('React.FC'),
      tsTypeParameterInstantiation([tsTypeReference(identifier('SvgIconProps'))])
    )
  )

  return tpl`
    ${imports};
    import { iconSizes } from "./props";
    
    ${interfaces};
    
    const ${componentName} = (${props}) => {
        const size = props.size
        const dimensions = iconSizes[size]
          ? iconSizes[size]
          : {}
        return (
          ${wrappedJsx}
        );
    }
    
    ${exports};
  `
}

module.exports = template

// const template = (
//   { template },
//   opts,
//   { imports, componentName, props, jsx, exports },
// ) => {
//   const plugins = ['jsx', 'typescript']

//   const typescriptTemplate = template.smart({ plugins })

//   componentName.typeAnnotation = tsTypeAnnotation(
//     tsTypeReference(
//       identifier('React.FC'),
//       tsTypeParameterInstantiation([tsTypeReference(identifier('SvgIconProps'))])
//     )
//   )

//   return typescriptTemplate.ast`
//     import React from 'react'
//     import { SvgIcon, SvgIconProps } from '@material-ui/core'

//     export const ${componentName} = (props) => {
//       return (
//         ${wrappedJsx}
//       )
//     }
//   `
// }

// module.exports = template
