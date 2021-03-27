# @livelybone/vue-datepicker
[![NPM Version](http://img.shields.io/npm/v/@livelybone/vue-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/vue-datepicker)
[![Download Month](http://img.shields.io/npm/dm/@livelybone/vue-datepicker.svg?style=flat-square)](https://www.npmjs.com/package/@livelybone/vue-datepicker)
![gzip with dependencies: 25kb](https://img.shields.io/badge/gzip--with--dependencies-25kb-brightgreen.svg "gzip with dependencies: 25kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, 天然支持 tree-shaking, 使用 es module 引用即可

[English Document](./README.md)

A vue component of datepicker, includes DatePicker, DatetimePicker, DateRangePicker, TimePicker

## repository
https://github.com/livelybone/vue-datepicker.git

## Demo
https://livelybone.github.io/vue/vue-datepicker/

## Run Example
你可以通过运行项目的 example 来了解这个组件的使用，以下是启动步骤：

1. 克隆项目到本地 `git clone https://github.com/livelybone/vue-datepicker.git`
2. 进入本地克隆目录 `cd your-module-directory`
3. 安装项目依赖 `npm i`(使用 taobao 源: `npm i --registry=http://registry.npm.taobao.org`)
4. 启动服务 `npm run dev`
5. 在你的浏览器看 example (地址通常是 `http://127.0.0.1:3000/examples/test.html`)

## Installation
```bash
npm i -S @livelybone/vue-datepicker
```

## Global name - The variable the module exported in `umd` bundle
`VueDatepicker`

## Interface
去 [index.d.ts](./index.d.ts) 查看可用方法和参数

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

在 HTML 文件中直接引用，你可以在 [CDN: unpkg](https://unpkg.com/@livelybone/vue-datepicker/lib/umd/) 看到你能用到的所有 js 脚本
```html
<-- 然后使用你需要的 -->
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
你可能需要主动引入样式文件来应用组件的样式：
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

你也可以通过引入自定义的组件样式文件来自定义样式，文件可以通过复制并修改 `node_modules/@livelybone/vue-datepicker/lib/css/index.scss` 得到

## QA

1. Error `Error: spawn node-sass ENOENT`

> 你可能需要全局安装 node-sass，`npm i -g node-sass`
