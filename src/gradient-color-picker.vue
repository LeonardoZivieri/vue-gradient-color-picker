<template lang="html">
	<div>
		<div style="display: none">
			<input type="color" v-model="initialColor" ref="initialColorInput">
			<input type="color" v-model="finalColor" ref="finalColorInput">
			<input
					type="color"
					v-for="(c, i) of colors"
					:key="i"
					v-model="colors[i].color"
					ref="colorInput"
				>
		</div>
		<div class="gradient-color-picker-input-div" :style="{background: gradient}">
			<span
					class="icon"
					:style="{'--color': initialColor, '--percent': '0%'}"
					@click="$refs['initialColorInput'].click( $event )"
				>
			</span>
			<span
					class="icon draggable"
					v-for="(c, i) of colors"
					:key="i"
					:style="{'--color': c.color, '--percent': c.percent+'%'}"
					@click="$refs['colorInput'][i].click( $event )"
				>
			</span>
			<span
					class="icon"
					:style="{'--color': finalColor, '--percent': '100%'}"
					@click="$refs['finalColorInput'].click( $event )"
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
};
</script>

<style lang="scss" scoped>
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
