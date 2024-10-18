/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable no-undef */
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
 * @returns {string}
 */
export const measureElement = el => {
  const width = getWidth(el) + 'px'
  el.style.setProperty('--px-width', width)
  return width
}

export const measureId = (/** @type {string} */ id) => {
  const el = document.getElementById(id)
  if (el === null) throw new Error(`No element with id ${id}`)
  const width = measureElement(el)
  setVar(`px-${id}`, width)
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
 * @param {number?} add
 */
export const measureText = (el, text, add) => {
  const ctx = context()
  ctx.font = readTextStyle(el)
  const width = ctx.measureText(text).width + (add ?? 0)
  el.style.setProperty('--px-width', width.toString() + 'px')
  el.style.setProperty('--width', width.toString())
  return width
}
