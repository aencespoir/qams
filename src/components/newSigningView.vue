<template>
  <div class="signingView">
    <!-- 按钮区域 -->
    <div class="btnView">
      <a-button :disabled="!isHasSign" :type="getBtnTypeForSign" @click="activeSin = 'sign'">签字</a-button>
      <a-button :disabled="!isHasSignature" class="btnStyle" :type="getBtnTypeForSignature" @click="activeSin = 'signature'">签章</a-button>
      <a-button :disabled="(!isHasSign && !isHasSignature) || $lodash.isEmpty(offsetData)" type="primary" icon="save" @click="saveSignInfo" :loading="saveLoading">保存</a-button>
    </div>
    <!-- iframe 嵌套 PDF文件 -->
    <div class="iframe-view">
      <template v-if="filePath">
        <iframe ref="signIframe" :src="getNewIframeUrl" frameborder="1" width="100%" height="100%" />
      </template>
      <template v-else>
        <a-empty style="margin-top:30px;"></a-empty>
      </template>
    </div>
    <!-- NOTE 新签字 / 签章尺寸: 276 * 98 => 90 / 31.95 -->
    <!-- 签章 -->
    <div class="signatureView" ref="signatureRef">
      <img style="width:90px;" :src="signatureImg" alt="">
    </div>
    <!-- 签字 -->
    <div class="signView" ref="signRef">
      <img style="width:90px;" :src="signImg" alt="">
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'
import { getPersonSignInfoApi, getFileUrlApi, saveSignatureApi, fileSignEncApi } from '@api'
export default {
  name: 'SigningView',
  data() {
    return {
      activeSin: null,
      saveLoading: false,
      isHasSignature: false, // 显示签章按钮
      isHasSign: false, // 显示签字按钮
      // iframe 展示比例(用于判断是否在同一比例下进行签章/签字操作)
      originScale: null,
      activeScale: null,
      imageQM: '',
      imageQZ: '',
      // 创建的 div-DOM
      c: '',
      // 签章清除标识
      uuid: 0,
      // PDF 单页尺寸信息
      pageEleInfo: null,
      iframeHtmlBesicUrl: '/portal/apps/com.awspaas.user.apps.app202206219731/static/pdf/web/viewer.html?file=',
      iframeUrl: '', // iframe 路径

      // 测试数据
      // iframeHtmlBesicUrl: '/static/pdf/web/viewer.html?file=',
      // iframeUrl: '/static/aws/index.pdf',
      filePath: '', // 文件路径
      offsetData: [], // 签字 / 签章集合
      fileId: JSON.parse(localStorage.getItem('fileId')) || '', // 文件 ID
      fileStage: JSON.parse(localStorage.getItem('fileStage')) || null, // 文件提交类型

      // 测试数据
      // signImg: 'http://192.168.30.241:8080/static/images/rt.png',
      // signatureImg: 'http://192.168.30.241:8080/static/images/kc0303.png'
      signImg: '', // 签字图片
      signatureImg: '' // 签章图片
    }
  },
  components: {},
  computed: {
    // 获取签章按钮类型
    getBtnTypeForSignature() {
      return this.activeSin === 'signature' ? 'primary' :'link'
    },
    // 获取签字按钮类型
    getBtnTypeForSign() {
      return this.activeSin === 'sign' ? 'primary' :'link'
    },
    // 计算最新 iframe 路径
    getNewIframeUrl() {
      return this.iframeHtmlBesicUrl + this.iframeUrl
    }
  },
  watch: {
    // 监听 iframe 地址
    iframeUrl: {
      handler(val) {
        if (val) {
          const _this = this
          _this.$nextTick(() => {
            setTimeout(() => {
              window.frames[0].document.onclick = function(el) {
                // 清除签章
                _this.deleteSign(el)
                _this.getNewScaleInfo(el)
                // 判断是否在 PDF 页面上进行操作
                if (el.path[1].className === 'page' || el.path[2].className === 'page') {
                  if (_this.activeSin) {
                    _this.setDomELement(el)
                  } else {
                    _this.$message.warning('请在右上角选择您要签字或签章再进行此操作!')
                  }
                }
              }
            }, 1000)
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    // 获取登录人 签章/签字 信息
    getPersonSignInfo() {
      const params = {
        userId: this.$store.getters.getUidVal
        // userId: 'admin'
      }
      getPersonSignInfoApi(params).then(resp => {
        try {
          const respData = resp.data.data.data
          if (respData.SIGNWORD || respData.SIGNSEAL) {
            respData.SIGNWORD ? this.isHasSign = true : this.isHasSign = false // 签字
            respData.SIGNSEAL ? this.isHasSignature = true : this.isHasSignature = false // 签章
            this.signImg = respData.SIGNWORD
            this.signatureImg = respData.SIGNSEAL
          } else {
            this.isHasSignature = false
            this.isHasSign = false
          }
        } catch {
          this.isHasSignature = false
          this.isHasSign = false
          this.$message.error('当前登录人暂无签章信息, 请联系系统管理员!')
        }
      })
    },
    // 添加水印
    async addWaterMarkQM() {
      await html2canvas(this.$refs.signRef, {
        width: this.$refs.signRef.clientWidth,
        height: this.$refs.signRef.clientHeight,
        backgroundColor: null
      }).then(canvas => {
        this.imageQM = canvas.toDataURL('image/png')
      })
    },
    async addWaterMarkQZ() {
      await html2canvas(this.$refs.signatureRef, {
        width: this.$refs.signatureRef.clientWidth,
        height: this.$refs.signatureRef.clientHeight,
        backgroundColor: null
      }).then(canvas => {
        this.imageQZ = canvas.toDataURL('image/png')
      })
    },
    // 获取 PDF 文件
    getPDFFileInfo() {
      const params = {
        sid: this.$store.getters.getSidVal,
        fileId: this.fileId,
        fileStage: this.fileStage
      }
      getFileUrlApi(params).then(resp => {
        try {
          const respData = resp.data.data.data
          this.filePath = respData.url
          // this.iframeUrl = '/portal/file/stream?filePath='
          this.iframeUrl = '%2Fportal%2Ffile%2Fstream%3FfilePath%3D' + encodeURIComponent(encodeURIComponent(respData.url))
        } catch {
          this.iframeUrl = ''
          this.$message.error('获取文件失败!')
        }
      }).catch(() => {
        this.iframeUrl = ''
        this.$message.error('获取文件失败!')
      })
    },
    // 签章完成后调用
    fileSignEnc() {
      const params = {
        fileId: this.fileId,
        fileStage: this.fileStage
      }
      fileSignEncApi(params).then(() => {})
    },
    // => 删除签章/签名
    deleteSign(el) {
      if (el.target.className === 'signChapterStyleIcon') {
        this.$lodash.cloneDeep(this.offsetData).forEach((item, index) => {
          if (item.uuid.toString() === el.target.attributes[1].value) {
            this.offsetData.splice(index, 1)
          }
        })
        el.target.parentNode.parentNode.remove()
      }
    },
    // => 清除不同比例pdf上的签章
    getNewScaleInfo(el) {
      const activeScale = el.target.ownerDocument.body.firstElementChild.children[1].children[2].children[0].children[0].children[2].children[1].children[0].value
      this.activeScale = activeScale
    },
    // 签章 / 签字操作
    setDomELement(el) {
      if (this.activeScale !== this.originScale) {
        this.offsetData = []
        this.originScale = this.activeScale
      }
      var [DomElement, pageNumber, str, DOM_X, DOM_Y] = ['', null, '', '', '']
      for (const key in el.path) {
        if (el.path[key].className === 'page') {
          pageNumber = el.path[key].dataset.pageNumber
        }
        if (el.path[key].className === 'textLayer') {
          DomElement = el.path[key]
        }
      }
      // 获取鼠标点击坐标
      if (el.path[0].className !== 'textLayer') {
        DOM_X = Math.round(Number(el.target.style.left.replace(/px/g, ''))) + el.offsetX
        DOM_Y = Math.round(Number(el.target.style.top.replace(/px/g, ''))) + el.offsetY
      } else {
        DOM_X = el.offsetX
        DOM_Y = el.offsetY
      }
      this.pageEleInfo = DomElement
      // 添加水印操作
      this.c = document.createElement('div')
      this.c.className = 'coverSign'
      this.c.style.position = 'realValue'
      this.c.style.left = DOM_X + 'px'
      this.c.style.top = DOM_Y + 'px'
      this.c.style.whiteSpace = 'nowrap'
      // 根据类型进行添加
      if (this.activeSin === 'signature') {
        str = `
          <div class="signChapterStyle" ref="signatureRef" style="transform-origin: 0% 0%;transform:scale(${(DomElement.clientHeight / 1122)});">
            <img style="width:90px;" src="${this.signatureImg}" alt="">
            <span class="signChapterStyleIcon" content="${this.uuid}">x</span>
          </div>
        `
        this.c.innerHTML = str
      } else {
        str = `
        <div class="signChapterStyle" ref="signRef" style="transform-origin: 0% 0%;transform:scale(${(DomElement.clientHeight / 1122)});">
          <img style="width:90px;" src="${this.signImg}" alt="">
          <span class="signChapterStyleIcon" content="${this.uuid}">x</span>
        </div>
        `
        this.c.innerHTML = str
      }
      // 储存当前点击的坐标集合
      this.offsetData.push({
        x: parseFloat(DOM_X).toString(),
        y: this.activeSin === 'signature' ? parseFloat(DomElement.clientHeight - DOM_Y - Math.round(this.$refs.signatureRef.clientHeight * (DomElement.clientHeight / 1122))).toString() : parseFloat(DomElement.clientHeight - DOM_Y - Math.round(this.$refs.signRef.clientHeight * (DomElement.clientHeight / 1122))).toString(),
        page: parseFloat(pageNumber),
        type: this.activeSin === 'signature' ? 'signature' : 'autograph',
        upperRightX: DomElement.clientWidth,
        upperRightY: DomElement.clientHeight,
        uuid: this.uuid // 作为删除节点判断
      })
      DomElement.appendChild(this.c)
      this.uuid += 1
    },
    // 保存签章文件
    saveSignInfo() {
      const _this = this
      // 当存在签章/签字的 PDF , 切换比同比例时, 清除原有签章/签字数据
      if (_this.originScale !== _this.activeScale) {
        _this.offsetData = []
      }
      if(_this.saveLoading) return
      _this.$confirm({
        title: '保存签章文件',
        content: '是否确认保存当前签章内容?',
        onOk() {
          _this.saveLoading = true
          // console.log('当前签章信息: ', _this.offsetData)
          return new Promise((resolve) => {
            _this.signatureApi(resolve)
          })
        },
        onCancel() {
          _this.saveLoading = false
        }
      })
    },
    async signatureApi(resolve) {
      const _this = this
      await _this.addWaterMarkQM()
      await _this.addWaterMarkQZ()
      const offsetDataClone = _this.$lodash.cloneDeep(_this.offsetData).map(el => {
        return {
          x: el.x,
          y: el.y,
          page: el.page,
          type: el.type,
          upperRightX: el.upperRightX,
          upperRightY: el.upperRightY
        }
      })
      const scaleXY = (_this.pageEleInfo.clientHeight / 1122)
      const params = {
        userId: _this.$store.getters.getUidVal,
        fileId: _this.fileId,
        path: _this.filePath,
        fileStage: _this.fileStage,
        image: [...offsetDataClone],
        file: {
          autograph: _this.imageQM.split('data:image/png;base64,')[1], // 签名图片
          autographX: (_this.$refs.signRef.clientWidth * scaleXY), // 签名图片宽
          autographY: (_this.$refs.signRef.clientHeight * scaleXY), // 签名图片高
          signature: _this.imageQZ.split('data:image/png;base64,')[1], // 签章图片
          signatureX: (_this.$refs.signatureRef.clientWidth * scaleXY), // 签章图片宽
          signatureY: (_this.$refs.signatureRef.clientHeight * scaleXY) // 签章图片高
        }
      }
      saveSignatureApi({ signature: params }).then((resp) => {
        try {
          if (resp.data.result === 'ok') {
            _this.$message.success('保存成功!')
          } else {
            _this.$message.success(resp.data.message)
          }
          _this.activeSin = null
          _this.saveLoading = false
          _this.offsetData = []
          _this.getPDFFileInfo()
          resolve()
        } catch {
          _this.saveLoading = false
          _this.$message.error('保存失败!')
          resolve()
        }
      }).catch(() => {
        _this.$message.error('保存失败!')
        _this.saveLoading = false
        resolve()
      })
    }
  },
  async created() {
    await this.getPersonSignInfo()
    await this.getPDFFileInfo()
  }
}
</script>

<style lang="less" scoped>
.signingView {
  width: 100%;
  position: relative;
  overflow: hidden;
  .btnView {
    width: 100%;
    height: auto;
    padding: 20px 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .btnStyle {
      margin: 0 30px;
    }
  }
  .iframe-view {
    width: 100%;
    height: 800px;
    max-height: 800px;
    background: #ccc;
  }
  .signatureView {
    position: absolute;
    top: -35px;
    // top: 0;
    left: 0;
  }
  .signView {
    position: absolute;
    top: -90px;
    // top: 0;
    left: 150px;
    display: flex;
    align-items: center;
  }
}
</style>
