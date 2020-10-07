const regexpCache = {}

const tabjson = (tree, delimiter = '  ') => {
  // Using regex caching for speedy mcSpeed bonus
  if (regexpCache[delimiter] === undefined) {
    regexpCache[delimiter] = new RegExp(`^[${delimiter}]*`, 'g')
  }
  const indentRegex = regexpCache[delimiter]

  const lines = tree.split('\n')
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

    console.log(label, '=====================')
    console.log('colonPos', colonPos)
    console.log('lastIndent', lastIndent)
    console.log('indent', indent)

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
          console.log('Popping for', label)
          stack.pop()
        }

        // Extended child of stack element
        stack[stack.length - 1][label] = data
        stack.push(stack[stack.length - 1][label])
      }
    } else {
      // Colon was found, dealing with properties

      if (lastIndent > indent) {
        // The indent has decreased to the left
        console.log('Popping for', label)
        stack.pop()
      }
      
      const target = stack[stack.length - 1]

      if (target[label] instanceof Array) {
        console.log('ARRAY PUSH')
        target[label].push(data)
      } else {
        console.log('OBJECT ASSIGN')
        target[label] = data
      }
    } 
    
    lastIndent = indent
  }

  return result
}

module.exports = tabjson

const list = tabjson(`bobby
  #age: 18
  email: bobby@somedude.com
  @preferences: stew, brooms, ducks
  wallet
    #amount: 16
    currency: USD
sally
  #age: 45
  email: sally@angrymeds.com
  @preferences: winning, internet fights, rainbows
  pets
    tommy
      type: cat
      #age: 3
      #weight: 16
    josephine
      type: lizard
      #age: 2
      @likes: flies, lsd, jazz
      @#favoriteNumbers: 7, 14`)

console.log(JSON.stringify(list, null, 2))