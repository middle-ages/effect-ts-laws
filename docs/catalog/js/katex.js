/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/ban-ts-comment */
export const loadKatex = () => {
  // @ts-ignore
  renderMathInElement(document.body, {
    delimiters: [{left: '$', right: '$', display: false}],
    throwOnError: false,
    strict: false,
    trust: true,
    macros: {
      // Space
      '\\a': '\\kern{0.3pt}',
      '\\x': '\\kern{-0.3pt}',
      '\\xx': '\\kern{-1.0pt}',
      '\\xxx': '\\kern{-1.5pt}',
      '\\X': '\\kern{-2.0pt}',
      '\\XX': '\\kern{-3.0pt}',
      // Instances/Types
      '\\B': '\\mathrm{B}',
      '\\Id': '\\mathrm{Id}',
      '\\F': '\\mathrm{F}',
      '\\G': '\\mathrm{G}',
      '\\H': '\\mathrm{H}',
      '\\GH': '\\mathrm{GH}',
      '\\Array': '\\mathrm{Array}',
      '\\Option': '\\mathrm{Option}',
      '\\Monad': '\\mathrm{Monad}',
      '\\Monoid': '\\mathrm{Monoid}',
      '\\Endo': '\\mathrm{Endo}',
      '\\keyword': '\\mathsf{#1}',
      // functions
      '\\ap': '\\xx\\fn{ap}',
      '\\append': '\\fn{append}',
      '\\apply': '\\fn{apply}',
      '\\combineMany': '\\fn{combineM}\\XX\\fn{any}',
      '\\combineMap': '\\fn{combineM{\\X}ap}',
      '\\compose': '\\fn{compose}',
      '\\contramap': '\\fn{contr}\\kern{-2pt}\\fn{amap}',
      '\\coproduct': '\\fn{coproduct}',
      '\\coproductAll': '\\fn{coproductA}\\kern{-2pt}\\fn{ll}',
      '\\coproductMany': '\\fn{coproductM}\\kern{-3pt}\\fn{any}',
      '\\filterMap': '\\fn{f{\\xx}ilter{\\xx}M{\\X}ap\\x}',
      '\\flatMap': '\\fn{f}\\kern{-1.5pt}\\fn{latM}\\kern{-3pt}\\fn{ap}',
      '\\fn': '\\htmlClass{fn}{#1}',
      '\\id': '\\fn{id}',
      '\\imap': '\\fn{imap}',
      '\\map': '\\fn{map}',
      '\\maxBound': '\\fn{ma{\\a}xB}\\X\\fn{ound}',
      '\\minBound': '\\fn{minB}\\X\\fn{ound}',
      '\\of': '\\fn{\\!of\\X}',
      '\\product': '\\fn{product}',
      '\\reduce': '\\fn{reduce}',
      '\\reduceKind': '\\fn{reduce\\kern{-0.3pt}K{\\xx}ind}',
      '\\reduceRight': '\\fn{reduceRight}',
      '\\toArray': '\\fn{to{\\x}Arr{\\x}ay}',
      '\\traverse':
        '\\fn{tr}\\kern{-1.5pt}\\fn{av}\\kern{-1.5pt}\\fn{er}\\kern{-1.5pt}\\fn{se}',
      // Symbols
      '∅': '\\htmlClass{empty}{\\varnothing}',
      '\\(': '\\big(',
      '\\)': '\\big)',
      '\\▹': '\\,\\:\\htmlClass{pipe}{\\footnotesize{▹}}\\,\\,',
      '\\∘': '\\:\\htmlClass{flow}{\\x\\scriptsize{∘}}\\,',
      '\\emptyArray': '\\:\\!\\raisebox{0.5pt}{([\\,])}',
      '\\<': '\\htmlClass{symlt}{\\scriptsize{<}}',
      '\\>': '\\htmlClass{symgt}{\\scriptsize{>}}',
      // Variables
      '\\ofB': '\\<\\B\\>',
      '\\ofId': '\\<\\Id\\>',
      '\\ofEndo': '\\<\\Endo\\ofB\\X\\>',
      '\\fa': 'f\\kern{-1.25pt}a',
      '\\fab': 'f\\kern{-1pt}ab',
      '\\fbc': 'f\\kern{-0.5pt}bc',
      '\\afb': 'a\\kern{-1.25pt}f\\kern{-0.5pt}b',
      '\\bfc': 'b\\kern{-1.25pt}f\\kern{-1.5pt}c',
      '\\bab': 'bab',
      // Keywords
      '\\true': '\\keyword{true}',
    },
  })
}
