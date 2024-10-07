/// <reference lib="dom" />
import {setVar} from './dom.js'

/**
 * @param {HTMLElement} el
 */
export const getWidth = el => {
  if (el === null) throw new Error('No element')
  return el.getBoundingClientRect().width
}

/**
 * @param {HTMLElement} el
 * @param {string} id
 */
export const measureElement = (el, id) => {
  const width = getWidth(el) + 'px'
  setVar(`px-${id}`, width)
  el.style.setProperty('--px-width', width)
}

export const measureId = (/** @type {string} */ id) => {
  const el = document.getElementById(id)
  if (el === null) throw new Error(`No element with id ${id}`)
  measureElement(el, id)
}

const context = () => {
  const canvas = new OffscreenCanvas(4_000, 3_000)
  const ctx = canvas.getContext('2d')
  if (ctx === null) throw new Error('No canvas.')
  return ctx
}

const fontKeys = ['style', 'weight', 'size', 'family']

/**
 * @param {HTMLElement} el
 */
const readTextStyle = el => {
  const map = el.computedStyleMap()
  return fontKeys.reduce(
    (/** @type {string} **/ prev, /** @type {string} **/ curr) =>
      prev + ' ' + map.get('font-' + curr)?.toString(),
    '',
  )
}

/**
 * @param {HTMLElement} el
 * @param {string} text
 */
export const measureText = (el, text) => {
  const ctx = context()
  ctx.font = readTextStyle(el)
  const width = ctx.measureText(text).width
  el.style.setProperty('--px-width', width.toString() + 'px')
  return width
}
