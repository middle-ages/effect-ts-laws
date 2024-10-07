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
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'id') {
      el.setAttribute('id', value)
    } else {
      // @ts-ignore
      el[key] = value
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
  nodes.forEach(node => node.remove())
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

const setSvg =
  (/** @type {SVGElement} */ el) =>
  (/** @type {string} */ key, /** @type {string} */ value) => {
    el.setAttributeNS(null, key, value)
  }

export const svgRect = () => {
  const svg = document.createElementNS(SVG, 'svg')
  const el = document.createElementNS(SVG, 'rect')
  const set = setSvg(el)
  set('x', '1')
  set('y', '1')
  set('rx', '7')
  set('ry', '7')
  svg.appendChild(el)
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
