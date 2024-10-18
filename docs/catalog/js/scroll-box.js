/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-undef */
/// <reference lib="dom" />
import {BaseElement} from './base.js'
import {add, css, div, getNumericVar, getVar} from './dom.js'

export class ScrollBox extends BaseElement {
  /** @type {number} */
  _pad2 = 0

  /** @type {boolean} */
  _dirty = true

  /** @type {HTMLDivElement | null} */
  _top = null
  /** @type {HTMLDivElement | null} */
  _right = null
  /** @type {HTMLDivElement | null} */
  _bottom = null
  /** @type {HTMLDivElement | null} */
  _left = null

  constructor() {
    super()
  }

  computeOverflow() {
    const total = 2 * parseFloat(getVar('line-height-num'))

    const [totalWidth, visibleWidth] = [this.scrollWidth, this.clientWidth],
      [totalHeight, visibleHeight] = [this.scrollHeight, this.clientHeight],
      [overflowLeft, overflowTop] = [this.scrollLeft, this.scrollTop],
      [overflowWidth, overflowHeight] = [
        totalWidth - visibleWidth,
        totalHeight - visibleHeight,
      ]

    const fix = (/** @type {number} */ n) => Math.min(1, n / total).toString()

    return {
      top: fix(overflowTop),
      right: fix(overflowWidth > 0 ? overflowWidth - overflowLeft : 0),
      bottom: fix(overflowHeight > 0 ? overflowHeight - overflowTop : 0),
      left: fix(overflowLeft),
    }
  }

  refresh() {
    if (!this._dirty) {
      requestAnimationFrame(() => {
        this.refresh()
      })
      return
    }

    const [_top, _right, _bottom, _left] = [
      this._top,
      this._right,
      this._bottom,
      this._left,
    ]
    const {top, right, bottom, left} = this.computeOverflow()
    if (_top === null || _right === null || _bottom === null || _left === null)
      return

    css(_top, {opacity: top})
    css(_right, {opacity: right})
    css(_bottom, {opacity: bottom})
    css(_left, {opacity: left})

    this._dirty = false
    requestAnimationFrame(() => {
      this.refresh()
    })
  }

  /**
   * @override
   */
  render() {
    this._pad2 = getNumericVar('pad') * 2

    /** @type {[HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement]} */
    const [top, right, bottom, left] = [
      div({id: 'top-shadow'}),
      div({id: 'right-shadow'}),
      div({id: 'bottom-shadow'}),
      div({id: 'left-shadow'}),
    ]

    this._top = top
    this._right = right
    this._bottom = bottom
    this._left = left

    this.insert(add(div({id: 'shadow'}), top, bottom, left, right))

    this.addEventListener('scroll', () => {
      this._dirty = true
    })

    new ResizeObserver(() => {
      this._dirty = true
    }).observe(this)

    requestAnimationFrame(() => {
      this.refresh()
    })
  }
}
