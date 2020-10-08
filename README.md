# TabJson

Turns tab-spaced new lines into an array of populated objects without relying on the call stack.

## Install

`npm install tabjson --save` or `yarn add tabjson --save`

## Example

```javascript
const tabjson = require('tabjson')

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
```

### Output

```javascript
[
  {
    "bobby": {
      "age": 18,
      "email": "bobby@somedude.com",
      "preferences": [
        "stew",
        "brooms",
        "ducks"
      ],
      "wallet": {
        "amount": 16,
        "currency": "USD"
      }
    }
  },
  {
    "sally": {
      "age": 45,
      "email": "sally@angrymeds.com",
      "preferences": [
        "winning",
        "internet fights",
        "rainbows"
      ],
      "pets": {
        "tommy": {
          "type": "cat",
          "age": 3,
          "weight": 16
        },
        "josephine": {
          "type": "lizard",
          "age": 2,
          "likes": [
            "flies",
            "lsd",
            "jazz"
          ],
          "favoriteNumbers": [
            7,
            14
          ]
        }
      }
    }
  }
]
```

## Notation Breakdown

```yaml
bobby                                               // This is new object with a property called 'bobby' (no colon)
  #age: 18                                          // This is an age number of bobby (#)
  email: bobby@somedude.com                         // This is an email string of bobby
  @preferences: stew, brooms, ducks                 // This is a preferences arrary of bobby (@)
  wallet                                            // This is a wallet object of bobby (no colon)
    #amount: 16                                     // This is an amount number of bobby's wallet (#)
    currency: USD                                   // This is the currency string of bobby's wallet (#)
sally                                               // This is new object with a property called 'sally' (no colon)
  #age: 45                                          // This is an age number of sally (#)
  email: sally@angrymeds.com                        // This is an email string of sally
  @preferences: winning, internet fights, rainbows  // This is a preferences array of sally (@)
  pets                                              // This is a pet object of sally (no colon)
    tommy                                           // This is sally's pet named tommy (no colon)
      type: cat                                     // This is a type string of tommy
      #age: 3                                       // This is tommy's age number (#)
      #weight: 16                                   // This is tommy's weight number (#)
    josephine                                       // This is sally's pet named josephine (no colon)
      type: lizard                                  // This is a type string of josephine
      #age: 2                                       // This is josephine's age number (#)
      @likes: flies, lsd, jazz                      // This is a likes arrary of josephine (@)
      @#favoriteNumbers: 7, 14                      // This is a favorite numbers number array of josephine (@#)
```

## Roadmap

* Add support for object arrays (`@ and no colon`)
* Add path referencing (`$`)
* Add inline function processing via `() => {}`
* Add template literal support for new lines (`)
* Add support for regex types (`?`)
* Add tests that make sure things work in weird cases
* Add syntax error and recommendation detection