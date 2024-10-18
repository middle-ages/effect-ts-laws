/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-undef */
/// <reference lib="dom" />

const SVG = 'http://www.w3.org/2000/svg'

/**
 * @template {keyof HTMLElementTagNameMap} Tag
 * @param {Tag} tag
 * @param {Record<string,string>} attributes
 * @returns {HTMLElementTagNameMap[Tag]}
 */
export const element = (tag, attributes = {}, style = {}) => {
  const el = document.createElement(tag)
  const classes = el.classList
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') {
      classes.add(...value.split(' '))
    } else {
      el.setAttribute(key, value)
    }
  }
  css(el, style)
  return el
}

/**
 * @param {Record<string,string>} attributes
 * @returns {HTMLDivElement}
 */
export const div = (attributes = {}, style = {}) => {
  return element('div', attributes, style)
}

/**
 * @template {Element} Parent
 * @param {Parent} parent
 * @param  {...Node} children
 * @returns Parent
 */
export const add = (parent, ...children) => {
  for (const child of children) {
    parent.appendChild(child)
  }
  return parent
}

/**
 * @template {Element} Parent
 * @param {Parent} parent
 * @param  {...Node} children
 * @returns Parent
 */
export const insert = (parent, ...children) => {
  while (children.length !== 0) {
    const child = children.pop()
    if (child !== undefined) parent.prepend(child)
  }
  return parent
}

/**
 * @template {HTMLElement} Parent
 * @param {Parent} el
 * @param {Record<string,string>} o
 * @returns Parent
 */
export const css = (el, o) => {
  const style = el.style
  for (const [key, value] of Object.entries(o)) {
    // @ts-ignore
    style[key] = value
  }
  return el
}

export const erase = (/** @type {HTMLElement} */ el) => {
  const nodes = Array.from(el.childNodes)
  const cloned = nodes.map(element => element.cloneNode(true))
  nodes.forEach(node => {
    node.remove()
  })
  return cloned
}

export const getVar = (/** @type {string} */ key) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${key}`)

export const getNumericVar = (/** @type {string} */ key) =>
  parseFloat(getVar(key).replace('px', ''))

export const setVar = (
  /** @type {string} */ key,
  /** @type {string} */ value,
) => {
  document.documentElement.style.setProperty(`--${key}`, value)
}

export const setNumericVar = (
  /** @type {string} */ key,
  /** @type {number} */ value,
) => {
  setVar(key, value.toString())
}

export const setPxVar = (
  /** @type {string} */ key,
  /** @type {number} */ value,
) => {
  setVar(key, value.toString() + 'px')
}

const setSvg =
  (/** @type {SVGElement} */ el) =>
  (/** @type {string} */ key, /** @type {string} */ value) => {
    el.setAttributeNS(null, key, value)
  }

/**
 * @param {string | undefined} viewbox
 * @returns SVGSVGElement
 */
export const makeSvg = (viewbox = undefined) => {
  const svg = document.createElementNS(SVG, 'svg')
  if (viewbox !== undefined) setSvg(svg)('viewbox', viewbox)
  return svg
}

/**
 * @param {SVGElement[]} defs
 * @returns SVGSVGElement
 */
export const makeSvgDefs = (...defs) => {
  const svg = document.createElementNS(SVG, 'svg')
  svg.appendChild(makeDefs(defs))
  return svg
}

/**
 * @returns SVGPathElement
 */
export const makePath = () => document.createElementNS(SVG, 'path')

/**
 * @param {string} id
 * @returns SVGClipPathElement
 */
export const makeClipPath = id => {
  const el = document.createElementNS(SVG, 'clipPath')
  el.setAttribute('id', id)
  el.appendChild(makePath())
  return el
}

/**
 * @param {SVGElement[]} defs
 * @returns SVGSVGElement
 */
export const makeDefs = defs => {
  const el = document.createElementNS(SVG, 'defs')
  el.append(...defs)
  return el
}

/**
 * @param {string | undefined} viewbox
 * @returns SVGSVGElement
 */
export const makeSvgPath = (viewbox = undefined) =>
  add(makeSvg(viewbox), makePath())

/**
 * @param {number} radius
 * @returns {SVGElement}
 */
export const svgRect = radius => {
  const svg = makeSvg()
  const el = document.createElementNS(SVG, 'rect')
  const set = setSvg(el)
  set('x', '1')
  set('y', '1')
  set('rx', radius.toString())
  set('ry', radius.toString())
  svg.appendChild(el)
  svg.classList.add('frame')
  return svg
}

/**
 * @param {string} tag
 * @returns {HTMLElement}
 */
export const tagSingle = tag =>
  /** @type {HTMLElement} */
  (Array.from(document.getElementsByTagName(tag))[0])

/**
 * @param {...string} tags
 * @returns {[HTMLElement, HTMLElement]}
 */
export const tagPair = (...tags) =>
  /** @type {[HTMLElement,HTMLElement]} */ (
    tags.flatMap(tag => Array.from(document.getElementsByTagName(tag)))
  )

/**
 * @param {string[]} tags
 * @returns {HTMLElement[]}
 */
export const tags = (...tags) => {
  /** @type {HTMLElement[]} */
  const results = []

  for (const tag of tags) {
    const elements = /** @type {HTMLElement[]} */ (
      Array.from(document.getElementsByTagName(tag))
    )
    results.push(...elements)
  }
  return results
}

/**
 * @param {number} radius
 * @param {string} href
 * @param {string} title
 * @param {string} id
 * @param {Node[]} content
 * @returns {HTMLElement}
 */
export const fancyLink = (radius, href, title, id, content) =>
  add(
    element('a', {href, title, target: '_blank'}),
    add(element('span', {id}), ...content),
    svgRect(radius),
  )

export const html = () =>
  /** @type {HTMLElement} */ (document.querySelector('html'))

/**
 * @param {'light' | 'dark'} theme
 * @returns
 */
export const flip = theme => (theme === 'dark' ? 'light' : 'dark')

export const media = () => window.matchMedia('(prefers-color-scheme: dark)')
export const match = () => (media().matches ? 'dark' : 'light')

/**
 * @param {'light' | 'dark'} theme
 */
export const setTheme = theme => {
  html().dataset['theme'] = theme
  document.documentElement.style.colorScheme = theme
}

/**
 * @returns 'light' | 'dark'
 */
export const getTheme = () =>
  /** @type {'light' | 'dark'} */ (html().dataset['theme'] ?? 'light')

/**
 *
 * @param {'dark' | 'light'} theme
 * @param {HTMLElement} element
 * @param {string} className
 */
export const toggleThemeClass = (theme, element, className) => {
  const classList = element.classList
  classList[theme === 'dark' ? 'remove' : 'add'](className)
}

/**
 * @param {string} name
 * @param {CustomElementConstructor} build
 */
export const custom = (name, build) => {
  window.customElements.define(name, build)
}
