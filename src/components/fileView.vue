<template>
	<div class="fileView">
		<a-modal
			v-model="visible"
			width="85%"
			title="文件预览"
			:footer="null"
			centered
		>
			文件预览
		</a-modal>
	</div>
</template>

<script>
export default {
	name: "FileView",
	data() {
		return {
			//
		};
	},
	props: {
		value: { type: Boolean, default: false }
	},
	components: {},
	computed: {
		visible: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit("input", val);
			}
		}
	},
	methods: {},
	created() {}
};
</script>

<style lang="less" scoped></style>
