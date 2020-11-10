const regexpCache = {}

const tabjson = (tree, delimiter = '  ') => {
  // Using regex caching for speedy mcSpeed bonus
  if (regexpCache[delimiter] === undefined) {
    regexpCache[delimiter] = new RegExp(`^[${delimiter}]*`, 'g')
  }
  const indentRegex = regexpCache[delimiter]

  const lines = tree.trim().split('\n')
  const result = []
  const stack = []

  let lastIndent = 0

  for (const raw of lines) {
    let spacing = raw.match(indentRegex)[0]
    const indent = spacing.length / 2
    const line = raw.substr(spacing.length)
    const colonPos = line.indexOf(':')

    let label = colonPos === -1
      ? line
      : line.substr(0, colonPos).trim()

    let data = colonPos === -1
      ? {}
      : line.substr(colonPos + 1).trim()

    if (label[0] === '@') {
      // Treat this item as an array
      label = label.substr(1)

      if (typeof data === 'string') {
        // Parse it as a string
        data = data.split(',').map(s => {
          return s.trim()
        })
      } else {
        // data is an object
        data = []
      }
      
    }

    if (label[0] === '#') {
      // Treat data as a number
      label = label.substr(1)
      data = data instanceof Array
        ? data.map(s => {
            if (s.indexOf('.') > -1) {
              return parseFloat(s)
            } else {
              return parseInt(s)
            }
          })
        : data.indexOf('.') > -1
          ? parseFloat(data)
          : parseInt(data)
    }

    // Prepare result entries
    if (colonPos === -1) {
      // No colon was found
      if (spacing.length === 0) {
        // New root element
        const item = {
          [label]: {}
        }
        stack.push(item[label])
        result.push(item)
      } else {
        if (lastIndent > indent) {
          // The indent has decreased to the left
          for (let i = 0, len = (lastIndent - indent); i < len; i++) {
            stack.pop()
          }
        }

        // Extended child of stack element
        stack[stack.length - 1][label] = data
        stack.push(stack[stack.length - 1][label])
      }
    } else {
      // Colon was found, dealing with properties

      if (lastIndent > indent) {
        // The indent has decreased to the left
        for (let i = 0, len = (lastIndent - indent); i < len; i++) {
          stack.pop()
        }
      }
      
      const target = stack[stack.length - 1]

      if (target[label] instanceof Array) {
        target[label].push(data)
      } else {
        target[label] = data
      }
    } 
    
    lastIndent = indent
  }

  return result
}

module.exports = tabjson

const {
  readFileSync
} = require('fs')
const contents = readFileSync('../landing-page-factory/accounts/bob-the-guy/spoopy/config.tson').toString()
const json = tabjson(contents)
console.log(json[1].introduction)