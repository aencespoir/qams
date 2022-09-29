<template>
	<div class="Home">
		<!-- NOTE BOM树 -->
		<!-- <a-row :gutter="24" class="rowView"> -->
			<!-- <a-col :span="isCollapsed ? 1 : 5" class="colView"> -->
				<BomTree @getCollapsed="getCollapsed"/>
			<!-- </a-col> -->
			<!-- <a-col :span="isCollapsed ? 23 : 19" class="colView"> -->
				<div :class="[isCollapsed ? 'contentViewCollapsed' : 'contentView']">
					<template v-if="showDetail">
						<Detail />
					</template>
					<template v-else>
						<!-- NOTE iframe嵌套 -->
						<div class="iframeView">
							<iframe
								:src="`${httpUrl}/portal/r/w?sid=${sidVal}&cmd=com.actionsoft.apps.workbench_main_page`"
								frameborder="0"
								width="100%"
								height="100%"
							></iframe>
						</div>
						<!-- NOTE 消息通知 -->
						<Message />
					</template>
				</div>
			<!-- </a-col> -->
		<!-- </a-row> -->
	</div>
</template>

<script>
export default {
	name: "Home",
	data() {
		return {
			showDetail: false, // 是否展示对应序列号详情
			isCollapsed: false,
			// httpUrl: window.location.origin || 'localhost:8088',
			// sidVal: JSON.parse(localStorage.getItem("sid")),
			formData: {}
		};
	},
	components: {
		BomTree: (resolve) => require(["./fixedArea"], resolve),
		Message: (resolve) => require(["./message"], resolve),
		// Detail: (resolve) => require(["./detail"], resolve)
		Detail: (resolve) => require(["./newDetail"], resolve)
	},
	watch: {
		"$store.state.taskVal": {
			handler(val) {
				if (val && !this.$lodash.isEmpty(val)) {
					this.showDetail = true;
				} else {
					this.showDetail = false;
				}
			},
			immediate: true,
			deep: true
		}
	},
	computed: {
		httpUrl() {
			return window.location.origin
		},
		sidVal() {
			return JSON.parse(localStorage.getItem("sid"))
		}
	},
	methods: {
		getCollapsed(flag) {
			this.isCollapsed = flag
		}
	},
	created() {}
};
</script>

<style lang="less" scoped>
.Home {
	width: 100%;
	height: 100%;
	display: flex;
	flex-flow: row nowrap;
	justify-content: space-between;
	align-items: flex-start;
	overflow: auto;
	background: #ededed;
	.rowView {
		height: 100%;
		margin: 0 !important;
	}
	.colView {
		height: 100%;
		padding: 0 !important;
		& + .colView {
			padding: 12px !important;
		}
	}
	.contentView,.contentViewCollapsed {
		width: calc(100% - 265px);
		height: 100%;
		padding: 10px 10px 10px 0;
		display: flex;
		justify-content: space-between;
		transition: all .3s;
		.iframeView {
			height: 100%;
			flex-grow: 1;
			margin-right: 12px;
			background: #fff;
		}
	}
	.contentViewCollapsed {
		width: calc(100% - 25px);
	}
}
</style>
