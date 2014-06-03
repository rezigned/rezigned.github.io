---
layout: post
title: "Getting started with Karma"
date: 2014-06-01 12:09:06
tags: 
  - "karma" 
  - "test"
  - "js"
---

### Introduction
What is `Karma`? [Karma](http://karma-runner.github.io/0.12/index.html) is a test runner for Javascript. What it does under the hood is it'll run your test suites against your favorite web browsers. 

> While Karma has an exellent documentation, it still lacks a walkthrough guide so I decided to write this blog post.

### Installation

```bash
$ cd ~/your-project/
$ npm install karma --save-dev
```

### Creating a config file

Next step is to create karam's config file. This command will ask you a few questions about tools you'll be using.

```bash
$ ./node_modules/karma/bin/karma init
```

> **NOTE** - `karma init <configFile>` accepts optional parameter `<configFile>`. If you omit this param it will create a default file called `karma.conf.js`. You can also write your config file using `coffeescript`, simply specify `<configFile>` with `.coffee` extension e.g. `karma.conf.coffee`.

Here're some questions asked by Karma

* Testing framework - jasmine, mocha, nodeunit etc
* Browsers - Chrome, Firefox, PhantomJS etc (I'd recommend `PhantomJS`)
* Files location - `src/**/*.js`, `test/**/*.js`

Once finished, Karma will automatically install required dependencies for you. Later, if you'd like to change some config in `karma.conf.js` file you'll have to manually install those plugins via `npm install` command. For example, changing from `jasmine` to `mocha` would require you to run `npm install karma-mocha --save-dev`.

> **TIP** - You can fine-tune your configurations by playing around with other options e.g. `autoWatch`, `preprocessors` etc

### Note on preprocessors
Karma can also preprocess your files e.g. `coffeescript`, `scss` etc. But personally I don't think you'll use this feature since nowadays everyone uses javascript task runner such as `GruntJS`, `Gulp` instead. Unless your project is very small and you don't want to use `tast runner`.

### Writing tests

Here's our simple test spec. It'll set an element's data attribute.

Our awesome library `./src/awesome.js`

```js
function setData(el, key, val) {
	el.setAttribute('data-' + key, val)	
}
```

Test file `./test/test.js`

```js
// using 'jasmine'
describe("My awesome library", function() {
	beforeEach(function() {
		// create a new <div id="test"></div> and append it to document
		var d = document.createElement('div');
		d.setAttribute('id', 'test');
		document.body.appendChild(d);
	});

	it("should set 'hello world' data attribute", function() {
		var d = document.getElementById('test');
		setData(d, 'test', 'hello world');

		// make sure we get right data
		expect(d.getAttribute('data-test')).toBe('hello world');
	})
})
```

> **NOTE** - The syntax and available test functions in test file depends on testing frameworks you're using.

### Running your tests

Now, the final part. Let's run our tests :)

```bash
$ ./node_modules/karma/bin/karma start
```

![Test results]({{ site.url }}/assets/{{ page.date | date:"%Y-%m-%d" }}/test-result.png)

> **TIP** - The recommended way to run tests is to add `./node_modules/karma/bin/karma start` command to your `package.json`

```js
...
"scripts": {
  "test": "./node_modules/karma/bin/karma start"
}
...
```

Now you can run your test using this `npm test` command!

