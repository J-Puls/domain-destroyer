# domain-destroyer

A modern recreation of the timeless Desktop Destroyer game developed by Ing. Miroslav Nemecek, written in TypeScript.

## Controls

| key       | function         |
| --------- | ---------------- |
| `1 key`   | **hammer**       |
| `2 key`   | **machine gun**  |
| `c key`   | **clear screen** |
| `mouse 1` | **fire weapon**  |

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

## Description

The **`Destroyer`** constructor takes three arguments:

- **`parent`**: `HTMLDivElement` - the element to act as the bounding container for the game contents

- **`zIndStart`**: `number` - the z-index that the components should begin layering at

- **`options`**: `object` - optional parameters for controlling aspects of the game
  - **`particleLimit`**: `number` - the maximum number of particles allowed to exist at one time (the lower the number, the better the long-term performance)

## Usage

1. Grab your desired parent container as a variable

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
