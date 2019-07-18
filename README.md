# ziu
a simple CLI for scaffolding Vue.js/React.js/微信小程序/支付宝小程序/jQuery projects.

### Installation

* Node.js >= 6.4

```
$ npm install -g ziu
```

### Usage

```
$ ziu init <project-name>
```

Example:

```
$ ziu init test
```

The command pulls the templates from [ziu-templates](https://github.com/ziu-templates/), and then we list all templates in the repro.<br>
Like this:<br>
aliapp - 支付宝小程序模板<br>
bdapp - 百度小程序模板<br>
lib-pac - 基于Rollup打包组件和基础库模板<br>
react - a react template with webpack<br>
ttapp - 头条/抖音小程序模板<br>
usual - 传统项目模板(use jQuery)<br>
vue-3 - 使用vue-cli@3版本的项目模板<br>
weapp - 微信小程序模板<br>

then, prompts for some information, and generates the project at `./test/`.

### 查看已有的项目模板

```shell
ziu list
```

### 环境变量

- 每一个模板都有4中环境，`development、testing、staging、production`
- 环境变量是以`yaml`的文件格式编译，在项目根目录下的`config`文件夹下有5个`yaml`文件，`default.yml、development.yml、testing.yml、staging.yml、production.yml`，分别对应4中环境中使用的环境变量；`default.yml`是默认配置，其他环境的配置会和`default.yml`中的配置合并

- **环境变量在JavaScript中获取**

在`yaml`中配置的环境变量都存储在`process.env.ENV_DATA`中：

```javascript
// 获取当前环境
// 这里并没有使用process.env.NODE_ENV作为环境区分，主要为了避免第三方库依赖process.env.NODE_ENV导致出现异常
const env = process.env.ENV_DATA.PRJ_ENV;
```

### Dev

```
$ npm run dev
```

start a local server to development

### Testing

generates tesing files

```
$ npm run testing
```

### build

```
$ npm run build
```
generates production files