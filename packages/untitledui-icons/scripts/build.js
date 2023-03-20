const fs = require('fs')
const { promisify } = require('util')
const rimraf = promisify(require('rimraf'))
const { transform } = require('@svgr/core')
const babel = require('@babel/core')
const { dirname, join, basename } = require('path')
const { readdirSync, statSync } = require('fs')
const camelcase = require('camelcase')
const fsPromise = fs.promises
const template = require('../src/template')

let transformConfig = {
  react: async (svg, componentName, format) => {
    let component = await transform(svg, { ref: true, template }, { componentName })

    try {
      let { code } = await babel.transformAsync(component, {
        plugins: [[require('@babel/plugin-transform-react-jsx'), { useBuiltIns: true }]],
      })

      if (format === 'esm') {
        return code
      }

      return code
        .replace('import * as React from "react"', 'const React = require("react")')
        .replace('export default', 'module.exports =')
    } catch (error) {
      console.log(componentName, '=========', error)
    }
  },
}

async function getIcons(style) {
  const { globby } = await import('globby')

  let files = await globby(`./optimized/${style}/**/*.svg`)

  return Promise.all(
    files.map(async (file) => {
      let fileName = basename(file, '.svg')
      if (style === 'flags') {
        fileName =
          camelcase(fileName, {
            pascalCase: true,
            preserveConsecutiveUppercase: true,
          }) + 'Flag'
      } else {
        fileName = camelcase(fileName, {
          pascalCase: true,
        })
      }

      let componentName = fileName.replace(/(\+|\#)/g, 'Plus') + 'Icon'

      return {
        svg: await fsPromise.readFile(file, 'utf8'),
        componentName,
      }
    })
  )
}

function exportAll(icons, format, includeExtension = true, includeType = false) {
  const used = new Map()
  const typeExport = includeType ? `export * from './types'\n` : ''
  const exportedIcons = icons
    .map(({ componentName }) => {
      if (used.has(componentName)) {
        return ''
      }
      let extension = includeExtension ? '.js' : ''
      if (format === 'esm') {
        used.set(componentName, true)
        return `export { default as ${componentName} } from './${componentName}${extension}'`
      }
      used.set(componentName, true)
      return `module.exports.${componentName} = require("./${componentName}${extension}")`
    })
    .join('\n')
  return typeExport + exportedIcons
}

async function ensureWrite(file, text) {
  await fsPromise.mkdir(dirname(file), { recursive: true })
  fs.writeFileSync(file, text, 'utf8')
}

async function ensureWriteJson(file, json) {
  await ensureWrite(file, JSON.stringify(json, null, 2))
}

async function buildIcons(package, style, format) {
  let outDir = `./${style}`
  if (format === 'esm') {
    outDir += '/esm'
  }

  let icons = await getIcons(style)

  await Promise.all(
    icons.flatMap(async ({ componentName, svg }) => {
      let content = await transformConfig[package](svg, componentName, format)
      let types =
        package === 'react'
          ? `import * as React from 'react';\nimport type { SvgIconProps } from './types';\ndeclare function ${componentName}(props: SvgIconProps): JSX.Element;\nexport default ${componentName};\n`
          : `import type { FunctionalComponent, HTMLAttributes, VNodeProps } from 'vue';\ndeclare const ${componentName}: FunctionalComponent<HTMLAttributes & VNodeProps>;\nexport default ${componentName};\n`

      return [
        ensureWrite(`${outDir}/${componentName}.js`, content),
        ...(types ? [ensureWrite(`${outDir}/${componentName}.d.ts`, types)] : []),
      ]
    })
  )

  await ensureWrite(`${outDir}/index.js`, exportAll(icons, format))

  await ensureWrite(`${outDir}/index.d.ts`, exportAll(icons, 'esm', false, true))
}

async function main(package) {
  const cjsPackageJson = { module: './esm/index.js', sideEffects: false }
  const esmPackageJson = { type: 'module', module: './index.js', sideEffects: false }

  console.log(`Building ${package} package...`)

  const iconSets = ['duocolor', 'outline', 'duotone', 'integration', 'social', 'flags']
  const packageFormats = ['cjs', 'esm']

  await Promise.all(iconSets.map((style) => rimraf(`./${style}/*`)))

  await Promise.all(
    iconSets.flatMap((style) => packageFormats.map((format) => buildIcons(package, style, format)))
  )

  const propsJsContent = await fsPromise.readFile('./src/props.js', 'utf8')
  const typesContent = await fsPromise.readFile('./src/types.ts', 'utf8')

  await Promise.all(
    iconSets.flatMap((style) => [
      ensureWriteJson(`./${style}/package.json`, cjsPackageJson),
      ensureWriteJson(`./${style}/esm/package.json`, esmPackageJson),
      ensureWrite(`./${style}/props.js`, propsJsContent),
      ensureWrite(`./${style}/esm/props.js`, propsJsContent),
      ensureWrite(`./${style}/types.ts`, typesContent),
      ensureWrite(`./${style}/esm/types.ts`, typesContent),
    ])
  )

  return console.log(`Finished building ${package} package.`)
}

main('react')
