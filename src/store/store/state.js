export default {
  taskVal: null, // 任务详情
  uid: JSON.parse(localStorage.getItem('uid')) || null, // 用户 ID
  sid: JSON.parse(localStorage.getItem('sid')) || null, // 用户 sessionId
  jdbroleId: JSON.parse(localStorage.getItem('jdbroleId')) || null, // 角色
  army_represend_uuid: JSON.parse(localStorage.getItem('army_represend_uuid')) || undefined, // 军代表角色
  jdborgId: JSON.parse(localStorage.getItem('jdborgId')) || null, // 组织
  army_represend_org_uuid: JSON.parse(localStorage.getItem('army_represend_org_uuid')) || undefined // 军代表组织
}