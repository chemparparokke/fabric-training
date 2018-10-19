/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/controls.js":
/*!****************************!*\
  !*** ./src/js/controls.js ***!
  \****************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _fonts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fonts */ \"./src/js/fonts.js\");\n\n\nconst ObjInfo = class {\n    constructor() {\n        this.detailsContainer = document.getElementById(\"objDetails\");\n    }\n\n    showObjInfo(obj) {\n        const str = JSON.stringify(obj, null, 4);\n        const formattedStr = this.formatText(str);\n\n        this.detailsContainer.innerText = formattedStr;\n    };\n\n    formatText(JSONString) {\n        const propValRegex = /\".+\":\\s.+/gm;\n        const quoteRegex = /\"/g;\n        const objData = {};\n        let m;\n\n        while ((m = propValRegex.exec(JSONString)) !== null) {\n            // This is necessary to avoid infinite loops with zero-width matches\n            if (m.index === propValRegex.lastIndex) {\n                propValRegex.lastIndex++;\n            }\n\n            m.forEach((match) => {\n                const d = match.split(':');\n\n                objData[d[0].replace(quoteRegex, '')] = {\n                    value: d[1].replace(/\\s+/, ''),\n                    type: quoteRegex.test(d[1]) ? 'text' : 'specific',\n                };\n            });\n        }\n\n        const str = Object.keys(objData).sort().map((key) => `    \"${key}\": ${objData[key].value}`);\n\n        return `\n{\\n${str.join('\\n')}\\n}`\n    }\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (class {\n    constructor(canvasEl = null) {\n        this.canvasEl = canvasEl;\n\n        this.controls = document.querySelectorAll('[data-control]');\n        this.controlInputs = document.querySelectorAll('[data-control-input]');\n        this.controlButtons = document.querySelectorAll('[data-control-button]');\n\n        this.pathFromButton = document.getElementById('pathFromButton');\n        this.deleteButton = document.getElementById('deleteButton');\n\n        this.infoProvider = new ObjInfo();\n    }\n\n    init() {\n        this.controlButtons.length && this.controlButtons.forEach((controlButton) => {\n            controlButton.onclick = () => {\n                const obj = this.canvasEl.getActiveObject();\n                const relatedControlInput = controlButton.parentElement.querySelector('[data-control-input]');\n\n                if (!relatedControlInput) {\n                    return void(0);\n                }\n\n                let newValue = {};\n\n                newValue[relatedControlInput.dataset.controlInput] = relatedControlInput.value;\n                obj.set(newValue);\n\n                this.canvasEl.renderAll();\n            }\n        });\n\n        this.controlInputs && this.controlInputs.forEach((controlInput) => {\n            controlInput.oninput = (e) => {\n                const obj = this.canvasEl.getActiveObject();\n                let newValue = {};\n\n                newValue[controlInput.dataset.controlInput] = controlInput.value;\n                obj.set(newValue);\n\n                this.canvasEl.renderAll();\n            }\n        });\n\n        if (this.deleteButton) {\n            this.deleteButton.onclick = () => {\n                const obj = this.canvasEl.getActiveObject();\n\n                obj.remove();\n                this.canvasEl.renderAll();\n            }\n        }\n    }\n\n    activateControls() {\n        this.controls.forEach((control) => {\n            control.removeAttribute(\"disabled\");\n        });\n    };\n\n    deactivateControls() {\n        this.controls.forEach((control) => {\n            control.setAttribute(\"disabled\", true);\n        });\n    };\n\n    setControlsValues() {\n        const obj = this.canvasEl.getActiveObject();\n\n        this.controlInputs.forEach((controlInput) => {\n            const newVal = obj[controlInput.dataset.controlInput];\n\n            if (newVal) {\n                controlInput.value = newVal;\n            } else {\n                controlInput.value = '';\n                controlInput.setAttribute('disabled', true);\n            }\n\n        });\n    };\n\n    addSelectionListeners(obj) {\n        obj.on('selected', () => {\n            console.log('obj: ', obj);\n            this.activateControls();\n            this.setControlsValues();\n            this.infoProvider.showObjInfo(obj);\n        });\n\n        obj.on('modified', () => {\n            this.setControlsValues();\n            this.infoProvider.showObjInfo(obj);\n        });\n    }\n\n    static scaleUpX2(obj) {\n        obj.set({\n            scaleX: obj.scaleX * 2,\n            scaleY: obj.scaleY * 2\n        });\n    };\n\n    static scaleDownX2(obj) {\n        obj.set({\n            scaleX: obj.scaleX / 2,\n            scaleY: obj.scaleY / 2\n        });\n    };\n});\n\nconst scaleDownButton = document.getElementById(\"scaleDownButton\");\nconst scaleUpButton = document.getElementById(\"scaleUpButton\");\nconst rotateButton = document.getElementById(\"rotateButton\");\n\nconst setFontSizeButton = document.getElementById(\"setFontSizeButton\");\nconst objFontSize = document.getElementById(\"objFontSize\");\n\nconst setLeftButton = document.getElementById(\"setLeftButton\");\nconst objLeft = document.getElementById(\"objLeft\");\n\n\n//# sourceURL=webpack:///./src/js/controls.js?");

