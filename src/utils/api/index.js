import ajax from './ajax'
// 生产地址
const sid = JSON.parse(localStorage.getItem('sid')) || null
const baseUrl = `/portal/r/w?sid=${sid}&cmd=`

// 测试地址
// const baseUrl = `/api/portal/r/w?sid=58e53bd8-524c-4c4a-99c8-26a72a48d9be&cmd=`

const FuncApi = {
  get: function (url, params) {
    return ajax.get((baseUrl + url), params)
  },
  post: function (url, params) {
    return ajax.post(url, params)
  }
}

/**
 * 获取结构树(BOM树)
 * @param { productType } - Number :产品类型  ---> 1,2,3,4
 * @param { productState } - Number :产品状态  ---> 1,2,3
 */
export function getTreeDataApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.processTree', params)
}

/**
 * BOM树节点 --> 查看详情
 * @param { processId } - String
 * @param { productNO } - String
 * @param { batchNO } - String
 */
export function getTreeNodeDetailApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.getProcessDefinition', params)
}

/**
 * 获取任务节点详情
 * @param { no } - int 
 * @param { processId } - String 
 * @param { taskInst } - String 
 * @param { userId } - String 
 */
export function getTaskNodeDataApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.getNodeData', params)
}

/**
 * 获取问题表单
 * @param { problemIds } - String []
 */
export function getProblemFormApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.productProblem', params)
}

/**
 * 获取问题DW
 * @param { problemIds } - String []
 */
export function getProblemDWApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.getProblemDW', params)
}

/**
 * 获取消息通知列表
 * @param { userId } - String
 */
export function getMessageListApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.msgList', params)
}

/**
 * 获取消息已读
 * @param { userId } - String
 * @param { msgId } - String
 */
export function getMessageReadApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.readMsg', params)
}

/**
 * 获取当前登陆人签章/签字信息
 * @param { userId } - 用户 ID
 */
export function getPersonSignInfoApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.getSignatureInfo', params)
}

/**
 * 获取签章/签字 PDF 文件
 * @param { sid } - sessionId
 * @param { fileId } - 文件 ID
 */
export function getFileUrlApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.filePdfUrl', params)
}

/**
 * 文件预览
 * @param { sid } - sessionId
 * @param { fileId } - 文件 ID
 * @param { fileStage } - 文件类型: 1.所检文件,  2.军检文件
 */
export function getFilePreviewApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.filePreview', params)
}

/**
 * 签章保存
 * @param { userId } - userId
 * @param { fileId } - 文件 ID
 * @param { path } - 文件路径
 * @param { image } - 签章信息, 数组
 * @param { file } - 签章/签字图片信息
 */
export function saveSignatureApi(params = {}) {
  // return FuncApi.post('/portal/api/signature', params)
  return FuncApi.get('com.awspaas.user.apps.app202206219731.signature', params)
}

/**
 * 签章后
 * @param { fileId } - 文件 ID
 * @param { fileStage } - 文件类型
 */
export function fileSignEncApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.fileEnc', params)
}

/**
 * 文件下载
 * @param { ids } - String []
 */
export function downloadFileApi(params = {}) {
  return FuncApi.get('com.awspaas.user.apps.app202206219731.getFileZip', params)
}