/* eslint-disable @typescript-eslint/no-useless-constructor */
/// <reference lib="dom" />
import {BaseElement} from './base.js'
import {fancyLink} from './dom.js'
import {measureText} from './measure.js'

const computeSource = (/** @type {string} */ href) =>
  'https://github.com/middle-ages/effect-ts-laws/blob/main/src/laws/typeclass/' +
  href

export class LawLink extends BaseElement {
  /** @type {string | null} */
  _name = null

  constructor() {
    super()
  }

  get href() {
    return this.get('href')
  }

  buildLink(/** @type {Node[]} */ content) {
    const title = `${this._name ?? 'anonymous'} law source code (effect-ts-laws)`
    return fancyLink(
      6,
      computeSource(this.href),
      title,
      this._name ?? 'anonymous',
      content,
    )
  }

  /**
   * @override
   */
  isLoaded() {
    return this.innerText !== ''
  }

  /**
   * @override
   */
  render() {
    const parent = this.parentElement?.children[1]?.textContent ?? ''
    const text = this.innerText.replaceAll(/\$|\^/g, '')
    this._name = parent + '_' + text

    const width = measureText(this, text, 0)
    this.add(this.buildLink(this.erase())).css({
      opacity: '1',
    })

    const rectHeight = 1.5 * 16 - 2 - 0.5
    const rectWidth = width + 2 * 8 - 2
    const circumference = 2 * (rectWidth + rectHeight) - 1.5
    const dots = Math.floor(circumference / 3)
    const dash = circumference / dots
    this.style.setProperty('--dash', dash.toString())
  }
}