/***/ }),

/***/ "./src/js/fonts.js":
/*!*************************!*\
  !*** ./src/js/fonts.js ***!
  \*************************/
/*! exports provided: fonts, getGoogleFont, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"fonts\", function() { return fonts; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getGoogleFont\", function() { return getGoogleFont; });\nconst GOOGLE_FONTS_API_KEY = \"AIzaSyBtg2AjiSKGRM_hnZpiWbOu4khyKdbrVZ8\";\n\nconst fonts = [];\nconst getGoogleFont = async (fontName = '') => {\n    return new Promise((resolve) => {\n        fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}`)\n            .then((res) => res.json())\n            .then((fonts) => {\n                if (fonts.error && fonts.error.code === 403) {\n                    console.error(\n                        `Can\\'t fetch google fonts via developers api:\\n${\n                            fonts.error.message\n                            }\\n\\nDefault fonts will be used`\n                    );\n\n                    resolve({error: true});\n                }\n\n                const [font] = fonts.items.filter(font => {\n                    return font.family === fontName;\n                });\n\n                resolve(font);\n            })\n            .catch((e) => {\n                console.error(`Can\\'t fetch google fonts via developers api.\\n\\nDefault fonts will be used.`, e);\n                resolve({error: true});\n            });\n    });\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (new class {\n    loadFont(gFont) {\n        return new Promise((resolve, reject) => {\n            let fontLink = gFont.files.regular || gFont.files[gFont.variants[0]];\n\n            fontLink = fontLink.replace(/^http:/, \"https:/\");\n\n            opentype.Font.prototype.getMultiLinePath = function (text, x, y, fontSize, options = {}) {\n                const fullPath = new opentype.Path();\n                const regex = /\\r?\\n/gm;\n\n                const fontSizeFraction = options.fontSizeFraction || 0;\n                const heightOfLine = options.heightOfLine || 0;\n                const lineHeight = options.lineHeight || 1;\n\n                const multiLineText = regex.test(text);\n                const textLines = multiLineText ? text.split(regex) : [text];\n                const maxHeight = heightOfLine / lineHeight;\n\n                let lineHeights = 0;\n\n                y -= fontSize * fontSizeFraction;\n\n                for (const textLine of textLines) {\n                    const pathPart = this.getPath(textLine, x, y + lineHeights + maxHeight, fontSize);\n\n                    fullPath.extend(pathPart);\n                    lineHeights += heightOfLine;\n                }\n\n                return fullPath;\n            };\n\n            opentype.load(fontLink, (err, fontData) => {\n                if (err) {\n                    return reject(err);\n                }\n\n                const hasIncorrectLayoutTables =\n                    typeof fontData.tables.gsub !== \"undefined\" &&\n                    typeof fontData.tables.gsub.scripts === \"undefined\";\n\n                if (!hasIncorrectLayoutTables) {\n                    fontData.fontName = gFont.family;\n                    fontData.fontShortName = gFont.family.replace(/\\s/g, \"\");\n\n                    fonts[`${gFont.family.replace(/\\s/g, \"\")}`] = fontData;\n                }\n\n                CanvasRenderingContext2D.prototype.getFontSize = function () {\n                    // CanvasRenderingContext2D.font looks like `68px AstaSansLightA1`\n                    return 1 * this.font.match(/\\d+/)[0];\n                };\n\n                CanvasRenderingContext2D.prototype.getFontFamily = function () {\n                    return this.font.split(\" \")[1];\n                };\n\n                CanvasRenderingContext2D.prototype.measureText = function (text) {\n                    let width = 0;\n                    const font = fonts[this.getFontFamily()];\n\n                    if (!font) {\n                        console.error(\"Cannot find font\", this.getFontFamily(), fonts);\n                        return;\n                    }\n\n                    font.forEachGlyph(text + \" \", 0, 0, this.getFontSize(), {}, (glyph, x, y) => {\n                            width = x;\n                        }\n                    );\n\n                    return {\n                        width\n                    };\n                };\n\n                CanvasRenderingContext2D.prototype.fillText = function (text, x, y) {\n                    const width = this.measureText(text).width;\n                    const offsetFactor = {\n                        start: 0,\n                        left: 0,\n                        center: 0.5,\n                        right: 1\n                    };\n                    const font = fonts[this.getFontFamily()];\n                    const path = font.getPath(\n                        text + \" \",\n                        x - width * offsetFactor[this.textAlign],\n                        y,\n                        this.getFontSize()\n                    );\n\n                    path.fill = this.fillStyle;\n                    path.draw(this);\n                };\n\n                resolve();\n            });\n        })\n    }\n\n    getTextPath(textObj) {\n        let openTypeFont;\n\n        try {\n            openTypeFont = fonts[textObj.fontFamily];\n        } catch (e) {\n            console.warn(`OpenType instance of ${textObj.fontFamily} font wasn't found.`);\n            return void(0);\n        }\n\n        if (!openTypeFont) {\n            return void(0);\n        }\n\n        console.log('openTypeFont: ', openTypeFont);\n\n        const textParams = {\n            fontSizeFraction: textObj._fontSizeFraction,\n            heightOfLine: textObj._getHeightOfLine() * textObj.scaleX,\n            // heightOfLine: textObj._getHeightOfLine(),\n            lineHeight: textObj.lineHeight,\n        };\n\n        return openTypeFont.getMultiLinePath(textObj.text, textObj.left, textObj.top, textObj.fontSize * textObj.scaleX, textParams);\n        // return openTypeFont.getMultiLinePath(textObj.text, 0, 0, textObj.fontSize, textParams);\n    }\n});\n\n\n//# sourceURL=webpack:///./src/js/fonts.js?");

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controls */ \"./src/js/controls.js\");\n/* harmony import */ var _fonts__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fonts */ \"./src/js/fonts.js\");\n/* harmony import */ var _less_main_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../less/main.less */ \"./src/less/main.less\");\n/* harmony import */ var _less_main_less__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_less_main_less__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\nconst CANVAS_WRAPPER_SELECTOR = \"test_canvas\";\n\nconst FONT_FAMILY = \"Andika\";\nconst FONT_SIZE = 32;\n\nconst canvas = new fabric.Canvas(CANVAS_WRAPPER_SELECTOR);\nconst canvasControls = new _controls__WEBPACK_IMPORTED_MODULE_0__[\"default\"](canvas);\n\nconst initFabricFixes = () => {\n    fabric.util.object.extend(fabric.Text.prototype, {\n        _fontSizeMult: 1,\n        _getTextHeight: function() {\n            return this._getHeightOfSingleLine() + (this._textLines.length - 1) * this._getHeightOfLine();\n        },\n        _getHeightOfLine: function() {\n            return this._getHeightOfSingleLine() * this.lineHeight;\n        },\n        _getHeightOfSingleLine: function() {\n            return this.fontSize * this._fontSizeMult;\n        },\n    });\n};\n\n(async () => {\n    const font = await Object(_fonts__WEBPACK_IMPORTED_MODULE_1__[\"getGoogleFont\"])(FONT_FAMILY);\n    await _fonts__WEBPACK_IMPORTED_MODULE_1__[\"default\"].loadFont(font);\n\n    canvasControls.init();\n    initFabricFixes();\n\n    canvas.on('object:added', (e) => {\n        canvasControls.addSelectionListeners(e.target);\n    });\n\n    document.addEventListener('keypress', (e) => {\n        const obj = canvas.getActiveObject();\n        const removeObj = obj && e.code === 'Delete';\n\n        removeObj && obj.remove();\n    });\n\n    if (canvasControls.pathFromButton) {\n        canvasControls.pathFromButton.onclick = () => {\n            const obj = canvas.getActiveObject();\n            const path = _fonts__WEBPACK_IMPORTED_MODULE_1__[\"default\"].getTextPath(obj);\n            const fabricPath = new fabric.Path(path.toPathData(6));\n\n            fabricPath.set({\n                angle: obj.angle,\n                fill: '#000',\n                originX: obj.originX,\n                originY: obj.originY,\n                selectable: obj.selectable,\n            });\n\n            // fabricPath.set({\n            //     width: obj.width,\n            //     height: obj.height,\n            // });\n\n            fabricPath.set({\n                left: obj.left,\n                top: obj.top,\n            });\n\n            // fabricPath.set({\n            //     originalScale: obj.originalScale,\n            //     scaleX: obj.scaleX,\n            //     scaleY: obj.scaleY,\n            // });\n\n            canvas.add(fabricPath);\n            canvas.renderAll();\n        }\n    }\n\n    const text1 = new fabric.Text(\"text\\n\\nsdf\\n  sda\", {\n        fontSize: FONT_SIZE,\n        fill: \"#00f\",\n        lineHeight: 1,\n        fontFamily: FONT_FAMILY,\n        fontWeight: \"normal\",\n        left: 256,\n        originX: \"center\",\n        originY: \"center\",\n        // textBackgroundColor: '#ffff00',\n        top: 256,\n    });\n    // const text2 = fabric.util.object.clone(text1);\n    //\n    // text2.set({\n    //     fill: \"#f00\",\n    //     fontSize: text1.fontSize * 2\n    // });\n\n    canvas.add(text1);\n    // canvas.add(text2);\n\n    canvas.on(\"selection:cleared\", () => {\n        canvasControls.deactivateControls();\n    });\n})();\n\n\n//# sourceURL=webpack:///./src/js/index.js?");

/***/ }),

/***/ "./src/less/main.less":
/*!****************************!*\
  !*** ./src/less/main.less ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/less/main.less?");

/***/ })

/******/ });