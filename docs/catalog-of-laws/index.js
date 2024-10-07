/// <reference lib="dom" />
import {InfoFooter} from './footer.js'
import {loadKatex} from './katex.js'
import {LinkTo} from './link-to.js'
import {measureId} from './measure.js'
import {ScrollBox} from './scroll-box.js'

window.addEventListener('load', () => {
  measureId('title')

  window.customElements.define('link-to', LinkTo)
  window.customElements.define('scroll-box', ScrollBox)
  window.customElements.define('info-footer', InfoFooter)

  const allLaws = /** @type {HTMLElement[]} */ (
    Array.from(document.getElementsByTagName('typeclass-laws'))
  )
  let start = 1
  for (const laws of allLaws) {
    const children = /** @type {HTMLElement[]} */ (Array.from(laws.children))
    const linesCell = children[0]
    if (linesCell === undefined) continue

    if (linesCell.hasChildNodes()) {
      linesCell.onmouseenter = enterLinesCell(linesCell)
      linesCell.onmouseleave = leaveMouseCell(linesCell)
    }

    const count = (children.length - 2) / 4
    const style = laws.style

    style.setProperty('--rows', count.toString())
    style.setProperty('--start', start.toString())

    const cells = children.slice(2)
    let row = 1,
      column = 1
    for (const cell of cells) {
      cell.style.setProperty('grid-row-start', row.toString())
      column++
      if (column > 4) {
        row++
        column = 1
      }
    }

    start += count + 1
  }

  Array.from(document.getElementsByTagName('article')).forEach(el =>
    el.style.setProperty('opacity', '1'),
  )

  loadKatex()
})

/**
 *
 * @param {HTMLElement} linesCell
 */
function enterLinesCell(linesCell) {
  return () => linesCell.classList.add('line-hover')
}

/**
 *
 * @param {HTMLElement} linesCell
 */
function leaveMouseCell(linesCell) {
  return () => linesCell.classList.remove('line-hover')
}
