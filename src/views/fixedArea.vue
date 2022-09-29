<template>
	<div :class="[isCollapsed ? 'fixedAreaCollapsed' : 'fixedArea']">
		<a-tabs v-model="activeTabs" :tabBarGutter="0" @change="changeTabs" v-show="!isCollapsed">
			<a-tab-pane :key="items.code" :tab="items.name" v-for="items in tabsData">
				<div class="status-view">
					<div
						class="status-items-view"
						v-for="item in statusData"
						:key="item.code"
						:class="{ 'status-items-active': activeStatus === item.code }"
						@click="changeStatus(items, item)"
					>
						<div class="icon-view">
							<i :class="['iconfont', item.icon]"></i>
						</div>
						<font>{{ item.name }}</font>
					</div>
				</div>
				<div class="search-view">
					<a-input-search
						v-model="searchVal"
						@change="onChange"
						@search="handlerSearch"
						allowClear
					></a-input-search>
					<a-button
						type="primary"
						icon="redo"
						title="重置"
						@click="handlerReset"
					/>
				</div>
				<div class="tree-view">
					<a-spin :spinning="treeLoading">
						<a-tree
							v-if="!$lodash.isEmpty(treeData)"
							showLine
							:expandedKeys.sync="expandedKeys"
							:auto-expand-parent="autoExpandParent"
							:selectedKeys.sync="selectedKeys"
							:tree-data="treeData"
							@expand="onExpand"
							@select="onSelect"
						>
							<template slot="title" slot-scope="{ title, floor, batchNo }">
								<img
									class="iconImg"
									v-if="getHierarchy(floor) === 1"
									src="@assets/icon/keti.png"
									alt=""
								/>
								<template v-else-if="getHierarchy(floor) === 2">
									<img
										v-if="activeTabs === 1 || activeTabs === 2"
										class="iconImg"
										src="@assets/icon/hetongbianhao.png"
										alt=""
									/>
									<img
										v-else-if="activeTabs === 3"
										class="iconImg"
										src="@assets/icon/renwudanhao.png"
										alt=""
									/>
									<img
										v-else
										class="iconImg"
										src="@assets/icon/iconyear.png"
										alt=""
									/>
								</template>
								<img
									class="iconImg"
									v-else-if="getHierarchy(floor) === 3"
									src="@assets/icon/zhengji.png"
									alt=""
								/>
								<img
									class="iconImg"
									v-else-if="getHierarchy(floor) === 4"
									src="@assets/icon/guidangwenjian.png"
									alt=""
								/>
								<img
									class="iconImg"
									v-else
									src="@assets/icon/qijian.png"
									alt=""
								/>
								<span v-if="title.indexOf(searchVal) > -1">
									{{ title.substr(0, title.indexOf(searchVal)) }}
									<span style="color: #f50">{{ searchVal }}</span>
									{{ title.substr(title.indexOf(searchVal) + searchVal.length) }}
									<template v-if="batchNo && floor === 3">({{ batchNo }})</template>
								</span>
								<span v-else>
									<font>{{ title }}</font>
									<font v-if="batchNo && floor === 3">({{ batchNo }})</font>
								</span>
							</template>
						</a-tree>
						<a-empty v-else style="marginTop:150px"></a-empty>
					</a-spin>
				</div>
			</a-tab-pane>
		</a-tabs>
		<div class="collapsed-view" @click="getCollapsed">
			<font v-if="isCollapsed">&gt;</font>
			<font v-else>&lt;</font>
		</div>
	</div>
</template>

