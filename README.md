# domain-destroyer

A modern recreation of the timeless Desktop Destroyer game developed by Ing. Miroslav Nemecek, written in TypeScript.

## Installation

```bash
npm i domain-destroyer
```

## Setup

- Import the _Destroyer_ constructor

```javascript
import Destroyer from "domain-destroyer";
```

- Import the included CSS file

```javascript
import "domain-destroyer/dist/css/destroyer/min.css";
```

## Usage

1. Grab your desired parent container as a variable

```javascript
const myParent = document.querySelector("#myParent");
```

2. Create an instance of the _Destroyer_ object, passing it the `parent`, `zIndStart`, and optionally `options` parameters

3. Inject the Destroyer game components into your selected parent container using the `inject()` method

```javascript
const myDestroyer = new Destroyer(myParent, sounds, { particleLimit: 20 });

myDestroyer.inject();
```
