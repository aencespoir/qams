// 军检资料上传
export const baseFormUpload = [
  [
    {
      formLabel: "提交人",
      formCode: "APPLY_NAME",
      formType: 'input',
      rules: [{ required: true, message: "请输入提交人", trigger: "change" }]
    },
    {
      formLabel: "提交时间",
      formCode: "CREATE_DATE",
      formType: 'input',
      rules: [{ required: true, message: "请输入提交时间", trigger: "blur" }]
    },
    {
      formLabel: "产品编号",
      formCode: "PRODUCT_NOS",
      formType: 'input',
      rules: [{ required: true, message: "请输入产品编号", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "批次号",
      formCode: "BATCH_NO",
      formType: 'input',
      rules: [{ required: false, message: "请输入批次号", trigger: "blur" }]
    },
    {
      formLabel: "提交数量",
      formCode: "PRODUCT_COUNT",
      formType: 'input',
      rules: [{ required: true, message: "请输入提交数量", trigger: "blur" }]
    },
    {
      formLabel: "产品型号",
      formCode: "PRODUCT_MODEL",
      formType: 'input',
      rules: [{ required: true, message: "请输入产品型号", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "合同号",
      formCode: "CONTRACT_NO",
      formType: 'input',
      rules: [{ required: true, message: "请输入合同号", trigger: "blur" }]
    },
    {
      formLabel: "合同类型",
      formCode: "CONTRACT_TYPE",
      formType: 'select',
      searchChild: [{ label: '产品', code: '1' }, { label: '厂际', code: '2' }, { label: '其他', code: '5' }],
      rules: [{ required: true, message: "请选择合同类型", trigger: "change" }]
    },
    {
      formLabel: "提交类型",
      formCode: "SUBMIT_TYPE",
      formType: 'select',
      searchChild: [{ label: '整机', code: '1' }, { label: '备件', code: '2' }, { label: '售后', code: '3' }, { label: '部件', code: '4' }],
      rules: [{ required: true, message: "请选择提交类型", trigger: "blur" }]
    },
  ],
  [
    {
      formLabel: "监管协议编号",
      formCode: "SUPERVISE_PROTOCOL_NO",
      formType: 'input',
      rules: [{ required: true, message: "请输入监管协议编号", trigger: "blur" }]
    },
    {
      formLabel: "产品提交次数",
      formCode: "SUBMIT_NUMBER",
      formType: 'input',
      rules: [{ required: true, message: "请输入产品提交次数", trigger: "blur" }]
    },
    {
      formLabel: '合同数量',
      formCode: 'CONTRACT_COUNT',
      formType: 'input',
      rules: [{ required: true, message: '请输入合同数量', trigger: 'blur' }]
    }
  ],
  [
    {
      formLabel: "质量人员",
      formCode: "QUALITY_PERSONEL",
      formType: 'input',
      rules: [{ required: false, message: "请输入质量人员", trigger: "blur" }]
    },
    {
      formLabel: "生产负责人",
      formCode: "PROJECT_LEADER",
      formType: 'input',
      rules: [{ required: false, message: "请输入生产负责人", trigger: "blur" }]
    },
    {
      formLabel: "计划经理",
      formCode: "PROGRAM_MANAGER",
      formType: 'input',
      rules: [{ required: false, message: "请输入计划经理", trigger: "blur" }],
    },
  ],
  [
    // {
    //   formLabel: "军代表",
    //   formCode: "ARMY_REP_NAME",
    //   formType: 'input',
    //   rules: [{ required: false, message: "请输入军代表", trigger: "blur" }]
    // },
    {
      formLabel: "主岗军代表",
      formCode: "MAIN_ARMY_REP_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入主岗军代表", trigger: "blur" }]
    },
    {
      formLabel: "副岗军代表",
      formCode: "SECONDARY_ARMY_REP_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入副岗军代表", trigger: "blur" }],
    },
    {
      formLabel: '开展数量',
      formCode: 'UNFOLD_COUNT',
      formType: 'input',
      rules: [{ required: true, message: '请输入开展数量', trigger: 'blur' }]
    }
  ],
  /*
  [
    {
      formLabel: '申请人办理时间',
      formCode: 'APPLYER_SUBMIT_TIME',
      formType: 'input',
      rules: [{ required: true, message: '请输入申请人办理时间', trigger: 'blur' }]
    },
    {
      formLabel: '质量部领导办理时间',
      formCode: 'LEADER_SUBMIT_TIME',
      formType: 'input',
      rules: [{ required: true, message: '请输入质量部领导办理时间', trigger: 'blur' }]
    },
    {
      formLabel: '军代表办理时间',
      formCode: 'ARMY_REP_SUBMIT_TIME',
      formType: 'input',
      rules: [{ required: true, message: '请输入军代表办理时间', trigger: 'blur' }]
    }
  ],
  */
  [
    // {
    //   formLabel: '开展数量',
    //   formCode: 'UNFOLD_COUNT',
    //   formType: 'input',
    //   rules: [{ required: true, message: '请输入开展数量', trigger: 'blur' }]
    // },
    {
      formLabel: "是否开展集中审议",
      formCode: "IS_ORGANIZED_CHECK",
      formType: 'radio',
      searchChild: [{ label: '是', code: 1 }, { label: '否', code: 0 }],
      rules: [{ required: true, message: "请选择是否开展集中审议", trigger: "change" }]
    },
    {},
    {}
  ],
  [
    {
      formLabel: "所检情况及结论",
      formCode: "INSTITUTE_CONTEXT",
      formType: 'textarea',
      rules: [{ required: false, message: "", trigger: "blur" }],
      bind: {
        autoSize: {
          minRows: 3,
          maxRows: 6
        }
      }
    }
  ]
]
// 军检验收计划
export const baseFormPlan = [
  [
    {
      formLabel: "产品编号",
      formCode: "PRODUCT_NOS",
      formType: 'input',
      rules: [{ required: true, message: "请输入产品编号", trigger: "blur" }]
    },
    {
      formLabel: "产品型号",
      formCode: "PRODUCT_MODEL",
      formType: 'input',
      rules: [{ required: true, message: "请输入产品型号", trigger: "blur" }]
    },
    {
      formLabel: "批次号",
      formCode: "BATCH_NO",
      formType: 'input',
      rules: [{ required: true, message: "请输入批次号", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "合同号",
      formCode: "CONTRACT_NO",
      formType: 'input',
      rules: [{ required: true, message: "请输入合同号", trigger: "blur" }]
    },
    {
      formLabel: "合同类型",
      formCode: "CONTRACT_TYPE",
      formType: 'select',
      searchChild: [{ label: '产品', code: '1' }, { label: '厂际', code: '2' }, { label: '其他', code: '5' }],
      rules: [{ required: true, message: "请选择合同类型", trigger: "change" }]
    },
    {
      formLabel: "监管协议编号",
      formCode: "SUPERVISE_PROTOCOL_NO",
      formType: 'input',
      rules: [{ required: true, message: "请输入监管协议编号", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "质量人员",
      formCode: "QUALITY_PERSONEL",
      formType: 'input',
      rules: [{ required: false, message: "请输入质量人员", trigger: "blur" }]
    },
    {
      formLabel: "生产负责人",
      formCode: "PROJECT_LEADER",
      formType: 'input',
      rules: [{ required: false, message: "请输入生产负责人", trigger: "blur" }]
    },
    {
      formLabel: "计划经理",
      formCode: "PROGRAM_MANAGER",
      formType: 'input',
      rules: [{ required: false, message: "请输入计划经理", trigger: "blur" }],
    },
  ],
  [
    {
      formLabel: "合同数量",
      formCode: "CONTRACT_COUNT",
      formType: 'input',
      rules: [{ required: false, message: "请输入合同数量", trigger: "blur" }]
    },
    {
      formLabel: "开展数量",
      formCode: "UNFOLD_COUNT",
      formType: 'input',
      rules: [{ required: false, message: "请输入开展数量", trigger: "blur" }]
    },
    {
      formLabel: "是否开展集中审议",
      formCode: "IS_ORGANIZED_CHECK",
      formType: 'radio',
      searchChild: [{ label: '是', code: 1 }, { label: '否', code: 0 }],
      rules: [{ required: true, message: "请选择是否开展集中审议", trigger: "change" }]
    }
  ]
]
// 问题表单
export const baseFormProblem = [
  [
    {
      formLabel: "产品型号",
      formCode: "PRODUCT_MODEL",
      formType: 'input',
      rules: [{ required: false, message: "请输入产品型号", trigger: "blur" }]
    },
    {
      formLabel: "产品编号",
      formCode: "PRODUCT_NO",
      formType: 'input',
      rules: [{ required: false, message: "请输入产品编号", trigger: "blur" }]
    },
    {
      formLabel: "提交时间",
      formCode: "CREATEDATE",
      formType: 'input',
      rules: [{ required: false, message: "请输入提交时间", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "检验人员",
      formCode: "CHECK_USER_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入检验人员", trigger: "blur" }]
    },
    {
      formLabel: "归零责任人",
      formCode: "END_USER_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入归零责任人", trigger: "blur" }]
    },
    {
      formLabel: "军种",
      formCode: "ARMY_TYPE",
      formType: 'select',
      searchChild: [{ label: '空军', code: '1' }],
      rules: [{ required: false, message: "请选择军种", trigger: "change" }]
    },
  ],
  [
    {
      formLabel: "问题来源",
      formCode: "SOURCE",
      formType: 'input',
      rules: [{ required: false, message: "请输入问题来源", trigger: "blur" }]
    },
    {
      formLabel: "问题发生日期",
      formCode: "HAPPEN_DATE",
      formType: 'input',
      rules: [{ required: false, message: "请输入问题发生日期", trigger: "blur" }]
    },
    {
      formLabel: "计划归零日期",
      formCode: "PLAN_DATE",
      formType: 'input',
      rules: [{ required: false, message: "请输入归零截止日期", trigger: "blur" }]
    },
  ],
  [
    {
      formLabel: "归零周期",
      formCode: "END_DAY",
      formType: 'input',
      rules: [{ required: false, message: "请输入归零周期", trigger: "blur" }]
    },
    {
      formLabel: "当前状态",
      formCode: "STATUS",
      formType: 'select',
      searchChild: [{ label: '发起', code: '1' }, { label: '审批中', code: '2' }, { label: '流程结束', code: '3' }],
      rules: [{ required: false, message: "请选择当前状态", trigger: "change" }]
    },
    {
      formLabel: "问题类型",
      formCode: "PROBLEM_TYPE",
      formType: 'select',
      searchChild: [{ label: '问题1', code: '1' }, { label: '问题2', code: '2' }, { label: '问题3', code: '3' }, { label: '问题4', code: '4' }],
      rules: [{ required: false, message: "请选择问题类型", trigger: "change" }]
    }
  ],
  [{
    formLabel: "问题现象",
    formCode: "PROBLEM_APPEA",
    formType: 'textarea',
    rules: [{ required: false, message: "请输入问题现象", trigger: "blur" }],
    bind: {
      disabled: true,
      autoSize: {
        minRows: 2,
        maxRows: 4
      }
    }
  }],
  [{
    formLabel: "问题分析",
    formCode: "PROBLEM_REASON",
    formType: 'textarea',
    rules: [{ required: false, message: "请输入问题分析", trigger: "blur" }],
    bind: {
      disabled: true,
      autoSize: {
        minRows: 2,
        maxRows: 4
      }
    }
  }],
  [{
    formLabel: "纠正措施",
    formCode: "CORRECTIVE_MEASURES",
    formType: 'textarea',
    rules: [{ required: false, message: "请输入纠正措施", trigger: "blur" }],
    bind: {
      disabled: true,
      autoSize: {
        minRows: 2,
        maxRows: 4
      }
    }
  }]
]
// 军检活动集中审议
/*
export const baseFormReview = [
  [
    {
      formLabel: "装备名称型号",
      formCode: "EQUIPMENT_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入装备名称型号", trigger: "blur" }]
    },
    {
      formLabel: "装备编号",
      formCode: "EQUIPMENT_NO",
      formType: 'input',
      rules: [{ required: false, message: "请输入装备编号", trigger: "blur" }]
    },
    {
      formLabel: "检验验收依据",
      formCode: "TEST_ACCEPT_BASIS",
      formType: 'input',
      rules: [{ required: false, message: "请输入检验验收依据", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "监管协议编号",
      formCode: "SUPERIVSE_AGREEMENT_NO",
      formType: 'input',
      rules: [{ required: false, message: "请输入监管协议编号", trigger: "blur" }]
    },
    {
      formLabel: "提交验收时间",
      formCode: "SUBMIT_CHECK_ACC_TIME",
      formType: 'input',
      rules: [{ required: false, message: "请输入提交验收时间", trigger: "blur" }]
    },
    {
      formLabel: "检验验收时间",
      formCode: "CHECK_ACC_TIME",
      formType: 'input',
      rules: [{ required: false, message: "请输入检验验收时间", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "检验验收人员工号",
      formCode: "CHECK_ACC_NO",
      formType: 'input',
      rules: [{ required: false, message: "请输入检验验收人员工号", trigger: "blur" }]
    },
    {
      formLabel: "检验验收人员名称",
      formCode: "CHECK_ACC_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入检验验收人员名称", trigger: "blur" }]
    },
    {
      formLabel: "军事代表检验验收结论",
      formCode: "ARMY_REP__CONCLUSION",
      formType: 'input',
      rules: [{ required: false, message: "请输入军事代表检验验收结论", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "审议确认结论",
      formCode: "CONSIDERATION_CON_CONCLUSION",
      formType: 'input',
      rules: [{ required: false, message: "请输入审议确认结论", trigger: "blur" }]
    },
    {
      formLabel: "军事代表室领导(签字)",
      formCode: "ARMY_REP_LEADER_SIGN",
      formType: 'input',
      rules: [{ required: false, message: "请输入军事代表室领导(签字)", trigger: "blur" }]
    },
    {
      formLabel: "军事代表室领导(签字)时间",
      formCode: "ARMY_REP_LEADER_SIGN_TIME",
      formType: 'input',
      rules: [{ required: false, message: "请输入军事代表室领导(签字)时间", trigger: "blur" }]
    }
  ]
]
*/
// 装箱检查
export const baseFormCheck = [
  [
    {
      formLabel: "装箱人编号",
      formCode: "BOX_INTO_PERSON_ID",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱人编号", trigger: "blur" }]
    },
    {
      formLabel: "装箱人名称",
      formCode: "BOX_INTO_PERSON_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱人名称", trigger: "blur" }]
    },
    {
      formLabel: "装箱时间",
      formCode: "BOX_INTO_DATE",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱时间", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "装箱检查人编号",
      formCode: "BOX_CHECK_PERSON_ID",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱检查人编号", trigger: "blur" }]
    },
    {
      formLabel: "装箱检查人名称",
      formCode: "BOX_CHECK_PERSON_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱检查人名称", trigger: "blur" }]
    },
    {
      formLabel: "装箱检查时间",
      formCode: "BOX_CHECK_DATA",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱检查时间", trigger: "blur" }]
    }
  ],
  [
    {
      formLabel: "装箱军代表编号",
      formCode: "BOX_ARMY_REPRESET_ID",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱军代表编号", trigger: "blur" }]
    },
    {
      formLabel: "装箱军代表名称",
      formCode: "BOX_ARMY_REPRESET_NAME",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱军代表名称", trigger: "blur" }]
    },
    {
      formLabel: "装箱军代表查看时间",
      formCode: "BOX_ARMY_REPRESET_DATA",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱军代表查看时间", trigger: "blur" }]
    }
  ],
  [
    // {
    //   formLabel: "装箱检查单",
    //   formCode: "BOX_FORM_TABLE",
    //   formType: 'input',
    //   rules: [{ required: false, message: "请输入装箱检查单", trigger: "blur" }]
    // },
    {
      formLabel: "装箱检查结果",
      formCode: "BOX_CHECK_RESULT",
      formType: 'input',
      rules: [{ required: false, message: "请输入装箱检查结果", trigger: "blur" }]
    },
    {},
    {}
  ]
]