<template>
  <div class="detail">
    <div class="header-view">
      <div class="title-view" v-if="treeNodeName">
        <font>{{ treeNodeName.title }}</font>
        <font v-if="treeNodeName.batchNo">({{ treeNodeName.batchNo }})</font>
      </div>
      <div class="title-back">
        <a-button type="dashed" icon="rollback" @click="rollback">返回</a-button>
      </div>
    </div>
    <a-spin :spinning="fixedLoading">
      <div class="contanier-view">
				<div class="fixed-view" :class="{ emptyStyle: $lodash.isEmpty(templateData) }">
					<template v-if="!$lodash.isEmpty(templateData)">
            <div
              v-for="(item, index) in templateData"
              :key="index"
              class="taskItemView"
              @click="handlerDetail(item)"
              :class="{
                endTaskView: item.nodeState === 'end',
                activeItemView: item.nodeSort === activeItemObj.nodeSort,
                activeTaskView: item.nodeState === 'active',
                waitItemView: item.nodeState === 'wait',
                specialSemi: item.nodeSort === 6 && treeNodeObj.productType === 1,
                specialFull: item.nodeSort === 8
              }"
            >
              <!-- <font>{{ item.nodeSort }}-{{ item.nodeName }}</font> -->
              <font>{{ item.nodeName }}</font>
              <div class="problemView" @click.stop="handlerQues(item)" v-if="item.problemCount">
                <font v-if="item.problemCount === 1">?</font>
                <font v-else>{{ parseFloat(item.problemCount) }}</font>
              </div>
              <div
                @click.stop
                v-if="index !== 0 && hasIndexSix && item.nodeSort !== 7"
                class="lineView"
                :class="{ endTaskView: item.nodeState !== 'wait' }"
              ></div>
              <div
                @click.stop
                v-if="index !== 0 && !hasIndexSix"
                class="lineView"
                :class="{ endTaskView: item.nodeState !== 'wait' }"
              ></div>
              <!-- 特殊线 productType === 1 && item.nodeSort === 6 -->
              <template v-if="treeNodeObj.productType === 1 && item.nodeSort === 6">
                <div
                  class="lineRadiusView topLeft"
                  :class="{ endTaskView: item.nodeState !== 'wait' }"
                  @click.stop
                ></div>
                <div
                  class="lineRadiusView topRight"
                  :class="{ endTaskView: item.nodeState !== 'wait' }"
                  @click.stop
                ></div>
                <div
                  class="lineRadiusView bottomLeft"
                  :class="{ endTaskView: isIndexSevenEndActive }"
                  @click.stop
                ></div>
                <div
                  class="lineRadiusView bottomRight"
                  :class="{ endTaskView: isIndexSevenEndActive }"
                  @click.stop
                ></div>
              </template>
            </div>
					</template>
					<template v-else>
						<a-empty></a-empty>
					</template>
				</div>
				<div class="content-view" :class="{emptyStyle: $lodash.isEmpty(templateData)}">
					<template v-if="$lodash.isEmpty(templateData)">
						<a-empty></a-empty>
					</template>
					<template v-else>
						<TaskDetail
              :activeItemObj="activeItemObj"
              :problemStatus="problemStatus"
              :templateData="templateData"
              @closeModal="closeModal"
            />
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
      problemStatus: false,
      fixedLoading: false,
      activeItemObj: {
        // nodeId: "obj_60513843bf964407a9732e4c14d72065",
        // nodeInst: "c374b097-c947-40cb-8927-0853b8a048ae",
        // nodeName: "审查提交资料",
        // nodeSort: 2,
        // nodeState: "active",
        // nodeType: "UserTaskModel",
        // processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
      },
      templateData: [
        {
          nodeId: "obj_0e0f4af7456c4265888dc317f3510763",
          nodeInst: "e0e47f6e-ea2e-4c30-af7a-c1fc2f0fb7f1",
          nodeName: "军检提交资料上传",
          nodeSort: 1,
          nodeState: "end",
          nodeType: "UserTaskModel",
          processInst: "9740cfed-9a45-49c3-a06e-90a08bbd0d59",
        },
        {
          nodeId: "obj_60513843bf964407a9732e4c14d72065",
          nodeInst: "c374b097-c947-40cb-8927-0853b8a048ae",
          nodeName: "审查提交资料",
          nodeSort: 2,
          nodeState: "end",
          nodeType: "UserTaskModel",
          processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
        },
        {
          nodeId: "obj_4f6833f527554e66aaae41b97ccab7c0",
          nodeInst: null,
          nodeName: "军检验收计划",
          nodeSort: 3,
          nodeState: "end",
          nodeType: "UserTaskModel",
          processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
        },
        {
          nodeId: "obj_51fe6033424e445eb821062552475bf5",
          nodeInst: null,
          nodeName: "质量复合性检查",
          nodeSort: 4,
          nodeState: "end",
          nodeType: "UserTaskModel",
          problemCount: 0,
          problemIds: [],
          processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
        },
        {
          nodeId: "obj_514ce5d8dc9a40679dd8bf128d429d47",
          nodeInst: null,
          nodeName: "军检资料审签",
          nodeSort: 5,
          nodeState: "end",
          nodeType: "UserTaskModel",
          processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
        },
        {
          nodeId: "obj_55840de9745448518d1bd696d69a939d",
          nodeInst: null,
          nodeName: "军检活动集中审议",
          nodeSort: 6,
          nodeState: "end",
          nodeType: "UserTaskModel",
          processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
        },
        {
          nodeId: "obj_62de92b98a814295a05915cdd394b396",
          nodeInst: null,
          nodeName: "装箱检查",
          nodeSort: 7,
          nodeState: "active",
          nodeType: "UserTaskModel",
          processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
        },
        // {
        //   nodeId: "obj_62de92b98a814295a05915cdd394b3916",
        //   nodeInst: null,
        //   nodeName: "质量文件制作提醒",
        //   nodeSort: 8,
        //   nodeState: "wait",
        //   nodeType: "UserTaskModel",
        //   processInst: "dd9b56f6-fdd0-4003-b42a-6259413483299",
        // },
        {
          nodeId: "obj_c81cb6ddf6014869924b416a6896c336",
          nodeInst: null,
          nodeName: "产品交付",
          nodeSort: 9,
          nodeState: "wait",
          nodeType: "UserTaskModel",
          processInst: "dd9b56f6-fdd0-4003-b42a-625941348399",
        }
      ]
    }
  },
  components: {
    TaskDetail: (resolve) => require(["@components/taskDetail"], resolve),
  },
  computed: {
    treeNodeName() {
      const processId = this.$store.getters.getTaskVal && this.$store.getters.getTaskVal.childProcessId;
      const productNo = this.$store.getters.getTaskVal && this.$store.getters.getTaskVal.productNo;
      const batchNo = this.$store.getters.getTaskVal && this.$store.getters.getTaskVal.batchNo;
      if (processId) {
				this.activeItemObj = {}
        this.getTreeNodeTask(processId, productNo, batchNo);
        return this.$store.getters.getTaskVal;
      } else {
        this.templateData = []
        return null;
      }
    },
    // BOM树 数据
    treeNodeObj() {
      return this.$store.getters.getTaskVal
    },
    // 检查: 整机 ---> 是否存在 6 编号  军检活动集中审议
    hasIndexSix() {
      return this.templateData.find(el => el.nodeSort === 6) ? true : false
    },
    // 检查: 整机 ---> 7号{ 装箱检查 }
    isIndexSevenEndActive() {
      return this.templateData.find(el => el.nodeSort === 7 && el.nodeState !== 'wait') ? true : false
    }
  },
  methods: {
    // 获取生命周期
    getTreeNodeTask(taskKeys, productNo, batchNo) {
      this.fixedLoading = true;
      getTreeNodeDetailApi({ processId: taskKeys, productNO: productNo, batchNO: batchNo })
        .then((resp) => {
          try {
            this.fixedLoading = false;
            this.templateData = this.$lodash.cloneDeep(resp.data.data.data.filter(el => el.show))
            this.templateData.forEach(el => {
              if (el.nodeState === 'active') {
                this.activeItemObj = el
                this.handlerDetail(el)
              }
            })
            // 不存在默认聚焦第一个
            if (this.$lodash.isEmpty(this.activeItemObj)) {
              this.activeItemObj = this.templateData[0]
              this.handlerDetail(this.templateData[0])
            }
          } catch {
            this.fixedLoading = false
            this.templateData = []
            this.activeItemObj = {}
          }
        })
        .catch(() => {
          this.templateData = []
          this.fixedLoading = false;
        });
    },
    // 获取单个任务节点详情
    handlerDetail(data) {
      if (data.nodeState === "wait") return
      this.problemStatus = false
			if (data.nodeSort) {
				this.activeItemObj = data
			}
    },
    // 点击问题
    handlerQues(data) {
      if (data.nodeState === "wait") return
      this.problemStatus = true
      if (data.nodeSort) {
        this.activeItemObj = data
      }
    },
    // 返回
    rollback() {
      this.$store.commit("setTaskVal", null);
    },
    closeModal() {
      this.problemStatus = false
    }
  }
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
      width: 260px;
      height: 100%;
      padding: 30px 10px 10px 10px;
      border-right: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-end;
      overflow: auto;
      position: relative;
      .taskItemView {
        width: 150px;
        height: 50px;
        padding: 10px 10px;
        flex-shrink: 0;
        border-radius: 8px;
        border: 1px dashed var(--primaryColor);
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;
        &:hover:not(.activeItemView, .waitItemView) {
          background: var(--primaryHoverColor);
          color: var(--primaryColor);
          transition: all .3s;
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
        &:first-child::before,
        &:last-child::after{
          display: none;
        }
        & + .taskItemView {
          margin-top: 30px;
        }
        // 问题
        .problemView {
          width: 20px;
          height: 20px;
          background: var(--primaryColor);
          border: 2px solid #fff;
          line-height: 20px;
          color: #fff;
          font-weight: normal;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
        }
        .lineView {
          width: 0;
          height: 30px;
          border-right: 1px dashed var(--primaryColor);
          border-width: 0 1px 0 0;
          position: absolute;
          bottom: 50px;
          left: 50%;
        }
        .lineRadiusView {
          width: 46px;
          height: 15px;
          border: 1px dashed var(--primaryColor);
          position: absolute;
        }
        .topLeft {
          bottom: 50px;
          left: 50%;
          border-width: 1px 0 0 1px;
          border-top-left-radius: 12px;
        }
        .topRight {
          bottom: 64px;
          left: 119px;
          border-width: 0 1px 1px 0;
          border-bottom-right-radius: 12px;
        }
        .bottomLeft {
          top: 50px;
          left: 50%;
          border-width: 0 0 1px 1px;
          border-bottom-left-radius: 12px;
        }
        .bottomRight {
          top: 64px;
          left: 119px;
          border-width: 1px 1px 0 0;
          border-top-right-radius: 12px;
        }
      }
      .endTaskView,
      .activeTaskView {
        border-style: solid !important;
      }
      .activeItemView {
        background: var(--primaryColor);
        color: #fff;
      }
      .activeTaskView {
        font-weight: bold;
      }
      .waitItemView {
        cursor: not-allowed;
        opacity: .8;
      }
      // 溢出半个
      .specialSemi {
        margin-right: 90px;
        .lineView {
          display: none;
        }
      }
      // 溢出全部
      .specialFull {
        position: absolute;
        top: 240px;
        right: 180px;
        &::before,.lineView {
          display: none;
        }
      }
    }
    .content-view {
      width: calc(100% - 260px);
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
