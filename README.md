# domain-destroyer

A modern recreation of the timeless Desktop Destroyer game developed by Miroslav Němeček, written in TypeScript for the web.

## Controls

| key     | function            |
| ------- | ------------------- |
| `mouse` | **fire weapon**     |
| `1 key` | **hammer**          |
| `2 key` | **machine gun**     |
| `3 key` | **stamp**           |
| `c key` | **clear screen**    |
| `- key` | **previous weapon** |
| `= key` | **next weapon**     |
| `; key` | **volume down**     |
| `' key` | **volume up**       |

<hr/>
## Installation

```bash
npm i domain-destroyer
```

or

[clone the repository](https://github.com/J-Puls/domain-destroyer.git) and compile the TypeScript yourself with

```bash
npm run build
```

<hr/>
## Setup

- Import the `Destroyer` constructor

```javascript
import Destroyer from "domain-destroyer";
```

- Import the included CSS file

```javascript
import "domain-destroyer/dist/css/destroyer.min.css";
```

<hr/>
## API

The **`Destroyer`** constructor takes two arguments:

- **`parent`**: `HTMLDivElement` - the element to act as the bounding container for the game contents

- **`options`**: `object` - optional parameters for controlling different aspects of the game upon instantiation

  - **`defaultVolume`**: `number (0 - 1)` - the initial volume

  - **`onDamage`**: `(pageHealth) => {}` - a callback function that will be called when a weapon _"inflicts damage"_ to the page

  - **`pageHealth`**: `number` - the total amount of _"health"_ the page has (this is decremented every time a weapon fires)

  - **`particleLimit`**: `number` - the maximum number of particles allowed to exist at one time (only effects the animation phase of rendering, not how many particles are persisted on screen)

  - **`volumeChangeDelta`**: `number (0 - 1)` - how much the volume is incremented / decremented when calling `volumeUp()` or `volumeDown()`

  - **`zIndexStart`**: `number` - the z-index at which game elements should begin layering

Once instantiated, you will have access to the following noteworthy properties and methods:

| property              | description                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`clear()`**         | clears all currently rendered particles                                                                                                                       |
| **`currentWeaponID`** | the numeric ID for the current weapon in use                                                                                                                  |
| **`fire()`**          | triggers the weapon to fire a single shot                                                                                                                     |
| **`inject()`**        | injects the visible contents of the game into the parent element                                                                                              |
| **`isFiring`**        | boolean relating to the current state of the weapon                                                                                                           |
| **`mousePos`**        | tracks the x / y coordinates of the mouse within the viewport                                                                                                 |
| **`particleLimit`**   | the number of particle animators allowed to exist at one time (for animation performance only, does not limit how many particles are persisted on the screen) |
| **`setVolume()`**     | explicitly sets a certain volume level (from 0 to 1)                                                                                                          |
| **`setWeapon()`**     | explicitly sets the weapon by its numeric ID                                                                                                                  |
| **`updateCSS()`**     | updates the CSS variables pertaining to the current weapon                                                                                                    |
| **`volume`**          | the volume level (from 0 to 1)                                                                                                                                |
| **`volumeDown()`**    | lowers the volume by .1 until min volume is reached                                                                                                           |
| **`volumeUp()`**      | raises the volume by .1 until max volume is reached                                                                                                           |
| **`weaponDown()`**    | sets the current weapon to the previous in the list                                                                                                           |
| **`weaponUp()`**      | sets the current weapon to the next in the list                                                                                                               |

<hr/>
## Usage

1. Save your desired parent container to a variable

```javascript
const myParent = document.querySelector("#myParent");
```

2. Create an instance of the `Destroyer` object, passing it the `parent` and `options` arguments

3. Inject the `Destroyer` game components into your selected parent container using the `inject()` method

```javascript
const options = { particleLimit: 20, zIndexStart: 5 };

const myDestroyer = new Destroyer(myParent, options);

myDestroyer.inject();
```

### Example

Below is an example of how to use domain-destroyer in a **`React`** component.

```javascript
import React, { useEffect, useState } from "react";
import Destroyer from "domain-destroyer";
import "domain-destroyer/dist/css/destroyer.min.css";

const App = () => {
  let myParent;
  const [destroyer, setDestroyer] = useState(null);

  const options = {
    defaultVolume: 0.5,
    particleLimit: 20,
    zIndexStart: 5,
    onDamage: (pageHealth) => console.log(pageHealth),
    pageHealth: 200,
    volumeChangeDelta: 0.5,
  };

  useEffect(() => {
    myParent && setDestroyer(new Destroyer(myParent, options));
  }, [myParent]);

  useEffect(() => {
    destroyer && destroyer.inject();
  }, [destroyer]);

  return <div className="myParent" ref={(el) => (myParent = el)} />;
};

export default App;
```
