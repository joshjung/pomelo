## Pomelo -- a fast, scalable game server framework for node.js

Pomelo is a fast, scalable game server framework for [node.js](http://nodejs.org).

While originally developed for games, Pomelo is also suitable for real-time web applications. Its distributed architecture makes pomelo scale with ease.

[![Build Status](https://travis-ci.org/NetEase/pomelo.svg?branch=master)](https://travis-ci.org/NetEase/pomelo)

 * Homepage: <http://pomelo.netease.com/>
 * Mailing list: <https://groups.google.com/group/pomelo>
 * Documentation: <http://github.com/NetEase/pomelo>
 * Wiki: <https://github.com/NetEase/pomelo/wiki/>
 * Issues: <https://github.com/NetEase/pomelo/issues/>
 * Tags: game, nodejs

## Features

### Complete game server and realtime application server architecture

* Multiplayer games: mobile, social, web, MMORPG (middle size), etc.
* Realtime applications: chat, message push, etc.

### Fast and Scalable

* Distributed (multi-process) architecture
* Flexible server extensions
* Full performance optimization and testing

### Easy to Develop

* Simple API: setup new servers, handle client requests and responses, broadcast to client channels, etc.
* Lightweight: rapid startup, shutdown, and message processing using Node.js
* Convention over configuration philosophy: rapidly build a game right out of the box!

### Multiplatform

* Javascript
* Flash
* Android
* iOS
* cocos2d-x
* C

### Growing Tool Suite and Support

* Command line tool, admin tool, performance test tool, AI plugins, path finding plugins etc.
* Full and growing documentation
* Many examples, including an [open-source MMO RPG demo](https://github.com/NetEase/pomelo/wiki/Introduction-to--Lord-of-Pomelo)

### Extensible

* Plugin architecture
* Swap network protocols
* Custom components

## Why should I use pomelo?

Building your own fast, scalable real-time server environment is a massive undertaking. Pomelo fills this gap, providing a full solution for building your realtime server application.

Advantages include:

* Pomelo uses a multi-process, single thread runtime architecture, which has been proven in the industry and is especially suited to the node.js thread model.
* The development model is quite similar to other web frameworks, with a philosophy of convention over configuration. The [API](http://pomelo.netease.com/api.html) is also easy to use.
* The framework is extensible. Based on the node.js micro module principle, the core of pomelo is small. Nearly all of the components, libraries, and tools are separate npm modules.

## Getting Started

With the following references, you can quickly familiarize yourself with the pomelo development process:
* [Pomelo documents](https://github.com/NetEase/pomelo/wiki)
* [Getting started](https://github.com/NetEase/pomelo/wiki/Welcome-to-Pomelo)
* [Tutorial](https://github.com/NetEase/pomelo/wiki/Preface)

## Contributors
* NetEase, Inc. (@NetEase)
* Peter Johnson(@missinglink)
* Aaron Yoshitake 
* @D-Deo 
* Eduard Gotwig
* Eric Muyser(@stokegames)
* @GeforceLee
* Harold Jiang(@jzsues)
* @ETiV
* [kaisatec](https://github.com/kaisatec)
* [roytan883](https://github.com/roytan883)
* [wuxian](https://github.com/wuxian)
* [zxc122333](https://github.com/zxc122333)
* [newebug](https://github.com/newebug)
* [jiangzhuo](https://github.com/jiangzhuo)
* [youxiachai](https://github.com/youxiachai)
* [qiankanglai](https://github.com/qiankanglai)
* [xieren58](https://github.com/xieren58)
* [prim](https://github.com/prim)
* [Akaleth](https://github.com/Akaleth)
* [pipi32167](https://github.com/pipi32167)
* [ljhsai](https://github.com/ljhsai)
* [zhanghaojie](https://github.com/zhanghaojie)
* [airandfingers](https://github.com/airandfingers)
* [joshjung](https://github.com/joshjung)

## License

(The MIT License)

Copyright (c) 2012-2014 NetEase, Inc. and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.