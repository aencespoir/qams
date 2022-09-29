import moment from 'moment'
// 军检提交资料上传
export const columnsUpload = [
  {
    dataIndex: 'index',
    title: '序号',
    key: 'index',
    align: 'center',
    scopedSlots: { customRender: 'index' },
    width: 50
  },
  {
    dataIndex: 'STANDARD_NAME',
    title: '归档内容',
    key: 'STANDARD_NAME',
    scopedSlots: { customRender: 'STANDARD_NAME' }
  },
  {
    dataIndex: 'IS_COMPLETE',
    title: '是否齐套',
    key: 'IS_COMPLETE',
    width: 80,
    align: 'center',
    scopedSlots: { customRender: 'IS_COMPLETE' }
  },
  {
    dataIndex: 'IS_SECRET',
    title: '是否涉密',
    key: 'IS_SECRET',
    width: 80,
    align: 'center',
    scopedSlots: { customRender: 'isSecret' }
  },
  {
    dataIndex: 'operate',
    title: '操作',
    key: 'operate',
    width: 50,
    align: 'center',
    fixed: 'right',
    scopedSlots: { customRender: 'operation' }
  },
]

// 军检验收计划
export const columnsPlan = [
  {
    dataIndex: 'index',
    title: '序号',
    key: 'index',
    align: 'center',
    scopedSlots: { customRender: 'index' },
    width: 50
  },
  {
    dataIndex: 'START_DATE',
    title: '军检计划时间',
    key: 'START_DATE',
    width: 100,
    customRender: text => {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    dataIndex: 'WORK_PLANT',
    title: '工作内容',
    key: 'WORK_PLANT',
    customRender: text => {
      return text || ''
    }
    // customRender: text => {
    //   return text ? text === '1' ? '产品齐套性检查' : text === '2' ? '外观检查' : text === '3' ? '物理特性检查' : text === '4' ? '功能检查' : text === '5' ? '性能检查' : text === '6' ? '四随检查' : '' : ''
    // }
  }
]

// 其他
export const columnsOther = [
  {
    dataIndex: 'index',
    title: '序号',
    key: 'index',
    align: 'center',
    scopedSlots: { customRender: 'index' },
    width: 50
  },
  {
    dataIndex: 'FILE_RESOURCE',
    title: '文件名称',
    key: 'FILE_RESOURCE',
    scopedSlots: { customRender: 'FILE_RESOURCE' },
  },
  {
    dataIndex: 'isSecret',
    title: '是否涉密',
    key: 'isSecret',
    width: 80,
    align: 'center',
    scopedSlots: { customRender: 'isSecret' },
  },
  // {
  //   dataIndex: 'qtx',
  //   title: '是否齐套',
  //   key: 'qtx',
  //   width: 100,
  //   align: 'center',
  //   scopedSlots: { customRender: 'qtx' },
  // },
  {
    dataIndex: 'operate',
    title: '操作',
    key: 'operate',
    width: 60,
    scopedSlots: { customRender: 'operation' },
  },
]

// 质量复合性检查
export const columnsCheck = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    fixed: 'left',
    align: 'center',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '测试项目主项',
    dataIndex: 'CHECK_ITEM',
    key: 'CHECK_ITEM',
    align: 'center',
    width: 120,
    fixed: 'left',
    customRender: (text, row, index) => {
      const obj = {
        children: text,
        attrs: {}
      }
      if (index === 1) obj.attrs.rowSpan = 2
      if (index === 2) obj.attrs.rowSpan = 0
      if (index === 3) obj.attrs.rowSpan = 3
      if (index > 3 && index < 6) obj.attrs.rowSpan = 0
      if (index === 6) obj.attrs.rowSpan = 4
      if (index > 6 && index < 10) obj.attrs.rowSpan = 0
      if (index === 10) obj.attrs.rowSpan = 6
      if (index > 10 && index < 16) obj.attrs.rowSpan = 0
      if (index === 16) obj.attrs.rowSpan = 3
      if (index > 16 && index < 19) obj.attrs.rowSpan = 0
      if (index === 19) obj.attrs.rowSpan = 7
      if (index > 19 && index < 26) obj.attrs.rowSpan = 0
      if (index === 26) obj.attrs.rowSpan = 10
      if (index > 26 && index < 36) obj.attrs.rowSpan = 0
      if (index === 36) obj.attrs.rowSpan = 6
      if (index > 36 && index < 42) obj.attrs.rowSpan = 0
      if (index === 42) obj.attrs.rowSpan = 5
      if (index > 42 && index < 47) obj.attrs.rowSpan = 0
      if (index === 47) obj.attrs.rowSpan = 9
      if (index > 47 && index < 56) obj.attrs.rowSpan = 0
      if (index === 56) obj.attrs.rowSpan = 3
      if (index > 56 && index < 59) obj.attrs.rowSpan = 0
      if (index === 59) obj.attrs.rowSpan = 4
      if (index > 59 && index < 63) obj.attrs.rowSpan = 0
      return obj
    }
  },
  {
    title: '测试项目子项',
    dataIndex: 'CHECK_ITEM_NAME',
    key: 'CHECK_ITEM_NAME',
    width: 150,
    scopedSlots: { customRender: 'CHECK_ITEM_NAME' }
  },
  {
    title: '技术要求',
    dataIndex: 'TECHNICAL_REQUIREMENT',
    key: 'TECHNICAL_REQUIREMENT',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'TECHNICAL_REQUIREMENT' }
  },
  {
    title: '测试结果',
    dataIndex: 'CHECK_RESULT',
    key: 'CHECK_RESULT',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'CHECK_RESULT' }
  },
  {
    title: '结论',
    dataIndex: 'CHECK_CONCLUSION',
    key: 'CHECK_CONCLUSION',
    width: 60,
    align: 'center',
    scopedSlots: { customRender: 'CHECK_CONCLUSION' }
  },
  {
    title: '备注',
    dataIndex: 'REMARK',
    key: 'REMARK',
    width: 150,
    scopedSlots: { customRender: 'REMARK' }
  }
]

// 军检活动集中审议
export const columnsReview = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    align: 'center',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '姓名',
    dataIndex: 'NAME',
    key: 'NAME',
    width: 80,
    align: 'center',
    scopedSlots: { customRender: 'NAME' }
  },
  {
    title: '职务',
    dataIndex: 'DUTY',
    key: 'DUTY',
    align: 'center',
    scopedSlots: { customRender: 'DUTY' }
  },
  {
    title: '签字',
    dataIndex: 'SIGN',
    key: 'SIGN',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'SIGN' }
  }
]

// 当前办理人名单
export const columnsHandle = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 50,
    align: 'center',
    scopedSlots: { customRender: 'index' }
  },
  {
    title: '办理人',
    dataIndex: 'handler',
    key: 'handler',
    scopedSlots: { customRender: 'handler' }
  }
]