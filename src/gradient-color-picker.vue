<template lang="html">
	<div>
		<div class="color-inputs">
			<div class="color-input">
				<input type="color" v-model="initialColor" ref="initialColorInput">
			</div>
			<div class="color-input">
				<input type="color" v-model="finalColor" ref="finalColorInput">
			</div>
			<div class="color-input" v-for="(c, i) of colors" :key="i">
				<input type="color" v-model="colors[i].color" ref="colorInput">
			</div>
		</div>
		<div
				class="gradient-color-picker-input-div"
				ref="gradient-color-picker-input-div"
				:style="{background: gradient}"
				@dblclick="addColor( $event )"
			>
			<span
					class="icon"
					:style="{'--color': initialColor, '--percent': '0%'}"
					@click.stop="openColorInput( $event, $refs['initialColorInput'] )"
					@dblclick.stop=""
				>
			</span>
			<span
					class="icon draggable"
					v-for="(c, i) of colors"
					:key="i"
					:style="{'--color': c.color, '--percent': c.percent+'%'}"
					@click.stop="openColorInput( $event, $refs['colorInput'][i] )"
					@mousedown="mousedown( $event, c )"
					@dblclick.stop=""
					@contextmenu.prevent="removeColor( i )"
				>
			</span>
			<span
					class="icon"
					:style="{'--color': finalColor, '--percent': '100%'}"
					@click.stop="openColorInput( $event, $refs['finalColorInput'] )"
					@dblclick.stop=""
				>
			</span>
		</div>
	</div>
</template>

<script>
export default {
	props: ['value'],
	data() {
		return {
			initialColor: '#000000',
			finalColor: '#000000',
			colors: [
				{
					percent: 50,
					color: '#ffffff',
				},
			],
			movingColor: null,
			direction: 0,
		};
	},
	watch: {
		value(newValue) {
			this.registerNewValue(newValue);
		},
	},
	computed: {
		allColors() {
			let allColors = [];
			allColors.push({ percent: 0, color: this.initialColor });
			allColors = allColors.concat(this.colors);
			allColors.push({ percent: 100, color: this.finalColor });
			return allColors.sort((c1, c2) => c1.percent - c2.percent);
		},
		gradient() {
			let gradient = this.allColors;
			gradient = gradient.map((c) => `${c.color} ${c.percent}%`);
			gradient = gradient.join(', ');
			gradient = `linear-gradient( 90deg, ${gradient} )`;
			return gradient;
		},
	},
	methods: {
		addColor(event) {
			const rect = this.$refs['gradient-color-picker-input-div'].getBoundingClientRect();
			const x = event.clientX - rect.left; // x position within the element
			const percent = (100 * x) / rect.width;

			this.colors.push({
				percent,
				color: '#000',
			});
		},
		removeColor(index) {
			this.colors.splice(index, 1);
			this.$forceUpdate();
		},
		openColorInput(event, colorInput) {
			const colorInputStyles = colorInput.style;
			colorInputStyles.left = `calc(${event.x}px - 5vw)`;
			colorInputStyles.top = `calc(${event.y}px - 5vh)`;
			setTimeout(() => colorInput.click(event));
		},
		mousedown(event, color) {
			this.movingColor = color;
			window.addEventListener(
				'mouseup',
				this.mouseup,
				{
					once: true,
				},
			);
			window.addEventListener(
				'mousemove',
				this.mousemove,
			);
		},
		mousemove(event) {
			this.colorMove(event);
		},
		mouseup(event) {
			this.colorMove(event);
			window.removeEventListener(
				'mousemove',
				this.mousemove,
			);
		},
		colorMove(event) {
			if (this.movingColor) {
				const rect = this.$refs['gradient-color-picker-input-div'].getBoundingClientRect();
				const x = event.clientX - rect.left; // x position within the element
				const percent = (100 * x) / rect.width;
				this.movingColor.percent = Math.max(1, Math.min(percent, 99));
			}
		},
		registerNewValue(newValue) {
			let value = newValue.trim().replace(/^linear-gradient\(/, '').replace(/\)$/, '');

			const directionPattern = /^((to left|to right|to top|to bottom|[0-9.]+turn|[0-9.]+deg), *)(.*)?/;
			const directionPatternResult = directionPattern.exec(value);
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
					const directions = {
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

			const colors = [];
			if (directionPatternResult && directionPatternResult[3]) {
				const colorPattern = /((#[0-9a-fA-F]{3,8}|rgba?\(([0-9.]+(, *)?)*\))\s*([0-9.]+%)?\s*(,\s*)?)/;
				let colorPatternResult;
				let color;
				while (colorPattern.test(value)) {
					colorPatternResult = colorPattern.exec(value);
					color = colorPatternResult[2];

					if (color.includes('rgb')) {
						color = color.replace(', ', ',');
						color = color.replace(/^rgba?\((.*)\)$/, '$1');
						color = color.split(',').map(parseFloat);
						color = this.rgbToHex(...color);
					}
					colors.push({
						color,
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
				this.colors.forEach((c, index) => {
					if (c.percent !== null) {
						let diference;
						let nextPercent;
						let nullPercentsQuantity = 0;

						for (let i = index + 1; i < this.colors.length; i += 1) {
							if (this.colors[i].percent === null) {
								nullPercentsQuantity += 1;
							} else {
								nextPercent = this.colors[i].percent;
								break;
							}
						}

						if (nullPercentsQuantity > 0 && nextPercent) {
							diference = nextPercent - c.percent;
							diference /= nullPercentsQuantity + 1;
							for (let i = 1; i <= nullPercentsQuantity; i += 1) {
								this.colors[i].percent = c.percent + (diference * (1 + i - nullPercentsQuantity));
							}
						}
					}
				});
				this.colors = this.colors.sort((c1, c2) => c1.percent - c2.percent);
				this.initialColor = this.colors.shift().color;
				this.finalColor = this.colors.pop().color;
			}

			this.$forceUpdate();
		},

		hexToRgb(hex) {
			const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
			return result ? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16),
			} : null;
		},
		componentToHex(c) {
			const hex = c.toString(16);
			return hex.length === 1 ? `0${hex}` : hex;
		},
		rgbToHex(r, g, b) {
			return `#${this.componentToHex(r)}${this.componentToHex(g)}${this.componentToHex(b)}`;
		},
	},
	mounted() {
		if (this.value) {
			this.registerNewValue(this.value);
		}
	},
};
</script>

<style lang="scss" scoped>
.color-inputs {
	.color-input {
		position: absolute;
		height: 0;
		width: 0;
		overflow: hidden;
	}
	input {
		position: absolute;
	}
}
.gradient-color-picker-input-div {
	height: 13px;
	position: relative;
	border: 1px solid black;
	margin-bottom: 25px;

	> span {
		position: absolute;
		left: var(--percent);
		bottom: -23px;
		width: 12px;
		height: 15px;
		margin-left: -6px;

		user-select: none;

		border: 1px solid gray;
		background-color: #e3e3e3;

		&::before, &::after {
			content: "";
			position: absolute;
			pointer-events: none;
		}

		&::after {
			background-color: #e3e3e3;
			border: solid gray;
			border-width: 0 1px 1px 0;
			display: inline-block;
			padding: 2px;
			top: -4px;
			left: 2.5px;
			width: 2px;
			height: 2px;
			transform: rotate(-135deg);
			-webkit-transform: rotate(-135deg);
			z-index: -1;
		}

		&::before {
			top: 2px;
			bottom: 2px;
			left: 2px;
			right: 2px;
			background-color: var(--color);
		}
	}
}
</style>
