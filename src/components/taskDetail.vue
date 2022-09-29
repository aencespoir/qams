<template>
	<div class="Task-View">
		<div class="taskForm-list-view">
			<p style="font-weight: bold; padding: 10px 0;margin-bottom:10px;">
				<font>{{ activeItemObj.nodeName }}</font>
				<a-tag color="red" style="margin-left:10px" v-if="activeItemObj.problemCount && activeItemObj.problemCount > 0">不正常</a-tag>
			</p>
			<!-- 消息通知 / Form 表单 -->
			<template v-if="activeItemObj.nodeSort !== templateData[templateData.length - 1].nodeSort">
				<baseForm v-model="baseFormData" :model="baseFormModel" :isView="true"/>
			</template>
			<!-- 尾节点展示星级评分 -->
			<template v-else>
				<template v-if="[1, 2].includes($store.getters.getTaskVal.productType)">
					<div class="rating-star-view">
						<p style="margin-bottom:10px; fontWeight:bold;">评估项目评分</p>
						<template v-if="false">
							<a-rate v-model="rateVal" disabled></a-rate>
							<span class="ant-rate-text" v-if="rateVal > 0">{{ rateTextData[rateVal - 1] }}</span>
						</template>
						<table class="myTables" border="1">
							<tr>
								<td width="160" class="titleBox">提供检验数据准确性</td>
								<td>{{ baseFormData.VERACITY }}</td>
							</tr>
							<tr>
								<td class="titleBox">提供检验文件齐套性</td>
								<td>{{ baseFormData.FILE_COMPLETE }}</td>
							</tr>
							<tr>
								<td class="titleBox">技术人员配合情况</td>
								<td>{{ baseFormData.TECHNIQUE_COOPERATE }}</td>
							</tr>
							<tr>
								<td class="titleBox">检验人员配合情况</td>
								<td>{{ baseFormData.CHECKOUT_COOPERATE }}</td>
							</tr>
							<tr>
								<td class="titleBox">仪器状态</td>
								<td>{{ baseFormData.INSTRUMENT_STATUS }}</td>
							</tr>
							<tr>
								<td class="titleBox">提交产品的质量</td>
								<td>{{ baseFormData.PRODUCT_QUALITY }}</td>
							</tr>
						</table>
					</div>
				</template>
			</template>
			<!-- NOTE 审查提交资料 -->
			<template v-if="activeItemObj.nodeSort === 2">
				<table class="myTables" border="1">
					<tr>
						<td width="240" class="titleBox">承制单位质量检验及提交手续办理情况</td>
						<td>{{ baseFormData.PROCEDURES }}</td>
					</tr>
					<tr>
						<td width="240" class="titleBox">生产过程中发生质量问题处理情况</td>
						<td>{{ baseFormData.QUALITY_PROBLEM }}</td>
					</tr>
					<tr>
						<td width="240" class="titleBox">检验仪器设备及检验环境条件情况</td>
						<td>{{ baseFormData.ENVIROMENT }}</td>
					</tr>
					<tr>
						<td width="240" class="titleBox">不合格品处理情况</td>
						<td>{{ baseFormData.DEF_PRODUCTS }}</td>
					</tr>
					<tr>
						<td width="240" class="titleBox">技术状态变更控制情况</td>
						<td>{{ baseFormData.CHANGE_CONTROL }}</td>
					</tr>
				</table>
			</template>
			<!-- NOTE 军检规程列表 (军检验收) -->
			<template v-if="activeItemObj.nodeSort === 4">
				<p class="pStyle" style="font-weight: bold; marginBottom: 10px;">军检规程列表</p>
				<baseTable
					tableSize="small"
					:columns="columnsFormat"
					:tableData="tableDataFormat"
					:tableLoading="tableLoadingFormat"
					:editColumn="['isSecret']"
					:scroll="{ x: 400 }"
				>
					<!-- 是否涉密 -->
					<template slot="isSecret" slot-scope="{record}">
						<template v-if="record.IS_SECRET === '0' || !record.IS_SECRET">
							<a-tag color="green">否</a-tag>
						</template>
						<template v-else>
							<a-tag color="red">是</a-tag>
						</template>
					</template>
					<!-- 操作 -->
					<template slot="operate" slot-scope="{record}">
							<a v-if="record.IS_COMPLETE && record.IS_COMPLETE == 1" href="javascript:;" @click="openFile(record)">查看</a>
							<a v-else href="javascript:;" style="color:#bbb; cursor: not-allowed">查看</a>
					</template>
				</baseTable>
			</template>
			<!-- NOTE 质量复合性检查 展示列表 -->
			<template v-if="showCheckList">
				<p class="pStyle" style="font-weight: bold; margin: 10px 0;">质量复合性检查列表</p>
				<baseTable
					style="marginBottom: 10px;"
					tableSize="small"
					:columns="columnsCheck"
					:tableData="tableDataCheck"
					:tableLoading="tableLoadingCheck"
					:scroll="{ x: 400 }"
				></baseTable>
			</template>
			<!-- NOTE 军检活动集中审议 列表 -->
			<template v-if="activeItemObj.nodeSort === 6">
				<table class="myTables" border="1">
					<tr>
						<td width="150" class="titleBox">装备名称型号</td>
						<td>{{ baseFormData.EQUIPMENT_NAME }}</td>
						<td width="100" class="titleBox">装备编号</td>
						<td>{{ baseFormData.EQUIPMENT_NO }}</td>
					</tr>
					<tr>
						<td class="titleBox">检验验依据</td>
						<td :colspan="3">{{ baseFormData.TEST_ACCEPT_BASIS }}</td>
					</tr>
					<tr>
						<td class="titleBox">监管协议编号</td>
						<td :colspan="3">{{ baseFormData.SUPERIVSE_AGREEMENT_NO }}</td>
					</tr>
					<tr>
						<td class="titleBox">提交验收时间</td>
						<td>{{ baseFormData.SUBMIT_CHECK_ACC_TIME ? $moment(baseFormData.SUBMIT_CHECK_ACC_TIME).format('YYYY-MM-DD') : '' }}</td>
						<td class="titleBox">检验验收时间</td>
						<td>{{ baseFormData.CHECK_ACC_TIME ? $moment(baseFormData.CHECK_ACC_TIME).format('YYYY-MM-DD') : '' }}</td>
					</tr>
					<tr>
						<td class="titleBox">检验验收人员</td>
						<td :colspan="3" v-if="baseFormData.CHECK_ACC_NO">{{ baseFormData.CHECK_ACC_NAME }}({{ baseFormData.CHECK_ACC_NO }})</td>
						<td :colspan="3" v-else></td>
					</tr>
					<tr>
						<td class="titleBox">军事代表检验验收结论</td>
						<td :colspan="3" style="textAlign: center;">{{ baseFormData.ARMY_REP__CONCLUSION }}</td>
					</tr>
					<tr>
						<td class="titleBox">审议确认结论</td>
						<td :colspan="3" style="textAlign: center;">{{ baseFormData.CONSIDERATION_CON_CONCLUSION }}</td>
					</tr>
					<tr style="height:70px;">
						<td class="titleBox">军事代表室领导(签字)</td>
						<td :colspan="3">
							<p style="margin:0;padding:5px 15px;display:flex;justify-content:space-between;align-items:center;">
								<font>{{ baseFormData.ARMY_REP_LEADER_SIGN }}</font>
								<font v-if="baseFormData.ARMY_REP_LEADER_SIGN_TIME">{{ $moment(baseFormData.ARMY_REP_LEADER_SIGN_TIME).format('YYYY年MM月DD日') }}</font>
								<font v-else>年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</font>
							</p>
						</td>
					</tr>
					<tr>
						<td class="titleBox">备注</td>
						<td :colspan="3">{{ baseFormData.REMARKS }}</td>
					</tr>
				</table>
				<p class="pStyle" style="fontWeight:bold;color:#666;margin-bottom:10px;">大型复杂装、关键分系统检验验收结论审议确认人员名单</p>
				<baseTable
					style="marginBottom:10px;"
					:columns="columnsReview"
					:tableData="tableDataReview"
					:tableLoading="tableLoadingReview"
					tableSize="small"
					:scroll="{ x: 400 }"
				></baseTable>
			</template>
			<template v-if="activeItemObj.productType === 4">
				<p class="pStyle" style="font-weight: bold; margin-bottom: 10px">{{activeItemObj.nodeSort === 2 ? '军检工作计划' : activeItemObj.nodeSort === 1 ? '所检资料清单' : (problemStatus && !isShowMoreProblem && activeItemObj.nodeSort === 4) ? '质量问题清单' : '军检资料清单'}}</p>
			</template>
			<template v-else>
				<p class="pStyle" style="font-weight: bold; margin-bottom: 10px">{{activeItemObj.nodeSort === 3 ? '军检工作计划' : (activeItemObj.nodeSort === 1 || activeItemObj.nodeSort === 2) ? '所检资料清单' : (problemStatus && !isShowMoreProblem && activeItemObj.nodeSort === 4) ? '质量问题清单' : '军检资料清单'}}</p>
			</template>
			<a-button
				type="primary"
				style="margin:10px 0;"
				icon="download"
				:loading="downLoading"
				:disabled="$lodash.isEmpty(selectRowsData)"
				v-if="activeItemObj.nodeSort === templateData[templateData.length - 1].nodeSort"
				@click="downloadFile"
			>批量下载</a-button>
			<baseTable
				:columns="columns"
				:tableData="tableData"
				:tableLoading="tableLoading"
				:pagination="null"
				:selectConfig="activeItemObj.nodeSort === templateData[templateData.length - 1].nodeSort ? selectConfig1 : selectConfig2"
				:editColumn="['isSecret', 'IS_COMPLETE', 'STANDARD_NAME', 'FILE_RESOURCE']"
				selectRowRtnAll
				tableSize="small"
				@getSelectData="getSelectData"
				:scroll="{ x: 400 }"
			>
				<!-- NOTE 归档内容 -->
				<template slot="STANDARD_NAME" slot-scope="{record}">
					<a @click="openFile(record)" v-if="record.IS_COMPLETE && record.IS_COMPLETE == 1" href="javascript:;">{{ record.STANDARD_NAME }}</a>
					<font v-else>{{ record.STANDARD_NAME }}</font>
				</template>
				<!-- NOTE 文件名称 -->
				<template slot="FILE_RESOURCE" slot-scope="{record}">
					<a @click="openFile(record)" v-if="record.IS_COMPLETE && record.IS_COMPLETE == 1" href="javascript:;">{{ record.FILE_RESOURCE }}</a>
					<font v-else>{{ record.FILE_RESOURCE }}</font>
				</template>
				<!-- 是否涉密 -->
				<template slot="isSecret" slot-scope="{record}">
					<template v-if="record.IS_SECRET === '0' || !record.IS_SECRET">
						<a-tag color="green">否</a-tag>
					</template>
					<template v-else>
						<a-tag color="red">是</a-tag>
					</template>
				</template>
				<!-- 齐套性 -->
				<template slot="IS_COMPLETE" slot-scope="{record}">
					<template v-if="record.IS_COMPLETE === '0' || !record.IS_COMPLETE">
						<a-tag color="red">未齐套</a-tag>
					</template>
					<template v-else>
						<a-tag color="green">齐套</a-tag>
					</template>
				</template>
				<!-- 操作 -->
				<template slot="operate" slot-scope="{record}">
						<a v-if="record.IS_COMPLETE && record.IS_COMPLETE == 1" href="javascript:;" @click="openFile(record)">查看</a>
						<a v-else href="javascript:;" style="color:#bbb; cursor: not-allowed">查看</a>
				</template>
			</baseTable>
			
			<!-- 当前办理人名单 -->
			<template v-if="!$lodash.isEmpty(tableDataHandle)">
				<p class="pStyle" style="font-weight: bold; margin: 10px 0;">当前办理人名单</p>
				<baseTable
					:columns="columnsHandle"
					:tableData="tableDataHandle"
					:tableLoading="tableLoadingHandle"
					:editColumn="['handler']"
					tableSize="small"
					:pagination="null"
					:scroll="{ x: 400 }"
				>
					<template slot="handler" slot-scope="{record}">
						<font v-if="record.TARGET">{{ record.TARGET }}-</font>
						<font>{{ record.USERNAME }}</font>
					</template>
				</baseTable>
			</template>
		</div>

		<!-- NOTE 多个问题弹窗 -->
		<a-modal
			v-model="isShowMoreProblem"
			v-if="isShowMoreProblem"
			width="90%"
			:footer="null"
			centered
			:closable="false"
			destroyOnClose
			:bodyStyle="{ height: '95vh', padding: '10px' }"
			@cancel="cancelModal"
		>
			<iframe v-if="problemUrl" :src="problemUrl" frameborder="0" height="100%" width="100%"></iframe>
			<a-empty style="marginTop: 300px;" v-else></a-empty>
		</a-modal>

		<!-- 测试签章组件 -->
		<a-drawer
			title="签章"
			:visible="showSigning"
			v-if="showSigning"
			width="70%"
			@close="() => showSigning = false"
		>
			<SigningView />
		</a-drawer>
	</div>
