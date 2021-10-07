/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.ts":
/*!*********************!*\
  !*** ./src/game.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GameStatus\": () => (/* binding */ GameStatus),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _pixel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pixel */ \"./src/pixel.ts\");\n\r\nvar GameStatus;\r\n(function (GameStatus) {\r\n    GameStatus[GameStatus[\"Active\"] = 0] = \"Active\";\r\n    GameStatus[GameStatus[\"Inactive\"] = 1] = \"Inactive\";\r\n})(GameStatus || (GameStatus = {}));\r\nvar Action;\r\n(function (Action) {\r\n    Action[\"Swallow\"] = \"Swallow\";\r\n    Action[\"Push\"] = \"Push\";\r\n})(Action || (Action = {}));\r\nvar Game = /** @class */ (function () {\r\n    function Game(canvasId) {\r\n        var _this = this;\r\n        this.status = GameStatus.Inactive;\r\n        this.screen = { width: 800, height: 600 };\r\n        this.fpsLimit = 1000 / 60;\r\n        // public fpsLimit = 0;\r\n        this.maxPixels = 100000;\r\n        this.mouse = { x: 0, y: 0 };\r\n        this.mouseAction = Action.Push;\r\n        this.deltaTime = 0;\r\n        this.fps = {\r\n            total: 0,\r\n            counter: 0,\r\n            timeLeft: 0\r\n        };\r\n        this.deltaTimeTimestamp = 0;\r\n        this.canvas = document.getElementById(canvasId);\r\n        this.gameObjects = new Array();\r\n        this.layers = new Array();\r\n        this.canvas.width = window.innerWidth;\r\n        this.canvas.height = window.innerHeight;\r\n        this.screen.width = window.innerWidth;\r\n        this.screen.height = window.innerHeight;\r\n        this.deltaTime = 0;\r\n        this.deltaTimeTimestamp = Date.now();\r\n        this.ctx = this.canvas.getContext('2d');\r\n        this.imageData = this.ctx.createImageData(this.screen.width, this.screen.height);\r\n        this.imageData32 = new Uint32Array(this.imageData.data.buffer);\r\n        document.onmousemove = function (event) {\r\n            _this.mouse = { x: event.pageX, y: event.pageY };\r\n        };\r\n        document.onmousedown = function (event) {\r\n            switch (event.button) {\r\n                case 2: // Right click\r\n                    var enumList = Object.keys(Action);\r\n                    _this.mouseAction = enumList.indexOf(_this.mouseAction) + 1 < enumList.length ?\r\n                        enumList[enumList.indexOf(_this.mouseAction) + 1] :\r\n                        enumList[0];\r\n                    break;\r\n            }\r\n        };\r\n        // Disable dropdown menu on right click\r\n        document.addEventListener('contextmenu', function (event) { return event.preventDefault(); });\r\n    }\r\n    Game.prototype.loop = function () {\r\n        var _this = this;\r\n        if (this.status == GameStatus.Active) {\r\n            // Main loop logic\r\n            this.clearScreen();\r\n            this.drawObjects();\r\n            for (var i = 0; i < this.gameObjects.length; i++) {\r\n                var pxl = this.gameObjects[i];\r\n                var nextPos = {\r\n                    x: pxl.position.x + pxl.direction.x * pxl.velocity,\r\n                    y: pxl.position.y + pxl.direction.y * pxl.velocity\r\n                };\r\n                if (nextPos.x > this.screen.width) {\r\n                    pxl.position.x = this.screen.width;\r\n                    pxl.direction.x *= -1.1 + Math.random() * 0.2;\r\n                }\r\n                if (nextPos.x < 0) {\r\n                    pxl.position.x = 0;\r\n                    pxl.direction.x *= -1.1 + Math.random() * 0.2;\r\n                }\r\n                if (nextPos.y > this.screen.height) {\r\n                    pxl.position.y = this.screen.height;\r\n                    pxl.direction.y *= -1.1 + Math.random() * 0.2;\r\n                }\r\n                if (nextPos.y < 0) {\r\n                    pxl.position.y = 0;\r\n                    pxl.direction.y *= -1.1 + Math.random() * 0.2;\r\n                }\r\n                pxl.position.x += pxl.direction.x * pxl.velocity;\r\n                pxl.position.y += pxl.direction.y * pxl.velocity;\r\n                pxl.velocity -= pxl.linearDrag * pxl.velocity;\r\n                var dir = { x: pxl.position.x - this.mouse.x, y: pxl.position.y - this.mouse.y };\r\n                var dist = Math.sqrt(Math.pow(dir.x, 2) + Math.pow(dir.y, 2));\r\n                var dirNormalized = { x: dir.x / dist, y: dir.y / dist };\r\n                if (dist < 100 && dist > 10) {\r\n                    pxl.direction = { x: dir.x, y: dir.y };\r\n                    switch (this.mouseAction) {\r\n                        case Action.Push:\r\n                            pxl.velocity += dist / 100 * 0.01;\r\n                            break;\r\n                        case Action.Swallow:\r\n                            pxl.velocity -= dist / 100 * 0.05;\r\n                            break;\r\n                    }\r\n                }\r\n                // console.log(dist, pxl.position.x, pxl.position.y, dirNormalized, pxl.velocity);\r\n                //obj.onUpdate();\r\n            }\r\n            ;\r\n            this.ctx.fillStyle = 'rgb(100, 100, 100)';\r\n            this.ctx.font = '20px arial bold';\r\n            this.ctx.fillText(\"FPS: \" + this.fps.total, 10, 20);\r\n            this.ctx.fillText(\"Stars: \" + this.gameObjects.length.toString(), 10, 40);\r\n            this.ctx.fillText(\"Action: \" + this.mouseAction.toString(), 10, 60);\r\n            // this.ctx.fillStyle = 'rgb(0, 0, 0)';\r\n            // this.ctx.font = '200px arial';\r\n            // this.ctx.fillText('FUCK YOU', this.screen.width / 2 - 600, this.screen.height / 2 + 70);\r\n        }\r\n        this.deltaTime = Date.now() - this.deltaTimeTimestamp;\r\n        this.fps.timeLeft += this.deltaTime;\r\n        this.deltaTimeTimestamp = Date.now();\r\n        this.fps.counter++;\r\n        if (this.fps.timeLeft >= 1000) {\r\n            this.fps.total = this.fps.counter;\r\n            this.fps.timeLeft = 0;\r\n            this.fps.counter = 0;\r\n        }\r\n        setTimeout(function () { return _this.loop(); }, this.fpsLimit - this.deltaTime);\r\n    };\r\n    Game.prototype.start = function () {\r\n        console.log('Game Started');\r\n        this.status = GameStatus.Active;\r\n        this.loop();\r\n        for (var i = 0; i < this.maxPixels; i++) {\r\n            this.createPixel();\r\n        }\r\n    };\r\n    Game.prototype.stop = function () {\r\n        console.log('Game Stopped');\r\n        this.status = GameStatus.Inactive;\r\n    };\r\n    Game.prototype.clearScreen = function () {\r\n        this.ctx.fillStyle = 'rgb(0, 0, 0)';\r\n        this.ctx.fillRect(0, 0, this.screen.width, this.screen.height);\r\n        this.imageData32.fill(0x00000000);\r\n    };\r\n    Game.prototype.drawObjects = function () {\r\n        for (var i = 0; i < this.gameObjects.length; i++) {\r\n            var obj = this.gameObjects[i];\r\n            this.imageData32[Math.floor(obj.position.x) + Math.floor(obj.position.y) * this.screen.width] = obj.color;\r\n        }\r\n        this.ctx.putImageData(this.imageData, 0, 0);\r\n    };\r\n    Game.prototype.addObject = function (gameObject) {\r\n        if (!this.layers[gameObject.layer]) {\r\n            this.layers[gameObject.layer] = new Array();\r\n        }\r\n        this.layers[gameObject.layer].push(gameObject);\r\n        this.gameObjects.push(gameObject);\r\n    };\r\n    Game.prototype.createPixel = function () {\r\n        if (this.gameObjects.length < this.maxPixels) {\r\n            var newPxl = new _pixel__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('pixel' + (this.gameObjects.length + 1), {\r\n                x: Math.random() * this.screen.width,\r\n                y: Math.random() * this.screen.height,\r\n            });\r\n            var color = Math.min(Math.round(this.gameObjects.length / this.maxPixels * 200) + 55, 255).toString(16);\r\n            newPxl.color = parseInt('0xFF' + color + color + color);\r\n            newPxl.direction.x = -1 + Math.random() * 2;\r\n            newPxl.direction.y = -1 + Math.random() * 2;\r\n            this.addObject(newPxl);\r\n            return newPxl;\r\n        }\r\n        return null;\r\n    };\r\n    return Game;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);\r\n\n\n//# sourceURL=webpack://isominer/./src/game.ts?");

