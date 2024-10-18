/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable no-undef */
/// <reference lib="dom" />
import {setConfiguration} from './configuration.js'
import {custom} from './dom.js'
import {InfoFooter} from './footer.js'
import {IconLink} from './icon-link.js'
import {loadKatex} from './katex.js'
import {LawLink} from './law-link.js'
import {LinkTo} from './link-to.js'
import {measureId} from './measure.js'
import {ScrollBox} from './scroll-box.js'
//import {ToggleButton} from './toggle-button.js'
import {dom, themeToggle} from './poster-elements.js'

window.addEventListener('load', () => {
  setConfiguration()

  measureId('title')

  custom('link-to', LinkTo)
  custom('scroll-box', ScrollBox)
  custom('info-footer', InfoFooter)
  custom('law-link', LawLink)
  custom('icon-link', IconLink)

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

  document.body.style.setProperty('opacity', '1')
  buildThemeToggle(document.body)

  loadKatex()
})

/**
 *
 * @param {HTMLElement} linesCell
 */
function enterLinesCell(linesCell) {
  return () => {
    linesCell.classList.add('line-hover')
  }
}

/**
 *
 * @param {HTMLElement} linesCell
 */
function leaveMouseCell(linesCell) {
  return () => {
    linesCell.classList.remove('line-hover')
  }
}

/**
 *
 * @param {HTMLElement} parent
 */
function buildThemeToggle(parent) {
  const [innerSize, outerSize] = [20, 28],
    [outerRadius, innerRadius] = [outerSize / 2, innerSize / 2],
    frameRadialWidth = Math.round((outerRadius - innerRadius) / 2)

  dom.append(parent)(
    dom.stylesC({
      display: 'block',
      position: 'absolute',
      top: '1px',
      left: `calc(
max(
  50% + var(--px-title) / 2 + var(--icon-link-width),
  100% - 77px
)`,
    })(
      dom.attrC(
        'tabindex',
        2,
      )(themeToggle.dom({innerRadius, outerRadius, frameRadialWidth})),
    ),
  )
}
