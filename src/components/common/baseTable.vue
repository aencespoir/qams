<template>
  <div>
    <a-table
      id="BaseTable"
      :columns="comColumns"
      :dataSource="isDataPromise?promiseData:tableData"
      :loading="tableLoading"
      :class="['components-table-demo-nested', ellipsis ? '' : 'columnsEllipsis']"
      v-on="$listeners"
      :rowSelection="selectConfig.isSelect ? rowSelection : null"
      :pagination="paginationshow"
      :customRow="customRow"
      :showHeader="showHeader"
      :customHeaderRow="customHeaderRow"
      :defaultExpandAllRows="defaultExpandAllRows"
      :scroll="scroll||{ x: 1200 }"
      :bordered="bordered"
      :rowKey="rowKey"
      :size="tableSize"
      @change="handleChange"
    >
      <span slot="index" slot-scope="text0, record0, index0">{{ index0 + 1 }}</span>
      <template
        v-if="expandedRowRender.length > 0"
        :slot="expandedRowRender.length > 0 ? 'expandedRowRender' : ''"
        slot-scope="record"
      >
        <slot name="ownRender" :record="record">
          <a-form>
            <a-form-item
              :label="item.label"
              v-for="(item,index) in expandedRowRender"
              :key="index"
              style="margin: 0"
            >
              <a-input v-model="record[item.code]" v-if="item.type === 'input'" :readOnly="true" />
              <a-input
                v-model="record[item.code]"
                v-else-if="item.type === 'textarea'"
                :autoSize="{minRows: 2}"
                type="textarea"
                :readOnly="true"
              />
              <font v-else-if="item.type === 'view'">{{ record[item.code] }}</font>
            </a-form-item>
          </a-form>
        </slot>
      </template>
      <div slot="tips" class="tips" slot-scope="text2">
        <a-tooltip placement="topLeft" :title="text2">{{ text2 }}</a-tooltip>
      </div>
      <!-- 操作 -->
      <span slot="operation" class="table-operation" slot-scope="text1, record1, index1">
        <slot name="operate" :record="record1" :index="index1"></slot>
      </span>
      <!-- tag标签 -->
      <span slot="tag" slot-scope="text5, record5, index5">
        <slot name="taglabel" :record="record5" :index="index5"></slot>
      </span>
      <!-- 图标 -->
      <span slot="icon" slot-scope="text1, record1, index1">
        <slot name="icon" :record="record1" :index="index1"></slot>
      </span>
      <span slot="popover" slot-scope="text1">
        <span v-if="!text1">-</span>
        <a-popover :content="text1" :overlayStyle="{ maxWidth: '500px' }" v-else>
          <span class="tableCellStyle">{{ text1 }}</span>
        </a-popover>
      </span>
      <span slot="customTitle">
        <slot name="customTitle"></slot>
      </span>
      <template v-for="col in editColumn" :slot="col" slot-scope="text2,record2,index2">
        <slot :name="col" :test="text2" :record="record2" :index="index2"></slot>
      </template>
    </a-table>
  </div>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    editColumn: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableDataPromise: {
      type: Promise,
      default: () => {}
    },
    isDataPromise: {
      type: Boolean,
      default: false
    },
    pagination: {
      type: Object,
      default: () => {
        return null
      }
    },
    tableSize: {
      type: String,
      default: () => {
        return 'default'
      }
    },
    selectConfig: {
      type: Object,
      default: () => {
        return {
          isSelect: false,
          selectType: 'checkbox',
          defaultChecked: []
        }
      }
    },
    expandedRowRender: {
      type: Array,
      default: () => []
    },
    defaultExpandAllRows: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    scroll: {
      type: [Object, String],
      default: () => undefined
    },
    bordered: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: String,
      default: 'key'
    },
    isSorter: {
      type: Boolean,
      default: false
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    ellipsis: {
      type: Boolean,
      default: false
    },
    selectRowRtnAll: {
      // 点击选择所有时，是否返回所有数据 false 时 会去除原来新增的数据 true 时返回所有
      type: Boolean,
      default: false
    },
    initDisabledChecked: {
      // 初始状态是否禁用勾选, 默认不禁用
      type: Boolean,
      default: false
    },
    selfDefineRowSelect: {
      type: Boolean,
      default: false
    },
    // 是否超出宽度自动省略hover显示完整内容
    showPopver: {
      type: Boolean,
      default: true
    }
  },
  components: {},
  name: 'BaseTable',
  data() {
    return {
      selectRows: [],
      // 过程台账选择数据
      tempSelectRows: [],
      // tableLoading: false,
      // 列宽度拖动
      // 进入可展示拖动范围
      mouseover: false,
      // 点击拖动
      mousedown: false,
      domKey: null,
      domNode: null,
      X: 0,
      pageX: 0,
      removeKey: [],
      promiseData: []
    }
  },
  computed: {
    comColumns() {
      var rtn = this.columns
      rtn.forEach(item => {
        if (this.showPopver) {
          if (!item.scopedSlots) {
            item.scopedSlots = { customRender: 'popover' }
          }
        }
        item.ellipsis = this.ellipsis
        if (this.isSorter) {
          if (item.key !== 'index' && item.title !== '操作') {
            item.sorter = true
          }
        }
        item.customHeaderCell = record => {
          const columnRtn = {
            style: {
              border: '1px solid #e8e8e8 '
            }
          }
          // 设置必填标注
          if (item.validate && item.validate.required) {
            columnRtn.class = 'columnsRequired'
          }
          return columnRtn
        }
      })
      if (this.expandedRowRender.length < 1) {
        let len = 0
        let flag = false
        rtn.forEach(item => {
          len += item.width ? parseInt(item.width) : 0
          if (!item.width) {
            flag = true
          }
          if (
            item.scopedSlots &&
            item.scopedSlots.customRender &&
            item.scopedSlots.customRender === 'operation' &&
            (len >= 1200 || flag)
          ) {
            item.fixed = 'right'
            item.align = 'center'
          }
        })
      }
      return rtn
    },
    paginationshow() {
      if (this.pagination == null) {
        return false
      } else {
        var map = this.pagination
        map.showQuickJumper = true
        map.showSizeChanger = true
        return map
      }
    },
    rowSelection() {
      var that = this
      const rowSelectionrtn = {
        onSelect: (record, selected) => {
          if (that.selectConfig.selectType === 'checkbox') {
            if (selected) {
              that.selectRows.push(record)
              that.tempSelectRows.push(record)
              that.removeKey = that.removeKey.filter(item => item !== record.key)
            } else {
              for (var i in that.selectRows) {
                if (that.selectRows[i].key === record.key) {
                  that.selectRows.splice(i, 1)
                }
              }
              for (var y in that.tempSelectRows) {
                if (that.tempSelectRows[y].key === record.key) {
                  that.tempSelectRows.splice(y, 1)
                }
              }
              that.removeKey.push(record.key)
            }
          } else {
            that.selectRows = []
            that.selectRows.push(record)
          }
          try {
            that.selectRows = this.COM.uniqueWithKey(that.selectRows, this.rowKey)
            that.tempSelectRows = this.COM.uniqueWithKey(that.tempSelectRows, this.rowKey)
          } catch (e) {
            console.log(e)
          }
          // 单选
          this.$emit('getSelectData', that.selectRows, that.tempSelectRows, false, that.removeKey, {
            selected: selected,
            record: record
          })
        },
        getCheckboxProps: record => ({
          props: {
            defaultChecked: this.selectConfig.defaultChecked.includes(record.key || record.id),
            disabled: this.selectConfig.notDisable
              ? false
              : this.selectConfig.defaultChecked.includes(record.key || record.id) || this.initDisabledChecked
          }
        }),
        // 全选
        onSelectAll: (selected, selectedRows, changeRows) => {
          const changeRowKey = changeRows.map(cr => {
            return cr.key
          })
          if (selected) {
            if (this.selectRowRtnAll) {
              that.selectRows = [...that.selectRows, ...selectedRows]
              that.selectRows = this.COM.uniqueWithKey(that.selectRows, this.rowKey)
            } else {
              that.selectRows = [...changeRows]
            }
            that.removeKey = that.removeKey.filter(rk => !changeRowKey.includes(rk))
          } else {
            that.selectRows = []
            that.selectRows = that.selectRows.filter(x => !changeRows.includes(x))
            that.removeKey.push(...changeRowKey)
          }
          that.tempSelectRows = that.selectRows
          this.$emit('getSelectData', that.selectRows, '', true, that.removeKey, {
            selected: selected,
            record: that.selectRows
          })
        },
        type: this.selectConfig.selectType
      }
      if (this.selfDefineRowSelect) {
        rowSelectionrtn.selectedRowKeys = this.selectRows.map(item => {
          return item.key || item.id
        })
      }
      return rowSelectionrtn
    }
  },
  watch: {
    tableDataPromise: {
      immediate: true,
      handler(val) {
        if (this.isDataPromise) {
          val.then(res => {
            if (res) {
              this.promiseData = res.data
            }
          })
        }
      }
    }
  },
  methods: {
    setSelectRows(arr) {
      this.selectRows = arr
    },
    // 行事件
    customRow(record, index) {
      const backmap = {}
      if (!(index % 2)) {
        backmap.backgroundColor = '#f4f7fd'
      }
      return {
        on: {
          click: () => {
            this.$emit('getSelectRowData', record)
          },
          dblclick: () => {
            if (
              this.selectConfig.selectType === 'radio' &&
              !(this.selectConfig.notDisable ? false : this.selectConfig.defaultChecked.includes(record.key))
            ) {
              this.selectRows = []
              this.selectRows.push(record)
              this.$emit('saveSelectData', this.selectRows)
            }
          }
        },
        style: this.$listeners.getSelectRowData ? { cursor: 'pointer', ...backmap } : { ...backmap }
      }
    },
    // 列头事件
    customHeaderRow(record, index) {
      return {
        on: {
          mouseover: e => {
            if (this.mousedown) {
              return
            }
            // 缺少节流函数！！
            e.path[1].getAttribute('key') ? (this.domNode = e.path[1]) : (this.domNode = e.path[0])
            if (this.domNode.offsetWidth - e.layerX < 10) {
              this.domNode.style.cursor = 'w-resize'
              this.domKey = e.path[1].getAttribute('key') || e.path[0].getAttribute('key')
              this.mouseover = true
            } else {
              this.domNode.style.cursor = 'default'
              this.mouseover = false
            }
          },
          mousedown: e => {
            if (!this.mouseover) {
              return
            }
            this.pageX = e.pageX
            this.mousedown = true
          },
          mousemove: e => {
            if (!this.mousedown) {
              return
            }
            this.X = e.pageX - this.pageX
            this.pageX = e.pageX
            this.comColumns.forEach(columns => {
              if (columns.key === this.domKey) {
                if (columns.width) {
                  columns.width = parseInt(columns.width) + this.X
                } else {
                  this.$set(columns, 'width', 200)
                  columns.width = parseInt(columns.width) + this.X
                }
                if (columns.width < 150) {
                  columns.width = 150
                } else if (columns.width > 1200) {
                  columns.width = 1200
                }
              }
            })
          },
          mouseup: () => {
            this.mousedown = false
            this.mouseover = false
            this.domNode.style.cursor = 'default'
            this.domKey = null
          }
        }
      }
    },
    // 设置 Table Loading
    setTableLoading(loading) {
      if (loading !== undefined) {
        this.tableLoading = loading
      } else {
        this.tableLoading = !this.tableLoading
      }
    },
    // 点击排序
    handleChange(pagination, filters, sorter) {
      if (this.isSorter) {
        this.$emit('sortColumns', sorter)
      }
    },
    // 清空上一次选中的数据
    empty() {
      this.selectRows = []
    }
  },
  mounted() {
    if (this.selectRowRtnAll) {
      const arr = []
      for (var item of this.selectConfig.defaultChecked) {
        arr.push({
          [this.rowKey]: item
        })
      }
      this.selectRows = [...arr]
    }
    setTimeout(() => {
      this.tableData.forEach(item => {
        this.selectConfig.defaultChecked.forEach(dd => {
          if (item.key === dd || item.id === dd) {
            this.selectRows.push(item)
          }
        })
      })
    }, 200)
  },
  created() {
    // var divs = document.querySelectorAll('.test')
    // divs = Array.prototype.slice.call(divs)
    // var divs = document.getElementsByClassName('test')[Symbol.iterator]
    // divs = Array.prototype.slice.call(divs)
    // console.log(divs[1])
    // // for (const i in divs) {
    // //   console.log(i)
    // // }
    // var i
    // for (i = 0; i < divs.length; i++) {
    //   console.log(divs[i])
    //   divs[i].style.backgroundColor = 'red'
    // }
    // divs.forEach(div => {
    //   const width = div.style.width
    //   const clientWidth = div.clientWidth
    //   const offsetWidth = div.offsetWidth
    //   const scrollWidth = div.scrollWidth
    //   console.log('width:', width)
    //   console.log('clientWidth:', clientWidth)
    //   console.log('offsetWidth:', offsetWidth)
    //   console.log('scrollWidth:', scrollWidth)
    // })
  }
}
</script>
<style>
.ant-table table {
  table-layout: fixed;
}
.ant-table-thead > tr > th {
  word-wrap: break-word;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.ant-table-row td {
  word-wrap: break-word;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.columnsEllipsis .ant-table-row td:hover {
  white-space: normal;
  overflow: auto;
}
.tips {
  word-wrap: break-word;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.columnsRequired::before {
  content: '*';
  font-family: SimSun;
  font-size: 14px;
  color: #f5222d;
}
.tableCellStyle {
  flex: 0 0 auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  word-wrap: break-word;
  max-width: calc(100% - 24px);
  display: inline-block;
}

.ant-table-thead th {
  border-right: 0 !important;
}
/* .ant-table-thead th:first-child {
  border-left: 0 !important;
} */
.ant-table-thead th:last-child {
  border-right: 1px solid rgb(232, 232, 232) !important;
}
</style>
