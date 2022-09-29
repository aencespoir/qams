<template>
	<div class="message">
		<a-tabs>
			<a-tab-pane tab="消息通知">
				<div class="message-box">
					<div class="message-view">
						<a-spin :spinning="loading">
							<template v-if="$lodash.isEmpty(messageData)">
								<a-empty style="marginTop: 120px;"></a-empty>
							</template>
							<template v-else>
								<div
									class="message-item-view"
									v-for="item in messageData"
									:key="item.key"
									@click="handler(item)"
								>
									<div class="left-view" :title="`${item.TITLE}（${item.PRODUCT_NO}）`">{{ item.TITLE }}（{{ item.PRODUCT_NO }}）</div>
									<div class="right-view">{{ $moment(item.CREATEDATE).format('YYYY-MM-DD') }}</div>
								</div>
							</template>
						</a-spin>
					</div>
					<div class="more-view" @click="handlerAll">全部消息&nbsp;({{ totalNum }})&nbsp;&gt;</div>
				</div>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
import { getMessageListApi, getProblemDWApi } from '@api'
export default {
	name: "Message",
	data() {
		return {
			loading: false,
			totalNum: 0,
			messageData: []
		};
	},
	props: {},
	components: {},
	methods: {
		// 获取消息列表
		getMessageData() {
			this.loading = true
			const params = {
				userId: this.$store.getters.getUidVal
				// userId: 'admin'
			}
			getMessageListApi(params).then(resp => {
				try {
					const respData = resp.data.data.date
					this.totalNum = respData.count
					this.messageData = [...respData.list, ...respData.listProblem]
				} catch {
					this.totalNum = 0
					this.messageData = []
				}
				this.loading = false
			}).catch(() => {
				this.loading = false
			})
		},
		// 查看消息
		handler(data) {
			if (data.SIGN === 1) {
				const params = {
					problemIds: JSON.stringify([data.ID])
				}
				getProblemDWApi(params).then(resp => {
					try {
						const respData = resp.data.data
						const pathUrl = respData.url.urlPre + respData.url.urlNext
						window.open(pathUrl, '_blank', 'width=800')
					} catch {
						console.log('response => Error', resp)
						this.$message.error('消息查看失败!')
					}
				})
			} else {
				data.url && window.open(data.url, '_blank', 'width=800')
				data.url || this.$message.error('消息查看失败!')
			}
		},
		// 查看全部消息
		handlerAll() {}
	},
	mounted() {
		this.getMessageData()
	}
};
</script>

<style lang="less" scoped>
.message {
	width: 240px;
	height: 100%;
	background: #fff;
	.message-box {
		height: 100%;
		padding: 0 0 50px 0;
		position: relative;
		.message-view {
			height: 100%;
			overflow: auto;
			.message-item-view {
				padding: 10px 12px;
				display: flex;
				justify-content: space-between;
				align-items: flex-start;
				cursor: pointer;
				&:hover {
					background: var(--primaryHoverColor);
					.left-view,
					.right-view {
						color: var(--primaryColor);
					}
				}
				.left-view {
					color: #333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.right-view {
					color: #999;
					margin-left: 10px;
					white-space: nowrap;
				}
			}
		}
		.more-view {
			position: absolute;
			bottom: 25px;
			left: 50%;
			transform: translate(-50%, 50%);
			color: var(--primaryColor);
			cursor: pointer;
			&:hover {
				text-decoration: underline;
			}
		}
	}
}
/deep/.ant-tabs {
	height: 100%;
}
/deep/.ant-tabs-top-content.ant-tabs-content-animated {
	height: calc(100% - 60px);
}
/deep/.ant-spin-nested-loading,
/deep/.ant-spin-container {
	height: 100%;
	overflow: hidden;
}
/deep/.ant-spin-nested-loading > div > .ant-spin {
	max-height: initial;
}
</style>
