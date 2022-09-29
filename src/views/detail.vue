<template>
  <div class="detail">
    <div class="header-view">
      <div class="title-view">
        <font>{{ treeNodeName }}</font>
      </div>
      <div class="title-back">
        <a-button type="dashed" icon="rollback" @click="rollback">返回</a-button>
      </div>
    </div>
    <a-spin :spinning="fixedLoading">
      <div class="contanier-view">
				<div class="fixed-view" :class="{emptyStyle: showEmpty}">
					<template v-if="showEmpty">
						<a-empty></a-empty>
					</template>
					<template v-else>
						<div
							class="task-item-view"
							:class="{
								index7: item.nodeSort === 7 && productType === 1,
								index8: (item.nodeSort === 8 && productType === 1) || (item.nodeSort === 7 && productType === 2),
								activeStatusStyle: item.nodeState !== 'wait',
								activeNodeStyle: item.nodeState === 'active',
								waitNodeStyle: item.nodeState === 'wait',
								activeIndexStyle: item.nodeSort === activeIndex,
								lastChildStyle: productType === 3 || productType === 4,
								bjIndex7: item.nodeSort === 7 && productType === 2,
								bjIndex8: item.nodeSort === 8 && productType === 2
							}"
							v-for="item in templateData"
							:key="item.key"
							@click="handlerDetail(item)"
						>
							<font>{{ item.nodeName }}</font>
							<!-- 问号 -->
							<div
								v-if="item.problemCount && item.problemCount >= 1"
								class="question-view"
								:class="{ disabledStyle: item.nodeState === 'wait' }"
								@click.stop="handlerQues(item)"
							>{{ item.problemCount === 1 ? '?' : item.problemCount }}</div>
							<div v-if="item.nodeSort === 6 && (productType === 1 || productType === 2) && hasIndex8(templateData)" class="point6" @click.stop></div>
							<!-- 轴线 -->
							<template v-if="productType === 1 || productType === 2">
								<template v-if="productType === 1">
									<div
										class="line-view"
										v-if="
											item.nodeSort !== 1 &&
											item.nodeSort !== 7 &&
											item.nodeSort !== 8 &&
											item.nodeSort !== 9
										"
										@click.stop
									></div>
									<div
										v-if="item.nodeSort === 8"
										class="line-radius line8"
										:class="{ activeStatusStyle: item.nodeState !== 'wait' }"
										@click.stop
									></div>
									<div class="line-view line9" :class="{ activeStatusStyle: item.nodeState !== 'wait' }" v-if="item.nodeSort === 9 && !hasIndex7(templateData)"></div>
									<template v-if="item.nodeSort === 7 && productType === 1">
										<div
											class="line-radius lineLeftTop7"
											:class="{ activeStatusStyle: item.nodeState !== 'wait' }"
											@click.stop
										></div>
										<div
											class="line-radius lineRightTop7"
											:class="{ activeStatusStyle: item.nodeState !== 'wait' }"
											@click.stop
										></div>
										<div
											class="line-radius lineLeftBottom7"
											:class="{ activeStatusStyle: hasIndex9End() }"
											@click.stop
										></div>
										<div
											class="line-radius lineRightBottom7"
											:class="{ activeStatusStyle: hasIndex9End() }"
											@click.stop
										></div>
									</template>
								</template>
								<template v-if="productType === 2">
									<div
										class="line-view"
										:class="{bjLastLine: item.nodeSort === 8}"
										v-if="item.nodeSort !== 1 && item.nodeSort !== 7"
										@click.stop
									></div>
									<div
										v-if="item.nodeSort === 7"
										class="line-radius line8"
										:class="{ activeStatusStyle: item.nodeState !== 'wait' }"
										@click.stop
									></div>
								</template>
							</template>
							<template v-else>
								<div class="line-view" v-if="item.nodeSort !== 1" @click.stop></div>
							</template>
						</div>
					</template>
				</div>
				<div class="content-view" :class="{emptyStyle: showEmpty}">
					<template v-if="showEmpty">
						<a-empty></a-empty>
					</template>
					<template v-else>
						<TaskDetail :activeItemObj="activeItemObj" :problemStatus="problemStatus" :templateData="templateData" />
					</template>
				</div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { getTreeNodeDetailApi } from "@api";
