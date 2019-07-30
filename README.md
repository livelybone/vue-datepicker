# @livelybone/vue-datepicker
[![NPM Version](http://img.shields.io/npm/v/@livelybone/vue-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/vue-datepicker)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/vue-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/vue-datepicker)
![gzip with dependencies: kb](https://img.shields.io/badge/gzip--with--dependencies-kb-brightgreen.svg "gzip with dependencies: kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

A vue datepicker, includes date, datetime, time

## repository
https://github.com/livelybone/vue-datepicker.git

## Demo
https://github.com/livelybone/vue-datepicker#readme

## Installation
```bash
npm i -S @livelybone/vue-datepicker
```

## Global name
`VueDatepicker`

## Usage
```js
import VueDatepicker from '@livelybone/vue-datepicker'
import '@livelybone/vue-datepicker/lib/css/index.css';

// Global register
Vue.component('VueDatepicker', VueDatepicker)

// Local register
new Vue({
  components:{VueDatepicker}
})
```

when you want to set this module as external while you are developing another module, you should import it like this:
```js
import * as VueDatepicker  from '@livelybone/vue-datepicker'

// then use it by need
```

Use in html, see what your can use in [CDN: unpkg](https://unpkg.com/@livelybone/vue-datepicker/lib/umd/)
```html
<-- use what you want -->
<script src="https://unpkg.com/@livelybone/vue-datepicker/lib/umd/<--module-->.js"></script>
```

## Props
| Name                      | Type                                      | DefaultValue                                  | Description  |
| ------------------------- | ----------------------------------------- | --------------------------------------------- | ------------ |
| `prop`                    | `type`                                    | none                                          | Description |


## Events
| Name              | EmittedData           | Description                                       |
| ----------------- | --------------------- | ------------------------------------------------- |
| `event`           | `type`                |  |

## style
For building style, you can use the css or scss file in lib directory.
```js
// scss
import 'node_modules/@livelybone/vue-datepicker/lib/css/index.scss'

// css
import 'node_modules/@livelybone/vue-datepicker/lib/css/index.css'
```
Or
```scss
// scss
@import 'node_modules/@livelybone/vue-datepicker/lib/css/index.scss'

// css
@import 'node_modules/@livelybone/vue-datepicker/lib/css/index.css'
```

Or, you can build your custom style by copying and editing `index.scss`

## QA

1. Error `Error: spawn node-sass ENOENT`

> You may need install node-sass globally, `npm i -g node-sass`