</template>

<script>
import { baseFormUpload, baseFormPlan, baseFormProblem, baseFormReview, baseFormCheck } from "./config/form";
import { columnsUpload, columnsPlan, columnsOther, columnsCheck, columnsReview, columnsHandle } from "./config/columns";
import { getTaskNodeDataApi, getProblemFormApi, getProblemDWApi, getFilePreviewApi, downloadFileApi } from '@api'
import SigningView from '@components/newSigningView'
export default {
	name: "TaskView",
	data() {
		return {
			formTitleName: "军检提交资料",
			listTitleName: "所检资料清单",
			problemUrl: '',
			rateVal: 0, // 星级评分
			tableLoading: false,
			showSigning: false,
			showEmpty: false,
			tableLoadingCheck: false,
			isShowMoreProblem: false,
			downLoading: false,
			tableLoadingReview: false,
			tableLoadingHandle: false,
			tableLoadingFormat: false,
			baseFormData: {},
			selectRowsData: [],
			baseFormModel: baseFormPlan,
			columns: columnsOther,
			tableData: [],
			columnsCheck: columnsCheck,
			tableDataCheck: [],
			columnsReview: columnsReview,
			tableDataReview: [],
			columnsHandle: columnsHandle,
			tableDataHandle: [],
			columnsFormat: columnsOther,
			tableDataFormat: [],
			rateTextData: ['非常不满意', '不满意', '一般', '满意', '非常满意'],
			selectConfig1: {
				isSelect: true,
				selectType: 'checkbox',
				defaultChecked: []
			},
			selectConfig2: {
				isSelect: false,
				selectType: 'checkbox',
				defaultChecked: []
			}
		};
	},
	props: {
		activeItemObj: {
			type: Object,
			default: () => {
				return {};
			}
		},
		templateData: {
			type: Array,
			default: () => {
				return []
			}
		},
		problemStatus: { type: Boolean, default: false }
	},
	components: { SigningView },
	computed: {
		rulesData() {
			var map = {};
			if (this.formModel) {
				this.formModel.forEach((el) => {
					if (el.rules) {
						map[el.formCode] = el.rules;
					}
				});
			}
			return map;
		},
		showCheckList() {
			return this.activeItemObj.nodeSort === 4 && this.$store.getters.getTaskVal.productType === 1 && this.activeItemObj.problemCount !== 1
		}
	},
	watch: {
		activeItemObj: {
			handler() {
				this.checkData()
			},
			immediate: true,
			deep: true
		},
		problemStatus: {
			handler() {
				this.checkData()
			},
			immediate: true
		}
	},
	methods: {
		// 获取单个流程节点详情
		getTaskNodeData(data) {
			this.tableLoading = true
			this.tableLoadingCheck = true
			this.tableLoadingReview = true
			this.tableLoadingHandle = true
			this.tableLoadingFormat = true
			const params = {
				no: data.nodeSort,
				processId: data.processInst,
				taskInst: data.nodeInst,
				taskDefId: data.nodeId,
				userId: this.$store.getters.getUidVal
				// userId: 'admin'
			}
			getTaskNodeDataApi(params).then(resp => {
				this.tableLoading = false
				this.tableLoadingCheck = false
				this.tableLoadingReview = false
				this.tableLoadingHandle = false
				this.tableLoadingFormat = false
				try {
					if (resp.data.data.grend) this.rateVal = parseFloat(resp.data.data.grend)
					if (resp.data.data.form && !this.$lodash.isEmpty(resp.data.data.form)) {
						this.baseFormData = resp.data.data.form
						if (this.baseFormData.CREATEDATE) {
							this.baseFormData.CREATE_DATE = this.$moment(this.baseFormData.CREATEDATE).format('YYYY-MM-DD HH:mm:ss')
						}
					} else {
						this.baseFormData = {}
					}
					// 当前办理人名单
					if (resp.data.data.doUsers && !this.$lodash.isEmpty(resp.data.data.doUsers)) {
						this.tableDataHandle = resp.data.data.doUsers.map(el => {
							return { ...el, key: this.COM.getUUID() }
						})
					} else {
						this.tableDataHandle  = []
					}
					if (data.nodeSort === 3) {
						if (resp.data.data.plant && !this.$lodash.isEmpty(resp.data.data.plant)) {
							this.tableData = resp.data.data.plant.map(el => {
								return { ...el, key: this.COM.getUUID() }
							})
						} else {
							this.tableData  = []
						}
					} else {
						// 文件列表
						if (resp.data.data.files && !this.$lodash.isEmpty(resp.data.data.files)) {
							this.tableData = resp.data.data.files.map(el => {
								return { ...el, key: this.COM.getUUID() }
							})
						} else {
							this.tableData  = []
						}
						// 质量复合性检查
						if (resp.data.data.reports && !this.$lodash.isEmpty(resp.data.data.reports)) {
							this.tableDataCheck = resp.data.data.reports.map(el => {
								return { ...el, key: this.COM.getUUID() }
							})
						} else {
							this.tableDataCheck  = []
						}
						// 军检集中活动审议
						if (resp.data.data.dutys && !this.$lodash.isEmpty(resp.data.data.dutys)) {
							this.tableDataReview = resp.data.data.dutys.map(el => {
								return { ...el, key: this.COM.getUUID() }
							})
						} else {
							this.tableDataReview  = []
						}
						// 军检规程列表
						if (resp.data.data.ruleFiles && !this.$lodash.isEmpty(resp.data.data.ruleFiles)) {
							this.tableDataFormat = resp.data.data.ruleFiles.map(el => {
								return { ...el, key: this.COM.getUUID() }
							})
						} else {
							this.tableDataFormat  = []
						}
					}
				} catch {
					this.baseFormData = {}
					this.tableDataCheck = []
					this.tableData = []
					this.tableDataReview = []
					this.tableDataHandle = []
					this.tableLoading = false
					this.tableLoadingCheck = false
					this.tableLoadingReview = false
					this.tableLoadingHandle = false
				}
			}).catch(() => {
				this.baseFormData = {}
				this.tableDataCheck = []
				this.tableData = []
				this.tableDataReview = []
				this.tableDataHandle = []
				this.tableDataFormat = []
				this.tableLoading = false
				this.tableLoadingCheck = false
				this.tableLoadingReview = false
				this.tableLoadingHandle = false
				this.tableLoadingFormat = false
			})
		},
		// => 获取问题表单
		getProblemData(data) {
			if (data.problemCount === 1) {
				getProblemFormApi({ problemIds: data.problemIds.join(',') }).then(resp => {
					try {
						const respData = resp.data.data
						this.baseFormData = respData.data[0]
						this.tableData = respData.files
					} catch {
						this.baseFormData = {}
						this.tableData = []
					}
				}).catch(() => {
					this.baseFormData = {}
					this.tableData = []
				})
			} else {
				// 获取多个问题 iframe 路径
				getProblemDWApi({ problemIds: JSON.stringify(data.problemIds) }).then(resp => {
					try {
						const respData = resp.data.data
						if (respData && !this.$lodash.isEmpty(respData)) {
							this.problemUrl = respData.url.urlPre + respData.url.urlNext
						}
					} catch {
						console.error('Error => response')
					}
				}).catch(error => {
					console.error('Error', error)
				})
			}
		},
		// 查看
		openFile(record) {
			if (record.FILE_RESOURCE) {
				const params = {
					sid: this.$store.getters.getSidVal,
					fileId: record.ID,
					fileStage: record.FILESTAGE // 1 => 所检文件, 2 => 军检文件 FILESTAGE
				}
				this.tableLoading = true
				getFilePreviewApi(params).then(resp => {
					try {
						this.tableLoading = false
						const respData = resp.data.data.data.data
						window.open(respData.url, '_blank')
					} catch {
						this.tableLoading = false
						this.$message.error(resp.data.msg)
						console.error(`Error => ${resp.data.msg}`)
					}
				})
			} else {
				this.$message.warning('当前归档内容暂无归档文件!')
			}
		},
		// 获取选择的数据
		getSelectData(selectData) {
			this.selectRowsData = this.$lodash.cloneDeep(selectData)
		},
		checkData() {
			this.selectRowsData = []
			if (this.problemStatus) {
				this.baseFormModel = []
				this.isShowMoreProblem = false
				if (this.activeItemObj.problemCount === 1) {
					this.baseFormModel = baseFormProblem
				} else {
					this.getTaskNodeData(this.activeItemObj)
					if (this.activeItemObj.problemCount > 1) {
						this.isShowMoreProblem = true
					}
				}
				this.getProblemData(this.activeItemObj)
			} else {
				this.isShowMoreProblem = false
				if (this.activeItemObj.nodeSort === 1) { // 资料上传
					if (this.$store.getters.getTaskVal.productType === 1) {
						this.baseFormModel = baseFormUpload
						} else {
						this.baseFormModel = baseFormUpload.map(el => el.filter(xx => xx.formCode !== 'IS_ORGANIZED_CHECK'))
						this.baseFormModel[this.baseFormModel.length - 2].push({})
					}
					this.columns = columnsUpload
				} else if (this.activeItemObj.nodeSort === 3) { // 验收计划
					if (this.$store.getters.getTaskVal.productType === 1) {
						this.baseFormModel = baseFormPlan
						} else {
						this.baseFormModel = baseFormPlan.map(el => el.filter(xx => xx.formCode !== 'IS_ORGANIZED_CHECK'))
						this.baseFormModel[this.baseFormModel.length - 1].push({})
					}
					this.columns = columnsPlan
				} else if (this.activeItemObj.nodeSort === 6) { // 军检活动集中审议
					this.baseFormModel = baseFormReview
					this.columns = columnsOther
				} else if (this.activeItemObj.nodeSort === 7) { // 装箱检查
					this.baseFormModel = baseFormCheck
					this.columns = columnsOther
				} else {
					this.baseFormModel = [];
					if (this.activeItemObj.nodeSort === 2) {
						this.columns = columnsUpload
					} else {
						this.columns = columnsOther
					}
				}
				this.getTaskNodeData(this.activeItemObj)
			}
		},
		// 下载文件
		downloadFile() {
			if (this.$lodash.isEmpty(this.selectRowsData)) return
			this.downLoading = true
			const params = {
				ids: JSON.stringify(this.selectRowsData.map(el => {
					return { id: el.ID, fileStage: el.FILESTAGE }
				}))
			}
			downloadFileApi(params).then(resp => {
				try {
					const respData = resp.data.data
					let templateName = '资料清单.zip'
					const link = document.createElement('a')
					link.style.display = 'none'
					link.href = window.location.origin + '/portal/file/download/?filePath=' + encodeURIComponent(respData.url)
					link.setAttribute('download', templateName)
					document.body.appendChild(link)
					link.click()
					link.remove()
					this.$notification.success({ message: '文件下载成功!' })
					this.downLoading = false
					this.selectConfig1 = {
						isSelect: true,
						selectType: 'checkbox',
						defaultChecked: []
					}
					this.selectRowsData = []
				} catch {
					this.downLoading = false
					console.error('Response => Error')
					this.$notification.error({ message: '下载失败', description: '暂无文件' })
				}
			}).catch(error => {
				this.downLoading = false
				console.error('Error => ', error)
				this.$notification.error({ message: '下载失败', description: '网络错误' })
			})
		},
		// => 关闭弹窗
		cancelModal() {
			this.$emit('closeModal')
		}
	},
	created() {}
};
</script>

<style lang="less" scoped>
.Task-View,.taskForm-list-view {
	height: 100%;
	overflow: auto;
}
.taskForm-list-view {
	padding-right: 5px;	
}
.rating-star-view {
	padding-bottom: 20px;
}
.myTables {
	width: 100%;
  border-collapse: collapse;
  border: 1px solid #bbb;
  display: table;
	margin-bottom: 10px;
  font-size: 14px;
  // -webkit-user-select: none;
  // -moz-user-select: none;
  // -ms-user-select: none;
  // user-select: none;
	tr, td {
		border-color: #bbb;
	}
  td {
		min-width: 80px;
    padding: 8px 5px;
    text-align: center;
		&.titleBox {
			font-weight: bold;
			font-size: 13px;
			color: #777;
			background: #f2f2f2;
		}
  }
}
.pStyle {
	color: #777 !important;
}
</style>