export default {
  name: "Detail",
  data() {
    return {
      productType: 1, // 默认整机
      activeIndex: 1,
      problemStatus: false,
      fixedLoading: false,
			showEmpty: true,
      activeItemObj: {},
      templateData: []
    }
  },
  props: {},
  components: {
    TaskDetail: (resolve) => require(["@components/taskDetail"], resolve),
  },
  computed: {
    treeNodeName() {
      const processId = this.$store.getters.getTaskVal && this.$store.getters.getTaskVal.childProcessId;
      if (processId) {
				this.showEmpty = true
				this.activeItemObj = {}
				this.activeIndex = 1
        this.getTreeNodeTask(processId);
        return this.$store.getters.getTaskVal.title;
      } else {
        return null;
      }
    },
  },
  methods: {
    // 获取生命周期
    getTreeNodeTask(taskKeys) {
      this.fixedLoading = true;
      getTreeNodeDetailApi({ processId: taskKeys })
        .then((resp) => {
          if (resp.status === 200) {
            this.fixedLoading = false;
            this.templateData = this.$lodash.cloneDeep(resp.data.data.data.filter(el => el.show))
            this.showEmpty = this.$lodash.isEmpty(this.templateData)
            this.handlerDetail(this.templateData[0])
						this.templateData.forEach(el => {
							if (el.nodeState === 'active') {
								this.activeIndex = el.nodeSort
								this.handlerDetail(el)
							}
						})
          }
        })
        .catch(() => {
          this.fixedLoading = false;
        });
    },
    handlerDetail(data) {
      if (data.nodeState === "wait") return;
			if (data.nodeSort) {
				this.showEmpty = false
				this.activeIndex = data.nodeSort;
				this.activeItemObj = data;
				this.problemStatus = false;
			} else {
				this.showEmpty = true
			}
    },
    handlerQues(data) {
      if (data.nodeState === "wait") return;
      this.problemStatus = true;
      this.activeItemObj = data;
    },
    // 返回
    rollback() {
      this.$store.commit("setTaskVal", null);
    },
		hasIndex7(data) {
			return data.find(el => el.nodeSort === 7) ? true : false
		},
		hasIndex8(data) {
			return data.find(el => el.nodeSort === 8) ? true : false
		},
    // 判断是否存在最后一个任务并且不等于 wait
    hasIndex9End() {
      return this.templateData.find(el => (el.nodeSort === 9 && el.nodeState !== 'wait')) ? true : false
    }
  },
  created() {},
};
</script>

