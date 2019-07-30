# @livelybone/vue-datepicker
![datepicker](https://img.shields.io/badge/datepicker-static-blue.svg "datepicker")
![gzip includes dependencies: 17.3kb](https://img.shields.io/badge/gzip--includes--dependencies-17.3kb-brightgreen.svg "gzip includes dependencies: 17.3kb")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")
![ssr supported](https://img.shields.io/badge/ssr-supported-green.svg "ssr supported")
![typescript](https://img.shields.io/badge/typescript-supported-green.svg "typescript")
![mobile supported](https://img.shields.io/badge/mobile-supported-green.svg "mobile supported")

A vue datepicker, includes date, datetime, time

> `pkg.module supported`, which means that you can apply tree-shaking in you project
  
## repository
https://github.com/livelybone/vue-datepicker.git

## Demo
https://livelybone.github.io/vue/vue-datepicker/

## Installation
```bash
npm i -S @livelybone/vue-datepicker
```

## Register
```js
// import all
import {Datepicker, Timepicker, DatetimePicker} from '@livelybone/vue-datepicker';
// or
import * as VueDatepicker from '@livelybone/vue-datepicker';

// Global register
Vue.component('datepicker', Datepicker);
Vue.component('timepicker', Timepicker);
Vue.component('datetime-picker', DatetimePicker);

// Local register
new Vue({
  components:{Datepicker, Timepicker, DatetimePicker}
})
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
| `placeholder`             | `String`                                  | none                                         |  |
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
| Name          | Type         | DefaultValue                                 | Description  |
| ------------- | ------------ | -------------------------------------------- | ------------ |
| `dayStr`      | `Array`      | `['日', '一', '二', '三', '四', '五', '六']`   | Used to set day name |

### Timepicker
| Name              | Type                   | DefaultValue                                 | Description  |
| ----------------- | ---------------------- | -------------------------------------------- | ------------ |
| `timeStr`         | `Array`                | `['时', '分', '秒']`                          | Used to set time name |
| `btnStr`          | `String`               | `确定`                                        | Used to set text of button |

### DatetimePicker
| Name              | Type                   | DefaultValue                                 | Description  |
| ----------------- | ---------------------- | -------------------------------------------- | ------------ |
| `dayStr`          | `Array`                | `['日', '一', '二', '三', '四', '五', '六']`   | Used to set day name |
| `timeStr`         | `Array`                | `['时', '分', '秒']`                          | Used to set time name |
| `btnStr`          | `String`               | `确定`                                        | Used to set text of button |

## Events
| Name                  | EmittedData           | Description                                       |
| --------------------- | --------------------- | ------------------------------------------------- |
| `input`               | `String`              | |

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
@import 'node_modules/@livelybone/vue-datepicker/lib/css/index.scss';

// css
@import 'node_modules/@livelybone/vue-datepicker/lib/css/index.css';
```

Or, you can build your custom style by copying and editing `index.scss`