<script>
import * as qams from "@api";
export default {
	name: "FixedArea",
	data() {
		return {
			activeTabs: 1, //
			activeStatus: 1, // 提交状态
			searchVal: "", // 搜索值
			autoExpandParent: false,
			treeLoading: false,
			isCollapsed: false, // 折叠
			expandedKeys: [],
			selectedKeys: [],
			treeData: [],
			dataList: [],
			tabsData: [
				{ code: 1, name: "整机" },
				{ code: 2, name: "备件" },
				{ code: 3, name: "售后" },
				{ code: 4, name: "部件" }
			],
			statusData: [
				{ code: 1, icon: "iconqiyong_huaban1", name: "准备提交" },
				{ code: 2, icon: "iconfabu", name: "军检提交" },
				{ code: 3, icon: "iconxuanzhong", name: "已完成" }
			]
		};
	},
	methods: {
		changeTabs(tabsVal) {
			this.activeTabs = tabsVal
			this.initData()
			this.getTreeData()
		},
		initData() {
			this.searchVal = "";
			this.expandedKeys = []
			this.selectedKeys = []
		},
		// 切换提交状态
		changeStatus(tabsKeys, statusKeys) {
			if (this.activeStatus === statusKeys.code) return
			this.activeStatus = statusKeys.code
			this.initData()
			this.getTreeData()
		},
		// 搜索
		handlerSearch(value) {
			if (value.replace(/\s+/g, "").length === 0) {
				this.searchVal = ""
				return;
			}
			const expandedKeys = this.dataList
				.map((item) => {
					if (item.title.indexOf(value) > -1) {
						return this.getParentKey(item.key, this.treeData);
					}
					return null;
				})
				.filter((item, i, self) => item && self.indexOf(item) === i);
			Object.assign(this, {
				expandedKeys: [...expandedKeys],
				searchVal: value,
				autoExpandParent: true
			});
		},
		// 重置
		handlerReset() {
			this.initData()
			this.getTreeData()
		},
		// 展开TreeNode
		onExpand(expandedKeys) {
			this.expandedKeys = expandedKeys;
			this.autoExpandParent = false;
		},
		// 节点选择
		onSelect(_, e) {
			const treeNode = e.node.dataRef.key;
			const num = e.node.dataRef.floor;
			if (!this.selectedKeys.includes(treeNode)) {
				this.selectedKeys.push(treeNode);
			}
			if (num !== 3) this.selectedKeys = [];
			if (!this.expandedKeys.includes(treeNode)) {
				this.expandedKeys.push(treeNode);
			}
			if (num === 3) {
				if (e.node.dataRef.childProcessId) {
					this.$store.commit("setTaskVal", {...e.node.dataRef, productType: this.activeTabs, activeStatus: this.activeStatus});
				} else {
					this.$message.warning('当前序列号暂未有数据内容!')
					this.$store.commit("setTaskVal", null);
				}
			}
		},
		onChange(e) {
			this.handlerSearch(e.target.value);
		},
		getParentKey(key, tree) {
			let parentKey;
			for (let i = 0; i < tree.length; i++) {
				const node = tree[i];
				if (node.children) {
					if (node.children.some((item) => item.key === key)) {
						parentKey = node.key;
					} else if (this.getParentKey(key, node.children)) {
						parentKey = this.getParentKey(key, node.children);
					}
				}
			}
			return parentKey;
		},
		generateList(data) {
			for (let i = 0; i < data.length; i++) {
				const node = data[i];
				const key = node.key;
				const title = node.title;
				this.dataList.push({ key, title: title });
				if (node.children) {
					this.generateList(node.children);
				}
			}
		},
		// 获取层级
		getHierarchy(key) {
			return parseFloat(key);
		},
		getTreeData() {
			this.treeLoading = true
			qams.getTreeDataApi({ productType: this.activeTabs, productState: this.activeStatus }).then(resp => {
				this.treeData = resp.data.data ? resp.data.data.data : []
				this.generateList(this.treeData)
				this.treeLoading = false
			}).catch(() => {
				this.treeLoading = false
			})
		},
		getCollapsed() {
			this.isCollapsed = !this.isCollapsed
			this.$emit('getCollapsed', this.isCollapsed)
		}
	},
	mounted() {
		// 军代表不展示 <准备提交> '91fa2874-07e1-4935-bf82-fcd90bf1767b'
		// 判断当前登录人角色 ID 与 对应军代表 ID 一致时
		const storeObj = this.$store.getters
		if (storeObj.getJdbroleIdVal === storeObj.getJdbroleIdStandardVal || storeObj.getJdborgIdVal === storeObj.getJdborgIdStandardVal) {
			this.statusData = this.statusData.filter(el => el.code !== 1)
			this.activeStatus = 2
		}
		this.getTreeData();
	}
};
</script>

<style lang="less" scoped>
.fixedArea,
.fixedAreaCollapsed {
	width: 250px;
	height: 100%;
	padding: 0 5px;
	border-right: 1px solid #e8e8e8;
	background: #fff;
	position: relative;
	transition: width 0.3s;
	&:hover {
		.collapsed-view {
			opacity: 1;
		}
	}
	.status-view {
		width: 100%;
		height: auto;
		display: flex;
		justify-content: space-around;
		align-items: center;
		.status-items-view {
			padding: 0 5px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #c0c0c0;
			cursor: pointer;
			&:hover {
				.icon-view {
					border: 1px solid var(--primaryColor);
					background: var(--primaryColor);
					color: #fff;
				}
			}
			.icon-view {
				width: 32px;
				height: 32px;
				margin-bottom: 10px;
				border-radius: 50%;
				border: 1px solid #c0c0c0;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 16px;
				color: #c0c0c0;
			}
		}
		.status-items-active {
			font {
				color: #333;
			}
			.icon-view {
				border: 1px solid var(--primaryColor);
				background: var(--primaryColor);
				color: #fff;
			}
		}
	}
	.search-view {
		width: 100%;
		margin: 10px 0;
		padding: 0 5px;
		display: flex;
		align-items: center;
		button {
			margin-left: 15px;
		}
	}
	.tree-view {
		width: 100%;
		height: calc(100% - 63px - 52px);
		padding: 0 5px 10px;
		overflow: auto;
		.iconImg {
			width: 16px;
		}
	}
	.collapsed-view {
		position: absolute;
		top: 50%;
		right: -14px;
		width: 14px;
		height: 50px;
		background: var(--primaryColor);
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0 4px 4px 0;
		cursor: pointer;
		z-index: 10;
		opacity: 0;
	}
}
.fixedAreaCollapsed {
	width: 0;
}
/deep/.ant-tabs {
	height: 100%;
}
/deep/.ant-tabs-top-content.ant-tabs-content-animated {
	height: calc(100% - 60px);
	padding-bottom: 10px;
}
/deep/.ant-spin-nested-loading,
/deep/.ant-spin-container {
	height: 100%;
	overflow: auto;
}
/deep/.ant-spin-nested-loading > div > .ant-spin {
	max-height: initial;
}

// 聚焦高亮treeNode
/deep/.ant-tree
	li
	.ant-tree-node-content-wrapper.ant-tree-node-selected
	.ant-tree-title {
	color: var(--primaryColor);
}
</style>
