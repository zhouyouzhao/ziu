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

The command pulls the templates from [ziu-templates]/(https://github.com/ziu-templates/), and then we list all templates in the repro.<br>
Like this:<br>
aliapp - 支付宝小程序模板<br>
react - a react template with webpack<br>
usual - 传统项目模板(use jQuery)<br>
vue - a vue template with ziu<br>
weapp - 微信小程序模板<br>

then, prompts for some information, and generates the project at `./test/`.

### Env

In the template, we support 3 api envs.(development, test, production)<br>

process.env.API_ENV = 'development' <br>
process.env.API_ENV = 'test' <br>
process.env.API_ENV = 'production' <br>

### Dev

```
$ ziu dev
```
start a local server to development

### Test

```
$ ziu test
```

generates 2 envs files<br>
`test/dist/alpha/` --- process.env.API_ENV = 'test'<br>
`test/dist/release/` --- process.env.API_ENV = 'production'<br>

### build

```
$ ziu build
```
generates production files