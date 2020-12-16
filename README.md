# domain-destroyer

A modern recreation of the timeless Desktop Destroyer game developed by Ing. Miroslav Nemecek, written in TypeScript.

## Controls

| key     | function            |
| ------- | ------------------- |
| `mouse` | **fire weapon**     |
| `1 key` | **hammer**          |
| `2 key` | **machine gun**     |
| `c key` | **clear screen**    |
| `- key` | **previous weapon** |
| `= key` | **next weapon**     |
| `; key` | **volume down**     |
| `' key` | **volume up**       |

## Installation

```bash
npm i domain-destroyer
```

## Setup

- Import the `Destroyer` constructor

```javascript
import Destroyer from "domain-destroyer";
```

- Import the included CSS file

```javascript
import "domain-destroyer/dist/css/destroyer/min.css";
```

## API Description

The **`Destroyer`** constructor takes three arguments:

- **`parent`**: `HTMLDivElement` - the element to act as the bounding container for the game contents

- **`zIndStart`**: `number` - the z-index that the components should begin layering at

- **`options`**: `object` - optional parameters for controlling different aspects of the game upon instantiation
  - **`particleLimit`**: `number` - the maximum number of particles allowed to exist at one time (only effects the animation phase of rendering, not how many particles are persisted on screen)

Once instantiated, you will have access to the following properties and methods:

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

## Usage

1. Save your desired parent container to a variable

```javascript
const myParent = document.querySelector("#myParent");
```

2. Create an instance of the `Destroyer` object, passing it the `parent`, `zIndStart`, and optionally `options` arguments

3. Inject the `Destroyer` game components into your selected parent container using the `inject()` method

```javascript
const myDestroyer = new Destroyer(myParent, 5, { particleLimit: 20 });

myDestroyer.inject();
```

## Example

Below is an example use case in a `React` component.

```javascript
import React, { useEffect, useState } from "react";
import Destroyer from "domain-destroyer";
import "domain-destroyer/dist/css/destroyer.min.css";
import "./App.css";

export const App = () => {
  let myParent;
  const [destroyer, setDestroyer] = useState(null);
  useEffect(() => {
    myParent && setDestroyer(new Destroyer(myParent, 5, { particleLimit: 50 }));
  }, [myParent]);

  useEffect(() => {
    destroyer && destroyer.inject();
  }, [destroyer]);
  return <div className="myParent" ref={(el) => (myParent = el)}></div>;
};

export default App;
```
