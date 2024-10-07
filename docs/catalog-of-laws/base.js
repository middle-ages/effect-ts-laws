/// <reference lib="dom" />
import {add, css, erase, insert} from './dom.js'

export class BaseElement extends HTMLElement {
  _isRendered = false

  constructor() {
    super()
  }

  connectedCallback() {
    this.updateRendering()
  }

  /**
   * @param {string} key
   * @returns {string}
   */
  get(key) {
    return this.getAttribute(key) ?? ''
  }

  attributeChangedCallback() {}

  updateRendering() {
    const view = this.ownerDocument.defaultView
    if (view === null) throw new Error('No view')
    if (!this.isLoaded() || this._isRendered) return
    const result = this.render(view)
    this._isRendered = true
    return result
  }

  isLoaded() {return true}
  render(/** @type {Window} */ _) {}

  /**
   * @param  {...Node} children
   * @returns this
   */
  add(...children) {
    return add(this, ...children)
  }

  /**
   * @param  {...Node} children
   * @returns this
   */
  insert(...children) {
    return insert(this, ...children)
  }

  erase() {
    return erase(this)
  }

  /**
   * @param {Record<string,string>} o 
   * @returns this
   */
  css(o) {
    return css(this, o)
  }
}