<style lang="less" scoped>
.detail {
  width: 100%;
  height: 100%;
  .header-view {
    width: 100%;
    height: 55px;
    margin-bottom: 10px;
    background: #fff;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    .title-view {
      font {
        font-weight: bold;
        font-size: 18px;
      }
    }
    .title-back {
      margin-left: 15px;
    }
  }
  /deep/.ant-spin-nested-loading {
    height: calc(100% - 65px);
  }
  /deep/.ant-spin-container,
  /deep/.ant-spin-blur {
    height: 100%;
  }
  .contanier-view {
    // height: calc(100% - 65px);
    height: 100%;
    overflow: auto;
    display: flex;
    background: #fff;
    .fixed-view {
      width: 350px;
      height: 100%;
      padding: 30px 20px 10px 10px;
      border-right: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      overflow: auto;
      position: relative;
      .task-item-view {
        width: 150px;
        height: 50px;
        padding: 0 15px;
        border-radius: 8px;
        border: 1px dashed var(--primaryColor);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        cursor: pointer;
        position: relative;
        &:hover:not(.activeIndexStyle) {
          background: var(--primaryHoverColor);
          color: var(--primaryColor);
          transition: background 0.3s;
        }
        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          display: inline-block;
          width: 8px;
          height: 8px;
          border: 1px solid var(--primaryColor);
          background: #fff;
          border-radius: 50%;
          z-index: 1;
        }
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primaryColor);
          z-index: 1;
        }
        .question-view {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: var(--primaryColor);
          border: 1px solid #fff;
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
          color: #fff;
          font-size: 15px;
          cursor: pointer;
        }
        .disabledStyle {
          cursor: not-allowed;
        }
        .line-view {
          width: 0px;
          height: 30px;
          border-right: 1px dashed var(--primaryColor);
          position: absolute;
          bottom: 100%;
          left: 50%;
          cursor: default;
        }
        & + .task-item-view {
          margin-top: 30px;
        }
        &:first-child,
        &:nth-child(8):not(&:last-child) {
          &:before {
            display: none;
          }
        }
				&:last-child {
          margin-top: 110px;
          &::after {
            display: none;
          }
					.line-view {
						height: 110px;
					}
				}
        .line-radius {
          width: 50px;
          height: 15px;
          border: 1px dashed var(--primaryColor);
          position: absolute;
        }
        .point6 {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid var(--primaryColor);
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-50%, -50%);
        }
        .line8 {
          width: 85px;
          height: 55px;
          bottom: 0;
          left: 50%;
          border-width: 0 0 1px 1px;
          border-radius: 0 0 0 8px;
          transform: translate(-1px, 100%);
        }
        .line9 {
          height: 110px;
					border-width: 0 1px 0 0;
        }
        .lineLeftTop7 {
          border-radius: 12px 0 0 0;
          top: 0;
          left: 50%;
          transform: translateY(-100%);
          border-width: 1px 0 0 1px;
        }
        .lineRightTop7 {
          border-radius: 0 0 12px 0;
          bottom: calc(100% + 14px);
          right: -51px;
          transform: translateX(-50%);
          border-width: 0 1px 1px 0;
        }
        .lineLeftBottom7 {
          border-radius: 0 0 0 12px;
          bottom: -16px;
          left: 50%;
          border-width: 0 0 1px 1px;
        }
        .lineRightBottom7 {
          border-radius: 0 12px 0 0;
          bottom: -30px;
          left: calc(50% + 50px);
          border-width: 1px 1px 0 0;
        }
				.bjLastLine {
					height: 30px !important;
				}
      }
      .index7 {
        position: absolute;
        top: 480px;
        right: 120px;
      }
      .index8 {
        position: absolute;
        top: 320px;
        right: 180px;
				&::before {
					display: none;
				}
      }
      .activeStatusStyle {
        border-style: solid !important;
      }
      .activeStatusStyle .line-view {
        border-right: 1px solid var(--primaryColor);
      }
      .activeNodeStyle {
        font-weight: bold;
        color: #222;
      }
      .activeIndexStyle {
        background: var(--primaryColor);
        color: #fff;
      }
      .waitNodeStyle {
        cursor: not-allowed;
        &:hover {
          background: transparent !important;
          color: #666 !important;
        }
      }
      .has7itemStyle {
        .line-view {
          display: none;
        }
      }
			.bjIndex7 {
				&::before {
					display: none;
				}
			}
			.bjIndex8 {
				margin-top: 30px !important;
			}
			.lastChildStyle:last-child{
				margin-top: 30px;
				.line-view {
					height: 30px;
				}
			}
    }
    .content-view {
      width: calc(100% - 350px);
      height: 100%;
      padding: 10px 10px 10px 15px;
      overflow: auto;
    }
		.emptyStyle {
			display: flex;
			justify-content: center;
			align-items: center;
		}
  }
}
</style>
