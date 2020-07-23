<template>
	<div>
		<div v-for="( color, index ) in colors" :key="index">
			<div>
				{{ colors[index] }}
			</div>
			<gradient-color-picker v-model="colors[index]"></gradient-color-picker>
		</div>
	</div>
</template>

<script>
import GradientColorPicker from './gradient-color-picker.vue';

export default {
	components: {
		GradientColorPicker,
	},
	data() {
		return {
			colors: [
				'linear-gradient(#e66465, #9198e5)',
				'linear-gradient(0.25turn, #3f87a6, #ebf8e1, #f69d3c)',
				'linear-gradient(to left, #333, #333 50%, #eee 75%, #333 75%)',
				'linear-gradient(217deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%)',
				'linear-gradient(127deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%)',
				'linear-gradient(336deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%)',
			],
		};
	},
};
</script>

<style lang="css" scoped>
</style>
