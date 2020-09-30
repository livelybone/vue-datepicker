# @livelybone/vue-datepicker
[![NPM Version](http://img.shields.io/npm/v/@livelybone/vue-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/vue-datepicker)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/vue-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/vue-datepicker)
![gzip with dependencies: 25kb](https://img.shields.io/badge/gzip--with--dependencies-25kb-brightgreen.svg "gzip with dependencies: 25kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

[中文文档](./README-CN.md)

A vue component of datepicker, includes DatePicker, DatetimePicker, DateRangePicker, TimePicker

## repository
https://github.com/livelybone/vue-datepicker.git

## Demo
https://livelybone.github.io/vue/vue-datepicker/

## Run Example
Your can see the usage by run the example of the module, here is the step:

1. Clone the library `git clone https://github.com/livelybone/vue-datepicker.git`
2. Go to the directory `cd your-module-directory`
3. Install npm dependencies `npm i`(use taobao registry: `npm i --registry=http://registry.npm.taobao.org`)
4. Open service `npm run dev`
5. See the example(usually is `http://127.0.0.1:3000/examples/test.html`) in your browser

## Installation
```bash
npm i -S @livelybone/vue-datepicker
```

## Global name - The variable the module exported in `umd` bundle
`VueDatepicker`

## Interface
See what method or params you can use in [index.d.ts](./index.d.ts)

## Usage
```js
import { Datepicker, Timepicker, DatetimePicker, DateRangePicker } from '@livelybone/vue-datepicker';

// Global register
Vue.component('datepicker', Datepicker);
Vue.component('timepicker', Timepicker);
Vue.component('datetime-picker', DatetimePicker);
Vue.component('date-range-picker', DateRangePicker);

// Local register
new Vue({
  components:{ Datepicker, Timepicker, DatetimePicker, DateRangePicker }
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

### Common
| Name                      | Type                                      | DefaultValue                                 | Description  |
| ------------------------- | ----------------------------------------- | -------------------------------------------- | ------------ |
| `id`                      | `[String, Number]`                        | none                                         |  |
| `value`                   | `[String, Number]`                        | none                                         |  |
| `placeholder`             | `String`                                  | `请选择`                                         |  |
| `min`                     | `String`                                  | none                                         | Min |
| `max`                     | `String`                                  | none                                         | Max |
| `canEdit`                 | `Boolean`                                 | `true`                                       | If it can be changed |
| `inputStyle`              | `Object`                                  | none                                         | Style of input tag |
| `popperProps`             | `Object`                                  | `defaultPopperProps`                         | Props of module [@livelybone/vue-popper](https://github.com/livelybone/vue-popper) |
| `scrollbarProps`          | `Object`                                  | `{ isMobile: false, maxHeight: 200 }`        | Props of scrollbar, see [vue-scrollbar-live](https://github.com/livelybone/vue-scrollbar-live) |

```js
const defaultPopperProps = {
  arrowPosition: 'start',
  arrowOffsetScaling: 1,
  popperOptions: {
    placement: 'bottom-start',
    positionFixed: true,
    // more options in https://popper.js.org
  },
}
```

### Datepicker
| Name                | Type         | DefaultValue                                 | Description  |
| ------------------- | ------------ | -------------------------------------------- | ------------ |
| `dayStr`            | `Array`      | `['日', '一', '二', '三', '四', '五', '六']`   | Used to set day name |
| `monthStr`          | `Array`      | `['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']`   | Used to set month name |
| `multiple`          | `Boolean`    | `false`                                      |  |
| `type`              | `String`     | `date`                                       | Options: [`year`,`month`,`date`] |
| `firstDayOfWeek`    | `Number`     | `0`                                          | Used to set the first day of week. Options: [0, 1, 2, 3, 4, 5, 6] |
| `btnStr`            | `String`     | `确定`                                        | Used to set text of button |

### Timepicker
| Name              | Type                   | DefaultValue                                 | Description  |
| ----------------- | ---------------------- | -------------------------------------------- | ------------ |
| `type`            | `String`               | `second`                                     | Options: [`hour`,`minute`,`second`] |
| `timeStr`         | `Array`                | `['时', '分', '秒']`                          | Used to set time name |
| `btnStr`          | `String`               | `确定`                                        | Used to set text of button |

### DatetimePicker
| Name              | Type                   | DefaultValue                                 | Description  |
| ----------------- | ---------------------- | -------------------------------------------- | ------------ |
| `dayStr`          | `Array`                | `['日', '一', '二', '三', '四', '五', '六']`   | Used to set day name |
| `monthStr`        | `Array`                | `['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']`   | Used to set month name |
| `timeStr`         | `Array`                | `['时', '分', '秒']`                          | Used to set time name |
| `btnStr`          | `String`               | `确定`                                        | Used to set text of button |
| `firstDayOfWeek`  | `Number`               | `0`                                          | Used to set the first day of week. Options: [0, 1, 2, 3, 4, 5, 6] |
| `timeType`        | `String`               | `second`                                     | Options: [`hour`,`minute`,`second`] |

### DateRangePicker
| Name                  | Type                   | DefaultValue                                 | Description  |
| --------------------- | ---------------------- | -------------------------------------------- | ------------ |
| `value`               | `Array`                | `[null, null]`                               | Used to set day name |
| `dayStr`              | `Array`                | `['日', '一', '二', '三', '四', '五', '六']`   | Used to set day name |
| `monthStr`            | `Array`                | `['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']`   | Used to set month name |
| `btnStr`              | `String`               | `确定`                                        | Used to set text of button |
| `firstDayOfWeek`      | `Number`               | `0`                                          | Used to set the first day of week. Options: [0, 1, 2, 3, 4, 5, 6] |
| `secondPlaceholder`   | `String`               | `请选择结束`                                   |  |
| `rangeSeparator`      | `String`               | `至`                                          |  |

## Events
| Name                  | EmittedData           | Description                                       |
| --------------------- | --------------------- | ------------------------------------------------- |
| `input`               | `String`              | |

## style
For building style, you may need to import the css or scss file:
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

Or, you can build your custom style by copying, editing and importing `node_modules/@livelybone/vue-datepicker/lib/css/index.scss`

## QA

1. Error `Error: spawn node-sass ENOENT`

> You may need install node-sass globally, `npm i -g node-sass`
