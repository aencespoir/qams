export default {
  // 获取任务详情id
  getTaskVal: (state) => {
    return state.taskVal
  },
  // 获取用户ＩＤ
  getUidVal: (state) => {
    return state.uid || null
  },
  // 获取sessionId
  getSidVal: (state) => {
    return state.sid || null
  },
  // 获取当前角色
  getJdbroleIdVal: (state) => {
    return state.jdbroleId || null
  },
  // 获取军代表角色
  getJdbroleIdStandardVal: (state) => {
    return state.army_represend_uuid || undefined
  },
  // 获取当前组织
  getJdborgIdVal: (state) => {
    return state.jdborgId || null
  },
  // 获取军代表组织
  getJdborgIdStandardVal: (state) => {
    return state.army_represend_org_uuid || undefined
  },
}