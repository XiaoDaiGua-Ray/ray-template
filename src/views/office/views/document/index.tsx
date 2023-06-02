/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-22
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { uuid } from '@/utils/hook'

import type { PropType } from 'vue'

const Document = defineComponent({
  name: 'RDocument',
  setup() {
    const editorUUID = uuid()
    const state = reactive({})
    const config = {
      document: {
        fileType: 'docx',
        key: editorUUID,
        title: 'Example Document Title.docx',
        url: 'https://example.com/url-to-example-document.docx',
      },
      documentType: 'word',
      authorization: 'a2122252',
      token: 'a2122252',
      Authorization: 'a2122252',
      editorConfig: {
        lang: 'zh-cn',
      },
    }

    const registerEdtior = () => {
      const uid = uuid(12)
    }

    onMounted(() => {
      nextTick(() => {
        registerEdtior()
      })
    })

    return {
      ...toRefs(state),
      editorUUID,
    }
  },
  render() {
    return <div> </div>
  },
})

export default Document
