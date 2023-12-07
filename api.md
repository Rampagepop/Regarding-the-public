[TOC]

# 上下文对象

> ctx为系统保留字段，请不要在方法中占用或赋值

# xp实例公用API

| API名称                         | 参数说明                                                  | 备注                       |
| ------------------------------- | --------------------------------------------------------- | -------------------------- |
| [get(name:string)](###get)        | name表示组件的唯一标识，不唯一系统会报错                  | 获取xp实例对象             |
| [setVisible(bool:boolean)](###setVisible) | bool为true或不填时为显示，反之则是隐藏                    | 设置某个组件显示或者隐藏   |
| [setAttr(prop:string,value:any)](###setAttr) | props表示组件的属性，多个属性可以用','，value代表设置的值 | 设置组件的属性,即设置props |
| [getAttr(prop:string)](###getAttr) | props表示组件的属性，一次只能获取一个属性的值             | 获取组件的属性             |
| [$nextTick](###$nextTick)     | 同vue的$nextTick                                          | 同vue的$nextTick           |

## xp实例公用API说明

### get

获取xp实例对象

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| name | String | 组件的唯一标识，（配置页面的组件标识字段） |

- **返回值**

  xp实例对象

- **用法**

```js
// 获取组件标识为'form'的组件
const form = ctx.get('form');
```


### setVisible

设置某个组件显示或者隐藏

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| bool | Boolean | true或不填时为显示，false为隐藏 |

- **返回值**

  无

- **用法**

```js
// 设置组件标识为'toolBar'的组件隐藏
const toolBar = ctx.get('toolBar');
// 设置toolBar组件隐藏
form.setVisible(false)
```

### setAttr

设置组件的属性,即设置props

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| prop | String | prop的key |
| value | Any | prop的值 |

- **返回值**

  无

- **用法**

```js
// 'form'为表单的组件标识
const form = ctx.get('form');
// 设置表单禁用
form.setAttr('disabled', true);
```

### getAttr

获取组件的属性

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| prop | String | prop的key |

- **返回值**

Any

- **用法**

```js
// 获取组件标识为 'form' 的组件的disabled属性值
const form = ctx.get('form');
// dis为true/false, 返回值类型 等同 属性的值类型
const dis = form.getAttr('disabled');
```


### $nextTick

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| callback | Function | 回调函数 |

- **返回值**

无

- **用法**

在下次 DOM 更新循环结束之后执行延迟回调。

```js
const form = ctx.get('form');
// 在下次 DOM 更新循环结束之后, 设置表单禁用
form.$nextTick(() => {
	form.setVisible(false)
});
   
```

   

   

# 表单API列表

| API名称                                                      | 参数说明                                                     | 备注                                                         |
| :----------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [getData](###getData)()                                      | 无参数                                                       | 获取表单数据                                                 |
| [setData](###setData)(data: object)                          | data表示要设置表单的值                                       | 设置表单的值                                                 |
| [reset](###reset)(isClear: any)                              | 参数为1时，不清除默认值                                      | 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果，参数为1时，则不清除默认值 |
| [validate](###validate)(callback:function)                   | callback校验回调                                             | 对整个表单进行校验的方法                                     |
| [setItemEditable](###setItemEditable)(keys: string, value = true) | keys指表单的项的name,多个可以用','分隔，value为true是可编辑，默认值为可编辑 | 设置表单项是否可以编辑                                       |
| [setItemVisible](###setItemVisible)(keys: string, value = true) | keys指表单的项的name,多个可以用','分隔，value为true是可见，默认值为可见 | 设置表单项是否可见                                           |
| [setItemRequire](###setItemRequire)(keys: string, value = true) | keys指表单的项的name,多个可以用','分隔，value为true是必填，默认值为必填 | 设置表单项是否必填                                           |
| [setItemRules](###setItemRules)(keys: string, value: string ) | keys指表单的项的name,多个可以用','分隔，value指校验规则可填值： number，age，postcode，ip，telephone，phone，numberAndLetter，mobile，IDCard，isChnChar，trim，email，digit，pInt，gZero，speChar | 设置表单的校验规则                                           |
| [getItemRules](###getItemRules)(keys: string)                | keys指表单的项的name,多个可以用','分隔                       | 获取表单的校验规则                                           |
| [setFormItemAttr](####setFormItemAttr)(name: string, value: object) | name指表单项的name,多个可以用','分隔，value为设置对象        | 设备表单项的属性                                             |
| [getFormItemAttr](####getFormItemAttr)(name: string,key:string) | name指表单项的name,key表单项具体的属性                       | 获取表单项的属性                                             |

## 表单API说明

### getData

获取表单数据

- **参数**

无

- **返回值**

Object

- **用法**

```js
// 获取表单xp实例
const form = ctx.get('form')
// 调用获取数据, formdata为Object类型
const formdata = form.getData()
```

### setData

设置表单数据

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
|  data  | Object |     表单数据

- **返回值**

无

- **用法**

```js
const data = {
  name: '小明',
  phone:'59737700'
}
ctx.get('form').setData(data)
```

### reset

重置表单

- **参数**

无

- **返回值**

无

- **用法**

```js
// 重置表单
ctx.get('form').reset()
```

### validate

校验所有显示的表单项

- **参数**

无

- **返回值**

Boolean

- **用法**

```js 
const valid = ctx.get('form').validate();
if(valid){
	xp.message('验证通过')
} else {
	xp.message('验证不通过')
}
```

### setItemEditable

设置表单项是否可以编辑

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| key | String | 字段标识,多个可以用','分隔 |
| value | Boolean | true/false(可编辑/禁用编辑) |

- **返回值**

无

- **用法**

```js
const form = ctx.get('form')
// 设置name字段不可编辑
form.setItemEditable('name', false);
// 同时设置多个字段不可编辑
form.setItemEditable('name,age,sex', false);
```

### setItemVisible

设置表单项是否显示/隐藏

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| key | String | 字段标识,多个可以用','分隔 |
| value | Boolean | true/false(显示/隐藏) |

- **返回值**

- **用法**

```js
const form = ctx.get('form')
// 设置name字段隐藏
form.setItemVisible('name', false);
// 同时设置多个字段隐藏
form.setItemVisible('name,age,sex', false);
```

### setItemRequire

设置表单项是否必填 

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| key | String | 字段标识,多个可以用','分隔 |
| value | Boolean | true/false(必填/非必填) |

- **返回值**

无

- **用法**

```js
const form = ctx.get('form')
// 设置name字段必填
form.setItemRequire('name', true);
// 同时设置多个字段必填
form.setItemRequire('name,age,sex', true);
```

### setItemRules

设置表单项的校验规则

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| key | String | 字段标识，多个可以用','分隔 |
| rule | Boolean | 指校验规则，可填值： number，age，postcode，ip，telephone，phone，numberAndLetter，mobile，IDCard，isChnChar，trim，email，digit，pInt，gZero，speChar |

- **返回值**

无

- **用法**

```js
const form = ctx.get('form')
// 设置mail字段的校验规则为 email
form.setItemRules('mail', 'email');
// 同时设置多个字段校验规则为邮箱
form.setItemRules('name,age,sex', 'email');
```

### getItemRules

获取表单项的校验规则

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| key | String | 字段标识，多个可以用','分隔 |

- **返回值**

Array

- **用法**

```js
const form = ctx.get('form')
// 获取mail字段的校验规则
const rules = form.getItemRequire('mail');
```

### setFormItemAttr

设置表单项属性

- **参数**

| 参数  | 类型   | 描述               |
| ----- | :----- | ------------------ |
| name  | String | 字段标识           |
| value | Object | 需要设置的属性对象 |

- **返回值**

Array

- **用法**

```js
const form = ctx.get('yuxpForm')
// 设置表单项为title的 placeholder属性为新标题
form.setFormItemAttr('title', {
  placeholder: '新标题',
});
```

### getFormItemAttr

设置表单项属性

- **参数**

| 参数 | 类型   | 描述             |
| ---- | :----- | ---------------- |
| name | String | 字段标识         |
| key  | String | 表单项具体的属性 |

- **返回值**

Array

- **用法**

```js
const form = ctx.get('yuxpForm')
// 获取名为title的表单项 placeholder的属性值
const placeholder = form.getFormItemAttr('title', 'placeholder');
```

   

# 表格API列表

| API名称                                                      | 参数说明                                                     | 备注                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [getData](###getData)()                                      | 无                                                           | 获取表格数据                                                 |
| [setData](###setData)(tableData)                             |                                                              | 设置表格数据                                                 |
| [query](###query)(queryParam:object)                         | 参数为查询条件对象                                           | 重新加载数据,参数为查询条件对象                              |
| [remoteData](###remoteData)()                                | 无                                                           | 刷新当前页数据                                               |
| [getSelections](###getSelections)()                          | 无                                                           | 获取选中数据                                                 |
| [setSelectRow](###setSelectRow)(row:object)                  | row为选中行的数据对象                                        | 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。 |
| [setColumnHidden](###setColumnHidden)(cols: string, hidden = true) | cols表示列名多个可以用','分隔，hidden默认值为隐藏，反之则是显示 | 设置列隐藏                                                   |
| [clearData](###clearData)()                                  | 无                                                           | 清空数据                                                     |
| [toggleRowSelection](###toggleRowSelection)(row: object, selected = true) | row为选中行的数据对象,selected 为 true 则,选中               | 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中） |
| [expandAll](###expandAll)(isExpand = true)                   |                                                              | 树形表格展开所有,参数为false时为收缩所有，注意懒加载时不会自动去请求 |

## 表格API说明

### getData

获取表格数据

- **参数**

无

- **返回值**

Array&#60;Object&#62;

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
const tableData = table.getData()
```



### setData

设置表格数据

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | ----- | ------------------------------------------ |
| tableData | Array&#60;Object&#62; | 表格数据 |

- **返回值**

无

- **用法**

```js
const tableData = [
  {name: '小米', age: 18},
  {name: '大米', age: 19}
]
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
table.setData(tableData)
```



### query

查询表格数据

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| queryParam | Object | 参数为查询条件对象 |

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 带参查询
table.query({type: '2'})
```



### remoteData

刷新表格数据

- **参数**

无

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 刷新表格
table.remoteData()
```



### getSelections

获取选中行

- **参数**

无

- **返回值**

Array&#60;Object&#62;

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 获取选中行数据
const selections = table.getSelections()
if(selections.length === 0){
  // 没有选中行
}
```



### setSelectRow

用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| row | Object | 行数据 |

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 设置选中行
table.setSelectRow(row)
```



### setColumnHidden

设置列隐藏

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| cols | String | 表示列名，多个可以用','分隔 |
| hidden | Boolean | 默认值为隐藏，反之则是显示 |

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 设置字段name列隐藏
table.setColumnHidden('name')
```



### clearData

- **参数**

无

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 设置字段name列隐藏
table.clearData()
```



### toggleRowSelection

用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| row | Object | 行数据 |
| selected | Boollean | 是否选中 |

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 设置数据为row的行选中
table.toggleRowSelection(row, true)
```



### expandAll

  树形表格展开所有,参数为false时为收缩所有，注意懒加载时不会自动去请求

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| expand | Boolean | 展开/收缩 |

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的表格ctx实例
const table = ctx.get('refTable')
// 展开树形表格
table.expandAll(true)
```

​    

# 树API列表

| API名称                                               | 参数说明                                                     | 备注                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| getData()                                             | 无                                                           | 获取树数据                                                   |
| setData(data: object \| object[])                     |                                                              | 设置树数据                                                   |
| query(params: object)                                 | 无                                                           | 重新加载远程数据                                             |
| getCheckedNodes(leafOnly：boolean)                    | (leafOnly) 接收一个 boolean 类型的参数，若为 `true` 则仅返回被选中的叶子节点，默认值为 `false` | 若节点可被选择（即 `show-checkbox` 为 `true`），则返回目前被选中的节点所组成的数组 |
| setCheckedKeys(keys: string[], leafOnly = false)      | (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 `true` 则仅设置叶子节点的选中状态，默认值为 `false` | 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性 |
| getCurrentNode()                                      |                                                              | 获取当前被选中节点的 data，若没有节点被选中则返回 null       |
| expandNode(key: string)                               | 节点的key                                                    | 展开节点                                                     |
| collapseNode(key: string)                             | 收缩节点                                                     | 收缩节点                                                     |
| getNode(data: string \| object)                       | (data) 要获得 node 的 key 或者 data                          | 根据 data 或者 key 拿到 Tree 组件中的 node                   |
| insertAfter(data: object, refNode: string \| object)  | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的前一个节点的 data、key 或者 node | 为 Tree 的一个节点的后面增加一个节点                         |
| insertBefore(data: object, refNode: string \| object) | (data, refNode) 接收两个参数，1. 要增加的节点的 data 2. 要增加的节点的后一个节点的 data、key 或者 node | 为 Tree 的一个节点的前面增加一个节点                         |
| append(data: object, parentNode: string \| object)    | (data, parentNode) 接收两个参数，1. 要追加的子节点的 data 2. 子节点的 parent 的 data、key 或者 node | 为 Tree 中的一个节点追加一个子节点                           |
| remove(data: object)                                  | (data) 要删除的节点的 data 或者 node                         | 删除 Tree 中的一个节点，使用此方法必须设置 node-key 属性Ï    |



## 树API说明

### getData

获取树数据

- **参数**

无

- **返回值**

Array&#60;Object&#62;

- **用法**

```js
// 获取到组件标识为'refTable'的树ctx实例
const tree = ctx.get('refTree')
const treeData = table.getData()
```



### setData

设置树数据

- **参数**

| 参数     | 类型          | 描述   |
| -------- | :------------ | ------ |
| treeData | Array&#60;Object&#62; | 树数据 |

- **返回值**

无

- **用法**

```js
// 树数据，实际业务中应该是接口请求回来的数据
const treeData = [
  {name: '小米', age: 18, id: '0', parentId: '-1'},
  {name: '大米', age: 19, id: '1', parentId: '0'}
]
// 获取到组件标识为'refTree'的树ctx实例
const tree = ctx.get('refTree')
tree.setData(treeData)
```



### query

查询数据

- **参数**

| 参数       | 类型   | 描述               |
| ---------- | :----- | ------------------ |
| queryParam | Object | 参数为查询条件对象 |

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTree'的树ctx实例
const tree = ctx.get('refTree')
// 带参查询
table.query({type: '2'})
```



### remoteData

刷新树的数据

- **参数**

无

- **返回值**

无

- **用法**

```js
// 获取到组件标识为'refTable'的树ctx实例
const table = ctx.get('refTable')
// 刷新树
table.remoteData()
```

### 其他的请参考[树组件使用说明]([YUFP统一前端平台-PC (yusyscloud.com)](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/xtree))

# CRUD API列表

| API名称                                        | 参数说明                                     | 备注     |
| ---------------------------------------------- | -------------------------------------------- | -------- |
| $openAdd(ctx: any, before: any, after: any)    | ctx当前上下文，before前置处理，after后置处理 | 新增     |
| $openUpdate(ctx: any, before: any, after: any) | ctx当前上下文，before前置处理，after后置处理 | 修改     |
| $openView(ctx: any, before: any, after: any)   | ctx当前上下文，before前置处理，after后置处理 | 查看     |
| $doDelete(ctx: any, before: any, after: any)   | ctx当前上下文，before前置处理，after后置处理 | 删除     |
| $doSave(ctx: any, before: any, after: any)     | ctx当前上下文，before前置处理，after后置处理 | 保存     |
| $doCancel(ctx: any, before: any, after: any)   | ctx当前上下文，before前置处理，after后置处理 | 取消     |
| $doSearch(ctx: any, before: any, after: any)   | ctx当前上下文，before前置处理，after后置处理 | 内置查询 |
| $doExport(ctx: any, before: any, after: any)   | ctx当前上下文，before前置处理，after后置处理 | 导出     |
| $doImport(ctx: any, before: any, after: any)   | ctx当前上下文，before前置处理，after后置处理 | 导入     |

# 全局API

| API名称               | 参数说明                                                     | 备注           |
| --------------------- | ------------------------------------------------------------ | -------------- |
| [loading](###loading) | 参考：[loading指令使用](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/loading) | Loading 加载   |
| [message](###message) | 参考：[message组件使用](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/message) | 交互信息提示框 |
| [alert](###message)   | 参考：[alert组件使用](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/alert) | 交互信息提示框 |
| [confirm](###message) | 参考：[confirm组件使用](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/message-box) | 交互信息提示框 |
| [notify](###message)  | 参考：[notify组件使用](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/notification) | 交互信息提示框 |
| [dialog](###message)  |                                                              | 弹出窗口       |
| [action](###action)   |                                                              |                |
| [request](###request) |                                                              | 请求后台       |

## 全局API说明

### loading

- **参数**

参考：[loading指令](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/loading)

| 参数        | 说明                                                         | 类型          | 可选值 | 默认值        |
| :---------- | :----------------------------------------------------------- | :------------ | :----- | :------------ |
| target      | Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，则会将其作为参数传入 `document.querySelector`以获取到对应 DOM 节点。`target` 属性的优先级比`fullscreen`属性的优先级高，若配置了`target` 属性为非 document.body，配置`fullscreen`属性为`true`不会生效 | object/string | —      | document.body |
| body        | 同 `v-loading` 指令中的 `body` 修饰符，`body`为`true`表示使遮罩插入至 HTML 的 body 标签 上，`body`为`false` 表示插入到绑定元素的节点中。默认为插入至 绑定元素的节点中 | boolean       | —      | false         |
| fullscreen  | 同 `v-loading` 指令中的 `fullscreen` 修饰符，实现全屏遮罩，包括整个滚动可视区域。为`true`表示遮罩为全屏；为`false`表示遮罩为非全屏，默认为全屏遮罩。`fullscreen`属性的优先级比`target`属性的优先级低，若配置了`target` 属性为非 document.body，配置`fullscreen`属性为`true`不会生效 | boolean       | —      | true          |
| lock        | 同 `v-loading` 指令中的 `lock` 修饰符，在使用全屏遮罩时，控制是否锁定屏幕的滚动。为true表示锁定；为false表示不锁定，即可滚动。默认为不锁定。该属性和`fullscreen`属性配合使用，单独使用该属性，不会有任何效果 | boolean       | —      | false         |
| text        | 显示在加载图标下方的加载文案                                 | string        | —      | —             |
| customClass | Loading 的自定义类名                                         | string        | —      | —             |
| spinner     | 自定义加载图标类名                                           | string        | —      | —             |
| background  | 遮罩背景色                                                   | string        | —      | —             |

- **用法**

```js
xp.loading({
  target: '.loading-target', // loading的目标元素
  duration: 3000, // loading时长
})
```



### message

- **参数**

参考：[message组件](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/message)

| 参数                     | 说明                                                         | 类型           | 可选值                     | 默认值 |
| :----------------------- | :----------------------------------------------------------- | :------------- | :------------------------- | :----- |
| message                  | 消息文字                                                     | string / VNode | —                          | —      |
| type                     | 主题                                                         | string         | success/warning/info/error | info   |
| iconClass                | 自定义图标的类名，会覆盖 `type`                              | string         | —                          | —      |
| customClass              | 自定义类名                                                   | string         | —                          | —      |
| duration                 | 显示时间, 毫秒。设为 0 则不会自动关闭                        | number         | —                          | 3000   |
| showClose                | 是否显示关闭按钮                                             | boolean        | —                          | true   |
| onClose                  | 关闭时的回调函数, 参数为被关闭的 message 实例                | function       | —                          | —      |
| lineBreak                | 是否将\n解析成换行                                           | boolean        | —                          | false  |
| dangerouslyUseHTMLString | 是否支持HTML文本显示,当需要将message内容当成html解析时，该属性需为true; `【*注：该属性会存在XSS安全问题】` | boolean        | —                          | false  |
| center                   | 文字是否居中                                                 | boolean        | —                          | false  |
| offset                   | Message 距离窗口顶部的偏移量                                 | number         | —                          | 20     |
| showTopWindow            | 是否显示消息框在根部window，例如ifrme中页面弹出消息          | boolean        | —                          | false  |

- **用法**

```js
// 最简单
xp.message('这是一条消息提示');

// 自定义内容
xp.message({
  message: h('p', null, [
    h('span', null, '内容可以是 '),
    h('i', { style: 'color: teal' }, 'VNode')
  ])
});

// 成功状态
xp.message({
  message: '恭喜你，这是一条成功消息',
  type: 'success'
});

// 可关闭
xp.message({
  showClose: true,
  message: '这是一条消息提示'
});
```



### alert

- **参数**

参考：[alert组件](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/alert)

| 参数        | 说明                               | 类型    | 可选值                     | 默认值 |
| :---------- | :--------------------------------- | :------ | :------------------------- | :----- |
| **title**   | 标题，**必选参数**                 | string  | —                          | —      |
| type        | 主题                               | string  | success/warning/info/error | info   |
| description | 辅助性文字。也可通过默认 slot 传入 | string  | —                          | —      |
| closable    | 是否可关闭                         | boolean | —                          | true   |
| close-text  | 关闭按钮自定义文本                 | string  | —                          | —      |
| show-icon   | 是否显示图标                       | boolean | —                          | false  |

- **用法**

```js
xp.alert({
  title: 'alert',
  type: 'success'
})
```



### confirm

- **参数**

参考：[confirm组件](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/message-box)

| 参数    | 说明                                                         | 类型           | 可选值 | 默认值 |
| :------ | :----------------------------------------------------------- | :------------- | :----- | :----- |
| message | 消息正文内容，与 $msgbox Options中的message属性相同          | string / VNode | —      | —      |
| title   | 标题，与 $msgbox Options中的title属性相同                    | string         | —      | —      |
| options | 配置项，参考[confirm组件](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/message-box) | string         | —      | —      |

- **用法**

```js
xp.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  type: 'warning',
  callback: function (action) {
    if (action === 'confirm') {
      xp.message({
        message: '删除成功!',
        type: 'success'
      });
    } else {
      xp.message({
        message: '已取消删除',
        type: 'info'
      });
    }
  }
});
```



### notify

- **参数**

参考：[notify组件](http://yudp.yusyscloud.com:30527/yufp-widgets-pc/index.html?t=1646014224143#/zh-CN/component/notification)

| 参数                     | 说明                                                         | 类型             | 可选值                                      | 默认值    |
| :----------------------- | :----------------------------------------------------------- | :--------------- | :------------------------------------------ | :-------- |
| title                    | 标题                                                         | string           | —                                           | —         |
| message                  | 说明文字                                                     | string/Vue.VNode | —                                           | —         |
| dangerouslyUseHTMLString | 是否将 message 属性作为 HTML 片段处理                        | boolean          | —                                           | false     |
| type                     | 主题样式，如果不在可选值内将被忽略                           | string           | success/warning/info/error                  | —         |
| iconClass                | 自定义图标的类名。若设置了 `type`，则 `iconClass` 会被覆盖   | string           | —                                           | —         |
| customClass              | 自定义类名                                                   | string           | —                                           | —         |
| duration                 | 显示时间, 毫秒。设为 0 则不会自动关闭                        | number           | —                                           | 4500      |
| position                 | 自定义弹出位置                                               | string           | top-right/top-left/bottom-right/bottom-left | top-right |
| showClose                | 是否显示关闭按钮                                             | boolean          | —                                           | true      |
| onClose                  | 关闭时的回调函数                                             | function         | —                                           | —         |
| onClick                  | 点击 Notification 时的回调函数                               | function         | —                                           | —         |
| offset                   | 偏移的距离，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 | number           | —                                           | 0         |
| special                  | 特殊用法，如：通知的内容信息须要用户确认时可开启(为true时，duration属性值自动设置为0) | boolean          | true/false                                  | false     |
| picUrl                   | 特殊用法时出现在消息框左侧的自定义图片URL                    | string           | —                                           | —         |

- **用法**

```js
// 可自动关闭
xp.notify({
     title: '标题名称',
     message: h('i', { style: 'color: #20C098'}, '这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案')
 });
// 不会自动关闭
xp.notify({
    title: '提示',
    message: '这是一条不会自动关闭的消息',
    duration: 0
});
```



### dialog

打开弹框页面

- **参数**

| 参数 | 类型   | 描述                                       |
| ---- | :----- | ------------------------------------------ |
| top | String |  |
| title | String | 弹框的title |
| width | String | 弹框的宽度 |
| pageId | String | 弹出窗口打开页面编码 |
| pageParams | Object | 打开页面传递参数 |

- **返回值**

无

- **用法**

```js
xp.dialog({
  top: '10px', 
  title: '我的视图', // 弹框的title
  width: '1200px', // 弹框的宽度
  // 弹出窗口打开页面编码
  pageId: 'complexTreeTabTpl',
  // 打开页面传递参数
  pageParams: {
    rowData: data[0],
    callback: (retData) => {
      // 回调方法处理
    }
  }
})
```

### request

发送请求

- **用法**

```js
xp.request({
  url: backend.yuxpService + '/api/base/save/userMgr', // 请求地址
  method: 'post', // 请求方法
  data: data // 请求参数
}).then(res => {
  // 请求成功的逻辑
	xp.message('保存成功！')
}).catch(error => {
  // 异常逻辑
})
```

# 常用代码片段（直接copy更改参数使用）

### 表单相关示例

```js
/**
 * 禁用表单项
 */
function disabledFn() {
  ctx.get("refForm").setItemEditable("userId,loginCode", false);

}
/**
 * 启用表单项
 */
function enableFn() {
  ctx.get("refForm").setItemEditable("userId,loginCode", true);
}

/**
 * 禁用一个分组项
 */
function groupDisable() {
  ctx.get("refForm").setItemEditable("userId,loginCode,userName,certType,certNo,userCode,deadline,orgId,dptId,userPassword,userSex,userBirthday", false);
}
/**
 * 启用一个分组表单项
 */
function groupEnable() {
  ctx.get("refForm").setItemEditable("userId,loginCode,userName,certType,certNo,userCode,deadline,orgId,dptId,userPassword,userSex,userBirthday", true);
}

/**
 * 禁用全部
 */
function disabledAllFn() {
  ctx.get("refForm").setAttr('disabled', true)
}
/**
 * 启用全部
 */
function endisabledAllFn() {
  ctx.get("refForm").setAttr('disabled', false)
}

/**
 * 添加必填规则
 */
function requireFn() {
  ctx.get("refForm").setItemRequire("certNo,userCode", true);
}
/**
 * 取消必填规则
 */
function unrequireFn() {
  ctx.get("refForm").setItemRequire("certNo,userCode", false);
}

/**
 * 隐藏表单项
 */
function hiddenFn() {
  ctx.get("refForm").setItemVisible("loginCode,userName", false);
}
/**
 * 显示表单项
 */
function showFn() {
  ctx.get("refForm").setItemVisible("loginCode,userName", true);
}

/**
 * 禁用、启用按钮
 */
function disabledBtnFn() {
  var dis = ctx.get("disabledFn").getAttr("disabled");
  if (dis) {
    ctx.get("disabledFn").setAttr("disabled", false);
  } else {
    ctx.get("disabledFn").setAttr("disabled", true);
  }
}

/**
 * 保存按钮
 */
function save() {
  ctx.get("refForm").validate((valid) => {
    if (!valid) {
      xp.warning('请完善表单信息');
    } else {
      var data = ctx.get("refForm").getData();
      xp.request({
        url: backend.yuxpService + '/api/base/save/userMgr',
        method: 'post',
        data: data
      }).then(res => {
        xp.message('保存成功！')
      }).catch(error => {
        xp.error('保存成功！')
        xp.mess
      })
    }
  });
}

// 成功消息提示
function successMessage() {
  //success/warning/info/error
  xp.message({ type: "success", message: "消息测试" })
}

/**
 * 警告消息提示
 */
function warningMessage() {
  //success/warning/info/error
  xp.message({ type: "warning", message: "消息测试" })
}

/**
 * 提示消息
 */
function infoMessage() {
  //success/warning/info/error
  xp.message({ type: "info", message: "消息测试" })
}

/**
 * 错误消息
 */
function errorMessage() {
  //success/warning/info/error
  xp.message({ type: "error", message: "消息测试" })
}



```



### 表格相关示例

```js

/**
 * 单选/复选切换
 */
function singleFn(ctx) {
  ctx.get('crudTable').setAttr('selectionType', 'radio')
}
/**
 * 单选/复选切换
 */
function multiFn(ctx) {
  ctx.get('crudTable').setAttr('selectionType', 'checkbox')
}

/** 
 * 打开选中数据
 */
function printData(ctx) {
  const data = ctx.get('crudTable').getSelections()[0];
  xp.message(JSON.stringify(data))
}

/**
 * 隐藏与显示
 */
function hiddenFn(ctx) {
  ctx.get('crudTable').setColumnHidden('userName', true)
}
/**
 * 隐藏与显示
 */
function visibleFn(ctx) {
  ctx.get('crudTable').setColumnHidden('userName', false)
}

/**
 * 选中第一条数据
 */
function selectOne(ctx) {
  const data = ctx.get('crudTable').getData()
  ctx.get('crudTable').toggleRowSelection(data[0], true)
}

/**
 * 斑马纹
 */
function setStyle(ctx) {
  ctx.get('crudTable').setAttr('stripe', true)
}

/**
 * 显示表头
 */
function setHeader(ctx) {
  let data = ctx.get('crudTable').getAttr('showHeader');
  if (data == undefined) {
    data = true
  }
  ctx.get('crudTable').setAttr('showHeader', !data)
}
/**
 * 隐藏分页
 */
function closePageFn(ctx) {
  ctx.get('crudTable').setAttr('pageable', false)
}

function toggleAll() {
  ctx.get('crudTable')['__private_0_renderer'].$refs.tableRef.toggleAllSelection()
}
function setOneValue() {
  const data = ctx.get('crudTable').getData()
  data[0].userName = '张三'
  ctx.get('crudTable').setData(data)
}
function disabledButton() {
  const dis = ctx.get("single").getAttr("disabled");
  if (dis) {
    ctx.get("single").setAttr("disabled", false);
  } else {
    ctx.get("single").setAttr("disabled", true);
  }
}


```



### 弹出列表选择

```js
/**
 * 选择数据返回（列表上选择按钮）
 */
function selectFn() {
  const scopeData = ctx.getScopeData();
  let selections = [scopeData.row];
  xp.logger.info(selections)
  const pageParams = ctx.data ? ctx.data.pageParams : undefined;
  if (pageParams && pageParams.callback) {
    pageParams.callback(selections[0]);
  }
  xp.dialog.close();
}


/**
 * 选择数据返回（工具栏选择按钮）
 */
function selectFn() {
  const scopeData = ctx.getScopeData();
  let selections = [scopeData.row];
  const pageParams = ctx.data ? ctx.data.pageParams : undefined;
  if (pageParams && pageParams.callback) {
    pageParams.callback(selections[0]);
  }
  xp.dialog.close();
}
```



### 树&表单示例

```js
function orgNodeSelect(ctx,data) {
    ctx.get("orgForm").setData(data);
}

function save(ctx){
  ctx.get("orgForm").validate((valid)=>{
     if (!valid) {
        xp.warning('请完善表单信息');
     }else{
        var data = ctx.get("orgForm").getData();
        xp.request({
          url: backend.yuxpService + '/api/base/update/orgManager',
          method: 'post',
          data: data
        }).then(res => {
          xp.message('保存成功！')
        })
      }
  });
}


```



### 页面弹出及接收参数

```js

/**
 * 弹出页面示例
 */
function customView(ctx) {
  let data = ctx.get('crudTable').getSelections();
  if (data && data.length != 1) {
    xp.message('请选择一条记录！');
    return;
  }
  xp.dialog({
    title: '查看1',
    width: '1000px',
    // 弹出窗口打开页面编码
    pageId: 'complexP0314',
    // 打开页面传递参数对象
    pageParams: {
      rowData: data[0],
      // 用于给弹出页面调用的方法
      callback: (retData) => {
        // 用于编写起始页面逻辑
      }
    }
  })
}

/**
 * 接收数据
 */
function onMounted(ctx) {
  let pageParams = ctx.data.pageParams || {};
  let rowData = pageParams.rowData;

  if (!rowData) {
    // 通过远程请求方式获取数据
    xp.request({
      method: 'GET',
      url: backend.yuxpService + '/api/base/list/MC202203141641560673',
      data: {
        loginCode: 'helin3'
      }
    }).then((response) => {
      let data = response.data[0];
      ctx.get('myForm').setData(data);
    })
  } else {
    let myForm = ctx.get('myForm').setData(rowData);
  }
}


```

