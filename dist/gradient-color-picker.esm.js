//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {
	props: ['value'],
	data: function data() {
		return {
			initialColor: '#000000',
			finalColor: '#000000',
			colors: [
				{
					percent: 50,
					color: '#ffffff',
				} ],
			movingColor: null,
			direction: 0,
		};
	},
	watch: {
		value: function value(newValue) {
			this.registerNewValue(newValue);
		},
	},
	computed: {
		allColors: function allColors() {
			var allColors = [];
			allColors.push({ percent: 0, color: this.initialColor });
			allColors = allColors.concat(this.colors);
			allColors.push({ percent: 100, color: this.finalColor });
			return allColors.sort(function (c1, c2) { return c1.percent - c2.percent; });
		},
		gradient: function gradient() {
			var gradient = this.allColors;
			gradient = gradient.map(function (c) { return ((c.color) + " " + (c.percent) + "%"); });
			gradient = gradient.join(', ');
			gradient = "linear-gradient( 90deg, " + gradient + " )";
			return gradient;
		},
		finalGradient: function finalGradient() {
			var gradient = this.allColors;
			gradient = gradient.map(function (c) { return ((c.color) + " " + (c.percent) + "%"); });
			gradient = gradient.join(', ');
			gradient = "linear-gradient( 90deg, " + gradient + " )";
			return gradient;
		},
	},
	methods: {
		addColor: function addColor(event) {
			var rect = this.$refs['gradient-color-picker-input-div'].getBoundingClientRect();
			var x = event.clientX - rect.left; // x position within the element
			var percent = (100 * x) / rect.width;

			this.colors.push({
				percent: percent,
				color: '#000',
			});
		},
		removeColor: function removeColor(index) {
			this.colors.splice(index, 1);
			this.$forceUpdate();
		},
		openColorInput: function openColorInput(event, colorInput) {
			var colorInputStyles = colorInput.style;
			colorInputStyles.left = "calc(" + (event.x) + "px - 5vw)";
			colorInputStyles.top = "calc(" + (event.y) + "px - 5vh)";
			setTimeout(function () { return colorInput.click(event); });
		},
		mousedown: function mousedown(event, color) {
			this.movingColor = color;
			window.addEventListener(
				'mouseup',
				this.mouseup,
				{
					once: true,
				}
			);
			window.addEventListener(
				'mousemove',
				this.mousemove
			);
		},
		mousemove: function mousemove(event) {
			this.colorMove(event, 'input');
		},
		mouseup: function mouseup(event) {
			this.colorMove(event, 'change');
			window.removeEventListener(
				'mousemove',
				this.mousemove
			);
		},
		colorMove: function colorMove(event, eventType) {
			if (this.movingColor) {
				var rect = this.$refs['gradient-color-picker-input-div'].getBoundingClientRect();
				var x = event.clientX - rect.left; // x position within the element
				var percent = (100 * x) / rect.width;
				percent = Math.max(1, Math.min(percent, 99));
				percent = Math.round(percent * 100) / 100;
				this.movingColor.percent = percent;
			}
			switch (eventType) {
			case 'change':
				this.changeValue();
				break;
			case 'input':
				this.inputValue();
				break;
			}
		},
		changeValue: function changeValue() {
			this.$emit('change', this.finalGradient);
		},
		inputValue: function inputValue() {
			this.$emit('input', this.finalGradient);
		},
		registerNewValue: function registerNewValue(newValue) {
			var this$1 = this;
			var ref;

			var value = newValue.trim().replace(/^linear-gradient\(/, '').replace(/\)$/, '');

			var directionPattern = /^((to left|to right|to top|to bottom|[0-9.]+turn|[0-9.]+deg), *)(.*)?/;
			var directionPatternResult = directionPattern.exec(value);
			if (!directionPatternResult) {
				this.direction = 0;
			} else {
				// Remove the direction from the gradient string
				value = value.substring(directionPatternResult[2].length + 1).trim();

				if (directionPatternResult[2].includes('deg')) {
					this.direction = parseFloat(directionPatternResult[2].replace(/[^0-9.]/, ''));
				}
				if (directionPatternResult[2].includes('turn')) {
					this.direction = 360 * parseFloat(directionPatternResult[2].replace(/[^0-9.]/, ''));
				} else {
					var directions = {
						right: 0,
						top: 90,
						left: 180,
						bottom: 270,
					};
					this.direction = directions[directionPatternResult[2].replace('to ', '')] || 0;
				}
			}

			if (!this.direction || Number.isNaN(this.direction)) {
				this.direction = 0;
			}

			var colors = [];
			if (directionPatternResult && directionPatternResult[3]) {
				var colorPattern = /((#[0-9a-fA-F]{3,8}|rgba?\(([0-9.]+(, *)?)*\))\s*([0-9.]+%)?\s*(,\s*)?)/;
				var colorPatternResult;
				var color;
				while (colorPattern.test(value)) {
					colorPatternResult = colorPattern.exec(value);
					color = colorPatternResult[2];

					if (color.includes('rgb')) {
						color = color.replace(', ', ',');
						color = color.replace(/^rgba?\((.*)\)$/, '$1');
						color = color.split(',').map(parseFloat);
						color = (ref = this).rgbToHex.apply(ref, color);
					}
					colors.push({
						color: color,
						percent: colorPatternResult[5] ? parseFloat(colorPatternResult[5].replace(/[^0-9.]/, '')) : null,
					});
					value = value.substr(colorPatternResult[2].length + 2).trim();
				}
				this.colors = colors;
				if (this.colors[0]) {
					if (this.colors[0].percent) {
						this.colors.splice(0, 0, {
							color: this.colors[0].color,
							percent: 0,
						});
					} else {
						this.colors[0].percent = 0;
					}
				}
				if (this.colors[this.colors.length - 1]) {
					if (this.colors[this.colors.length - 1].percent) {
						this.colors.splice(this.colors.length - 1, 0, {
							color: this.colors[this.colors.length - 1].color,
							percent: 100,
						});
					} else {
						this.colors[this.colors.length - 1].percent = 100;
					}
				}
				this.colors.forEach(function (c, index) {
					if (c.percent !== null) {
						var diference;
						var nextPercent;
						var nullPercentsQuantity = 0;

						for (var i = index + 1; i < this$1.colors.length; i += 1) {
							if (this$1.colors[i].percent === null) {
								nullPercentsQuantity += 1;
							} else {
								nextPercent = this$1.colors[i].percent;
								break;
							}
						}

						if (nullPercentsQuantity > 0 && nextPercent) {
							diference = nextPercent - c.percent;
							diference /= nullPercentsQuantity + 1;
							for (var i$1 = 1; i$1 <= nullPercentsQuantity; i$1 += 1) {
								this$1.colors[i$1].percent = c.percent + (diference * (1 + i$1 - nullPercentsQuantity));
							}
						}
					}
				});
				this.colors = this.colors.sort(function (c1, c2) { return c1.percent - c2.percent; });
				this.initialColor = this.colors.shift().color;
				this.finalColor = this.colors.pop().color;
			}

			this.$forceUpdate();
		},

		hexToRgb: function hexToRgb(hex) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			} : null;
		},
		componentToHex: function componentToHex(c) {
			var hex = c.toString(16);
			return hex.length === 1 ? ("0" + hex) : hex;
		},
		rgbToHex: function rgbToHex(r, g, b) {
			return ("#" + (this.componentToHex(r)) + (this.componentToHex(g)) + (this.componentToHex(b)));
		},
	},
	mounted: function mounted() {
		if (this.value) {
			this.registerNewValue(this.value);
		}
	},
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", [
    _c(
      "div",
      { staticClass: "color-inputs" },
      [
        _c("div", { staticClass: "color-input" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.initialColor,
                expression: "initialColor"
              }
            ],
            ref: "initialColorInput",
            attrs: { type: "color" },
            domProps: { value: _vm.initialColor },
            on: {
              change: _vm.changeValue,
              input: [
                function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.initialColor = $event.target.value;
                },
                _vm.inputValue
              ]
            }
          })
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "color-input" }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.finalColor,
                expression: "finalColor"
              }
            ],
            ref: "finalColorInput",
            attrs: { type: "color" },
            domProps: { value: _vm.finalColor },
            on: {
              change: _vm.changeValue,
              input: [
                function($event) {
                  if ($event.target.composing) {
                    return
                  }
                  _vm.finalColor = $event.target.value;
                },
                _vm.inputValue
              ]
            }
          })
        ]),
        _vm._v(" "),
        _vm._l(_vm.colors, function(c, i) {
          return _c("div", { key: i, staticClass: "color-input" }, [
            _c("input", {
              directives: [
                {
                  name: "model",
                  rawName: "v-model",
                  value: _vm.colors[i].color,
                  expression: "colors[i].color"
                }
              ],
              ref: "colorInput",
              refInFor: true,
              attrs: { type: "color" },
              domProps: { value: _vm.colors[i].color },
              on: {
                change: _vm.changeValue,
                input: [
                  function($event) {
                    if ($event.target.composing) {
                      return
                    }
                    _vm.$set(_vm.colors[i], "color", $event.target.value);
                  },
                  _vm.inputValue
                ]
              }
            })
          ])
        })
      ],
      2
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        ref: "gradient-color-picker-input-div",
        staticClass: "gradient-color-picker-input-div",
        style: { background: _vm.gradient },
        on: {
          dblclick: function($event) {
            return _vm.addColor($event)
          }
        }
      },
      [
        _c("span", {
          staticClass: "icon",
          style: { "--color": _vm.initialColor, "--percent": "0%" },
          on: {
            click: function($event) {
              $event.stopPropagation();
              return _vm.openColorInput($event, _vm.$refs["initialColorInput"])
            },
            dblclick: function($event) {
              $event.stopPropagation();
            }
          }
        }),
        _vm._v(" "),
        _vm._l(_vm.colors, function(c, i) {
          return _c("span", {
            key: i,
            staticClass: "icon draggable",
            style: { "--color": c.color, "--percent": c.percent + "%" },
            on: {
              click: function($event) {
                $event.stopPropagation();
                return _vm.openColorInput($event, _vm.$refs["colorInput"][i])
              },
              mousedown: function($event) {
                return _vm.mousedown($event, c)
              },
              dblclick: function($event) {
                $event.stopPropagation();
              },
              contextmenu: function($event) {
                $event.preventDefault();
                return _vm.removeColor(i)
              }
            }
          })
        }),
        _vm._v(" "),
        _c("span", {
          staticClass: "icon",
          style: { "--color": _vm.finalColor, "--percent": "100%" },
          on: {
            click: function($event) {
              $event.stopPropagation();
              return _vm.openColorInput($event, _vm.$refs["finalColorInput"])
            },
            dblclick: function($event) {
              $event.stopPropagation();
            }
          }
        })
      ],
      2
    )
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-68bb0440_0", { source: ".color-inputs .color-input[data-v-68bb0440] {\n  position: absolute;\n  height: 0;\n  width: 0;\n  overflow: hidden;\n}\n.color-inputs input[data-v-68bb0440] {\n  position: absolute;\n}\n.gradient-color-picker-input-div[data-v-68bb0440] {\n  height: 13px;\n  position: relative;\n  border: 1px solid black;\n  margin-bottom: 25px;\n}\n.gradient-color-picker-input-div > span[data-v-68bb0440] {\n  position: absolute;\n  left: var(--percent);\n  bottom: -23px;\n  width: 12px;\n  height: 15px;\n  margin-left: -6px;\n  user-select: none;\n  border: 1px solid gray;\n  background-color: #e3e3e3;\n}\n.gradient-color-picker-input-div > span[data-v-68bb0440]::before, .gradient-color-picker-input-div > span[data-v-68bb0440]::after {\n  content: \"\";\n  position: absolute;\n  pointer-events: none;\n}\n.gradient-color-picker-input-div > span[data-v-68bb0440]::after {\n  background-color: #e3e3e3;\n  border: solid gray;\n  border-width: 0 1px 1px 0;\n  display: inline-block;\n  padding: 2px;\n  top: -4px;\n  left: 2.5px;\n  width: 2px;\n  height: 2px;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  z-index: -1;\n}\n.gradient-color-picker-input-div > span[data-v-68bb0440]::before {\n  top: 2px;\n  bottom: 2px;\n  left: 2px;\n  right: 2px;\n  background-color: var(--color);\n}\n\n/*# sourceMappingURL=gradient-color-picker.vue.map */", map: {"version":3,"sources":["/home/leonardo/Projetos/Pessoal/gradient-color-picker/src/gradient-color-picker.vue","gradient-color-picker.vue"],"names":[],"mappings":"AAwTA;EACA,kBAAA;EACA,SAAA;EACA,QAAA;EACA,gBAAA;ACvTA;ADyTA;EACA,kBAAA;ACvTA;AD0TA;EACA,YAAA;EACA,kBAAA;EACA,uBAAA;EACA,mBAAA;ACvTA;ADyTA;EACA,kBAAA;EACA,oBAAA;EACA,aAAA;EACA,WAAA;EACA,YAAA;EACA,iBAAA;EAEA,iBAAA;EAEA,sBAAA;EACA,yBAAA;ACzTA;AD2TA;EACA,WAAA;EACA,kBAAA;EACA,oBAAA;ACzTA;AD4TA;EACA,yBAAA;EACA,kBAAA;EACA,yBAAA;EACA,qBAAA;EACA,YAAA;EACA,SAAA;EACA,WAAA;EACA,UAAA;EACA,WAAA;EACA,0BAAA;EACA,kCAAA;EACA,WAAA;AC1TA;AD6TA;EACA,QAAA;EACA,WAAA;EACA,SAAA;EACA,UAAA;EACA,8BAAA;AC3TA;;AAEA,oDAAoD","file":"gradient-color-picker.vue","sourcesContent":["<template>\n\t<div>\n\t\t<div class=\"color-inputs\">\n\t\t\t<div class=\"color-input\">\n\t\t\t\t<input\n\t\t\t\t\t\ttype=\"color\"\n\t\t\t\t\t\tv-model=\"initialColor\"\n\t\t\t\t\t\tref=\"initialColorInput\"\n\t\t\t\t\t\t@change=\"changeValue\"\n\t\t\t\t\t\t@input=\"inputValue\"\n\t\t\t\t\t>\n\t\t\t</div>\n\t\t\t<div class=\"color-input\">\n\t\t\t\t<input\n\t\t\t\t\t\ttype=\"color\"\n\t\t\t\t\t\tv-model=\"finalColor\"\n\t\t\t\t\t\tref=\"finalColorInput\"\n\t\t\t\t\t\t@change=\"changeValue\"\n\t\t\t\t\t\t@input=\"inputValue\"\n\t\t\t\t\t>\n\t\t\t</div>\n\t\t\t<div class=\"color-input\" v-for=\"(c, i) of colors\" :key=\"i\">\n\t\t\t\t<input\n\t\t\t\t\t\ttype=\"color\"\n\t\t\t\t\t\tv-model=\"colors[i].color\"\n\t\t\t\t\t\tref=\"colorInput\"\n\t\t\t\t\t\t@change=\"changeValue\"\n\t\t\t\t\t\t@input=\"inputValue\"\n\t\t\t\t\t>\n\t\t\t</div>\n\t\t</div>\n\t\t<div\n\t\t\t\tclass=\"gradient-color-picker-input-div\"\n\t\t\t\tref=\"gradient-color-picker-input-div\"\n\t\t\t\t:style=\"{background: gradient}\"\n\t\t\t\t@dblclick=\"addColor( $event )\"\n\t\t\t>\n\t\t\t<span\n\t\t\t\t\tclass=\"icon\"\n\t\t\t\t\t:style=\"{'--color': initialColor, '--percent': '0%'}\"\n\t\t\t\t\t@click.stop=\"openColorInput( $event, $refs['initialColorInput'] )\"\n\t\t\t\t\t@dblclick.stop=\"\"\n\t\t\t\t>\n\t\t\t</span>\n\t\t\t<span\n\t\t\t\t\tclass=\"icon draggable\"\n\t\t\t\t\tv-for=\"(c, i) of colors\"\n\t\t\t\t\t:key=\"i\"\n\t\t\t\t\t:style=\"{'--color': c.color, '--percent': c.percent+'%'}\"\n\t\t\t\t\t@click.stop=\"openColorInput( $event, $refs['colorInput'][i] )\"\n\t\t\t\t\t@mousedown=\"mousedown( $event, c )\"\n\t\t\t\t\t@dblclick.stop=\"\"\n\t\t\t\t\t@contextmenu.prevent=\"removeColor( i )\"\n\t\t\t\t>\n\t\t\t</span>\n\t\t\t<span\n\t\t\t\t\tclass=\"icon\"\n\t\t\t\t\t:style=\"{'--color': finalColor, '--percent': '100%'}\"\n\t\t\t\t\t@click.stop=\"openColorInput( $event, $refs['finalColorInput'] )\"\n\t\t\t\t\t@dblclick.stop=\"\"\n\t\t\t\t>\n\t\t\t</span>\n\t\t</div>\n\t</div>\n</template>\n\n<script>\nexport default {\n\tprops: ['value'],\n\tdata() {\n\t\treturn {\n\t\t\tinitialColor: '#000000',\n\t\t\tfinalColor: '#000000',\n\t\t\tcolors: [\n\t\t\t\t{\n\t\t\t\t\tpercent: 50,\n\t\t\t\t\tcolor: '#ffffff',\n\t\t\t\t},\n\t\t\t],\n\t\t\tmovingColor: null,\n\t\t\tdirection: 0,\n\t\t};\n\t},\n\twatch: {\n\t\tvalue(newValue) {\n\t\t\tthis.registerNewValue(newValue);\n\t\t},\n\t},\n\tcomputed: {\n\t\tallColors() {\n\t\t\tlet allColors = [];\n\t\t\tallColors.push({ percent: 0, color: this.initialColor });\n\t\t\tallColors = allColors.concat(this.colors);\n\t\t\tallColors.push({ percent: 100, color: this.finalColor });\n\t\t\treturn allColors.sort((c1, c2) => c1.percent - c2.percent);\n\t\t},\n\t\tgradient() {\n\t\t\tlet gradient = this.allColors;\n\t\t\tgradient = gradient.map((c) => `${c.color} ${c.percent}%`);\n\t\t\tgradient = gradient.join(', ');\n\t\t\tgradient = `linear-gradient( 90deg, ${gradient} )`;\n\t\t\treturn gradient;\n\t\t},\n\t\tfinalGradient() {\n\t\t\tlet gradient = this.allColors;\n\t\t\tgradient = gradient.map((c) => `${c.color} ${c.percent}%`);\n\t\t\tgradient = gradient.join(', ');\n\t\t\tgradient = `linear-gradient( 90deg, ${gradient} )`;\n\t\t\treturn gradient;\n\t\t},\n\t},\n\tmethods: {\n\t\taddColor(event) {\n\t\t\tconst rect = this.$refs['gradient-color-picker-input-div'].getBoundingClientRect();\n\t\t\tconst x = event.clientX - rect.left; // x position within the element\n\t\t\tconst percent = (100 * x) / rect.width;\n\n\t\t\tthis.colors.push({\n\t\t\t\tpercent,\n\t\t\t\tcolor: '#000',\n\t\t\t});\n\t\t},\n\t\tremoveColor(index) {\n\t\t\tthis.colors.splice(index, 1);\n\t\t\tthis.$forceUpdate();\n\t\t},\n\t\topenColorInput(event, colorInput) {\n\t\t\tconst colorInputStyles = colorInput.style;\n\t\t\tcolorInputStyles.left = `calc(${event.x}px - 5vw)`;\n\t\t\tcolorInputStyles.top = `calc(${event.y}px - 5vh)`;\n\t\t\tsetTimeout(() => colorInput.click(event));\n\t\t},\n\t\tmousedown(event, color) {\n\t\t\tthis.movingColor = color;\n\t\t\twindow.addEventListener(\n\t\t\t\t'mouseup',\n\t\t\t\tthis.mouseup,\n\t\t\t\t{\n\t\t\t\t\tonce: true,\n\t\t\t\t},\n\t\t\t);\n\t\t\twindow.addEventListener(\n\t\t\t\t'mousemove',\n\t\t\t\tthis.mousemove,\n\t\t\t);\n\t\t},\n\t\tmousemove(event) {\n\t\t\tthis.colorMove(event, 'input');\n\t\t},\n\t\tmouseup(event) {\n\t\t\tthis.colorMove(event, 'change');\n\t\t\twindow.removeEventListener(\n\t\t\t\t'mousemove',\n\t\t\t\tthis.mousemove,\n\t\t\t);\n\t\t},\n\t\tcolorMove(event, eventType) {\n\t\t\tif (this.movingColor) {\n\t\t\t\tconst rect = this.$refs['gradient-color-picker-input-div'].getBoundingClientRect();\n\t\t\t\tconst x = event.clientX - rect.left; // x position within the element\n\t\t\t\tlet percent = (100 * x) / rect.width;\n\t\t\t\tpercent = Math.max(1, Math.min(percent, 99));\n\t\t\t\tpercent = Math.round(percent * 100) / 100;\n\t\t\t\tthis.movingColor.percent = percent;\n\t\t\t}\n\t\t\tswitch (eventType) {\n\t\t\tcase 'change':\n\t\t\t\tthis.changeValue();\n\t\t\t\tbreak;\n\t\t\tcase 'input':\n\t\t\t\tthis.inputValue();\n\t\t\t\tbreak;\n\t\t\tdefault:\n\t\t\t}\n\t\t},\n\t\tchangeValue() {\n\t\t\tthis.$emit('change', this.finalGradient);\n\t\t},\n\t\tinputValue() {\n\t\t\tthis.$emit('input', this.finalGradient);\n\t\t},\n\t\tregisterNewValue(newValue) {\n\t\t\tlet value = newValue.trim().replace(/^linear-gradient\\(/, '').replace(/\\)$/, '');\n\n\t\t\tconst directionPattern = /^((to left|to right|to top|to bottom|[0-9.]+turn|[0-9.]+deg), *)(.*)?/;\n\t\t\tconst directionPatternResult = directionPattern.exec(value);\n\t\t\tif (!directionPatternResult) {\n\t\t\t\tthis.direction = 0;\n\t\t\t} else {\n\t\t\t\t// Remove the direction from the gradient string\n\t\t\t\tvalue = value.substring(directionPatternResult[2].length + 1).trim();\n\n\t\t\t\tif (directionPatternResult[2].includes('deg')) {\n\t\t\t\t\tthis.direction = parseFloat(directionPatternResult[2].replace(/[^0-9.]/, ''));\n\t\t\t\t}\n\t\t\t\tif (directionPatternResult[2].includes('turn')) {\n\t\t\t\t\tthis.direction = 360 * parseFloat(directionPatternResult[2].replace(/[^0-9.]/, ''));\n\t\t\t\t} else {\n\t\t\t\t\tconst directions = {\n\t\t\t\t\t\tright: 0,\n\t\t\t\t\t\ttop: 90,\n\t\t\t\t\t\tleft: 180,\n\t\t\t\t\t\tbottom: 270,\n\t\t\t\t\t};\n\t\t\t\t\tthis.direction = directions[directionPatternResult[2].replace('to ', '')] || 0;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (!this.direction || Number.isNaN(this.direction)) {\n\t\t\t\tthis.direction = 0;\n\t\t\t}\n\n\t\t\tconst colors = [];\n\t\t\tif (directionPatternResult && directionPatternResult[3]) {\n\t\t\t\tconst colorPattern = /((#[0-9a-fA-F]{3,8}|rgba?\\(([0-9.]+(, *)?)*\\))\\s*([0-9.]+%)?\\s*(,\\s*)?)/;\n\t\t\t\tlet colorPatternResult;\n\t\t\t\tlet color;\n\t\t\t\twhile (colorPattern.test(value)) {\n\t\t\t\t\tcolorPatternResult = colorPattern.exec(value);\n\t\t\t\t\tcolor = colorPatternResult[2];\n\n\t\t\t\t\tif (color.includes('rgb')) {\n\t\t\t\t\t\tcolor = color.replace(', ', ',');\n\t\t\t\t\t\tcolor = color.replace(/^rgba?\\((.*)\\)$/, '$1');\n\t\t\t\t\t\tcolor = color.split(',').map(parseFloat);\n\t\t\t\t\t\tcolor = this.rgbToHex(...color);\n\t\t\t\t\t}\n\t\t\t\t\tcolors.push({\n\t\t\t\t\t\tcolor,\n\t\t\t\t\t\tpercent: colorPatternResult[5] ? parseFloat(colorPatternResult[5].replace(/[^0-9.]/, '')) : null,\n\t\t\t\t\t});\n\t\t\t\t\tvalue = value.substr(colorPatternResult[2].length + 2).trim();\n\t\t\t\t}\n\t\t\t\tthis.colors = colors;\n\t\t\t\tif (this.colors[0]) {\n\t\t\t\t\tif (this.colors[0].percent) {\n\t\t\t\t\t\tthis.colors.splice(0, 0, {\n\t\t\t\t\t\t\tcolor: this.colors[0].color,\n\t\t\t\t\t\t\tpercent: 0,\n\t\t\t\t\t\t});\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthis.colors[0].percent = 0;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tif (this.colors[this.colors.length - 1]) {\n\t\t\t\t\tif (this.colors[this.colors.length - 1].percent) {\n\t\t\t\t\t\tthis.colors.splice(this.colors.length - 1, 0, {\n\t\t\t\t\t\t\tcolor: this.colors[this.colors.length - 1].color,\n\t\t\t\t\t\t\tpercent: 100,\n\t\t\t\t\t\t});\n\t\t\t\t\t} else {\n\t\t\t\t\t\tthis.colors[this.colors.length - 1].percent = 100;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tthis.colors.forEach((c, index) => {\n\t\t\t\t\tif (c.percent !== null) {\n\t\t\t\t\t\tlet diference;\n\t\t\t\t\t\tlet nextPercent;\n\t\t\t\t\t\tlet nullPercentsQuantity = 0;\n\n\t\t\t\t\t\tfor (let i = index + 1; i < this.colors.length; i += 1) {\n\t\t\t\t\t\t\tif (this.colors[i].percent === null) {\n\t\t\t\t\t\t\t\tnullPercentsQuantity += 1;\n\t\t\t\t\t\t\t} else {\n\t\t\t\t\t\t\t\tnextPercent = this.colors[i].percent;\n\t\t\t\t\t\t\t\tbreak;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\tif (nullPercentsQuantity > 0 && nextPercent) {\n\t\t\t\t\t\t\tdiference = nextPercent - c.percent;\n\t\t\t\t\t\t\tdiference /= nullPercentsQuantity + 1;\n\t\t\t\t\t\t\tfor (let i = 1; i <= nullPercentsQuantity; i += 1) {\n\t\t\t\t\t\t\t\tthis.colors[i].percent = c.percent + (diference * (1 + i - nullPercentsQuantity));\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t});\n\t\t\t\tthis.colors = this.colors.sort((c1, c2) => c1.percent - c2.percent);\n\t\t\t\tthis.initialColor = this.colors.shift().color;\n\t\t\t\tthis.finalColor = this.colors.pop().color;\n\t\t\t}\n\n\t\t\tthis.$forceUpdate();\n\t\t},\n\n\t\thexToRgb(hex) {\n\t\t\tconst result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);\n\t\t\treturn result ? {\n\t\t\t\tr: parseInt(result[1], 16),\n\t\t\t\tg: parseInt(result[2], 16),\n\t\t\t\tb: parseInt(result[3], 16),\n\t\t\t} : null;\n\t\t},\n\t\tcomponentToHex(c) {\n\t\t\tconst hex = c.toString(16);\n\t\t\treturn hex.length === 1 ? `0${hex}` : hex;\n\t\t},\n\t\trgbToHex(r, g, b) {\n\t\t\treturn `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;\n\t\t},\n\t},\n\tmounted() {\n\t\tif (this.value) {\n\t\t\tthis.registerNewValue(this.value);\n\t\t}\n\t},\n};\n</script>\n\n<style lang=\"scss\" scoped>\n.color-inputs {\n\t.color-input {\n\t\tposition: absolute;\n\t\theight: 0;\n\t\twidth: 0;\n\t\toverflow: hidden;\n\t}\n\tinput {\n\t\tposition: absolute;\n\t}\n}\n.gradient-color-picker-input-div {\n\theight: 13px;\n\tposition: relative;\n\tborder: 1px solid black;\n\tmargin-bottom: 25px;\n\n\t> span {\n\t\tposition: absolute;\n\t\tleft: var(--percent);\n\t\tbottom: -23px;\n\t\twidth: 12px;\n\t\theight: 15px;\n\t\tmargin-left: -6px;\n\n\t\tuser-select: none;\n\n\t\tborder: 1px solid gray;\n\t\tbackground-color: #e3e3e3;\n\n\t\t&::before, &::after {\n\t\t\tcontent: \"\";\n\t\t\tposition: absolute;\n\t\t\tpointer-events: none;\n\t\t}\n\n\t\t&::after {\n\t\t\tbackground-color: #e3e3e3;\n\t\t\tborder: solid gray;\n\t\t\tborder-width: 0 1px 1px 0;\n\t\t\tdisplay: inline-block;\n\t\t\tpadding: 2px;\n\t\t\ttop: -4px;\n\t\t\tleft: 2.5px;\n\t\t\twidth: 2px;\n\t\t\theight: 2px;\n\t\t\ttransform: rotate(-135deg);\n\t\t\t-webkit-transform: rotate(-135deg);\n\t\t\tz-index: -1;\n\t\t}\n\n\t\t&::before {\n\t\t\ttop: 2px;\n\t\t\tbottom: 2px;\n\t\t\tleft: 2px;\n\t\t\tright: 2px;\n\t\t\tbackground-color: var(--color);\n\t\t}\n\t}\n}\n</style>\n",".color-inputs .color-input {\n  position: absolute;\n  height: 0;\n  width: 0;\n  overflow: hidden;\n}\n.color-inputs input {\n  position: absolute;\n}\n\n.gradient-color-picker-input-div {\n  height: 13px;\n  position: relative;\n  border: 1px solid black;\n  margin-bottom: 25px;\n}\n.gradient-color-picker-input-div > span {\n  position: absolute;\n  left: var(--percent);\n  bottom: -23px;\n  width: 12px;\n  height: 15px;\n  margin-left: -6px;\n  user-select: none;\n  border: 1px solid gray;\n  background-color: #e3e3e3;\n}\n.gradient-color-picker-input-div > span::before, .gradient-color-picker-input-div > span::after {\n  content: \"\";\n  position: absolute;\n  pointer-events: none;\n}\n.gradient-color-picker-input-div > span::after {\n  background-color: #e3e3e3;\n  border: solid gray;\n  border-width: 0 1px 1px 0;\n  display: inline-block;\n  padding: 2px;\n  top: -4px;\n  left: 2.5px;\n  width: 2px;\n  height: 2px;\n  transform: rotate(-135deg);\n  -webkit-transform: rotate(-135deg);\n  z-index: -1;\n}\n.gradient-color-picker-input-div > span::before {\n  top: 2px;\n  bottom: 2px;\n  left: 2px;\n  right: 2px;\n  background-color: var(--color);\n}\n\n/*# sourceMappingURL=gradient-color-picker.vue.map */"]}, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-68bb0440";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = /*#__PURE__*/normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

// Import vue component

// Declare install function executed by Vue.use()
function install(Vue) {
	if (install.installed) { return; }
	install.installed = true;
	Vue.component('GradientColorPicker', __vue_component__);
}

// Create module definition for Vue.use()
var plugin = {
	install: install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
var GlobalVue = null;
if (typeof window !== 'undefined') {
	GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
	GlobalVue = global.Vue;
}
if (GlobalVue) {
	GlobalVue.use(plugin);
}

export default __vue_component__;
export { install };
