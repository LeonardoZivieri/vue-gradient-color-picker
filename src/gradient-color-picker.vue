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
		};
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