/***/ }),

/***/ "./src/gameObject.ts":
/*!***************************!*\
  !*** ./src/gameObject.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nvar GameObject = /** @class */ (function () {\r\n    function GameObject() {\r\n        this.id = '';\r\n        this.layer = 0;\r\n        this.position = {\r\n            x: 0,\r\n            y: 0\r\n        };\r\n        this.color = parseInt('0xFFFFFFFF', 16);\r\n    }\r\n    GameObject.prototype.onUpdate = function () {\r\n    };\r\n    return GameObject;\r\n}());\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameObject);\r\n\n\n//# sourceURL=webpack://isominer/./src/gameObject.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.ts\");\n\r\ndocument.addEventListener('DOMContentLoaded', function (event) {\r\n    var game = new _game__WEBPACK_IMPORTED_MODULE_0__[\"default\"]('game-screen');\r\n    game.start();\r\n});\r\n\n\n//# sourceURL=webpack://isominer/./src/main.ts?");

/***/ }),

/***/ "./src/pixel.ts":
/*!**********************!*\
  !*** ./src/pixel.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _gameObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gameObject */ \"./src/gameObject.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        if (typeof b !== \"function\" && b !== null)\r\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\n\r\nvar Pixel = /** @class */ (function (_super) {\r\n    __extends(Pixel, _super);\r\n    function Pixel(id, position, color) {\r\n        if (color === void 0) { color = '0xFFFFFFFF'; }\r\n        var _this = _super.call(this) || this;\r\n        _this.direction = { x: 5, y: 5 };\r\n        _this.velocity = 2;\r\n        _this.linearDrag = 0.03;\r\n        _this.id = id;\r\n        _this.position = position;\r\n        _this.color = parseInt(color, 16);\r\n        _this.linearDrag = Math.random() * 0.02 + 0.01;\r\n        return _this;\r\n    }\r\n    Pixel.prototype.onUpdate = function () {\r\n        console.log(this.id, this.position.x, this.position.y);\r\n    };\r\n    return Pixel;\r\n}(_gameObject__WEBPACK_IMPORTED_MODULE_0__[\"default\"]));\r\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pixel);\r\n\n\n//# sourceURL=webpack://isominer/./src/pixel.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;