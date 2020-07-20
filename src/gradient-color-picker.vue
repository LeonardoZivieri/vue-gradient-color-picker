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
		};
	},
	computed: {
		allColors() {
			let allColors = [];
			allColors.push({ percent: 0, color: this.initialColor });
			allColors = allColors.concat(this.colors);
			allColors.push({ percent: 100, color: this.finalColor });
			return allColors;
		},
		gradient() {
			let gradient = this.allColors.map((c) => `${c.color} ${c.percent}%`).join(', ');
			gradient = `linear-gradient( 90deg, ${gradient} )`;
			return gradient;
		},
	},
	methods: {
		addColor(event) {
			const rect = event.target.getBoundingClientRect();
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
			border: solid black;
			border-width: 0 2px 2px 0;
			display: inline-block;
			padding: 2px;
			top: -5px;
			left: 2px;
			width: 2px;
			height: 2px;
			transform: rotate(-135deg);
			-webkit-transform: rotate(-135deg);
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
