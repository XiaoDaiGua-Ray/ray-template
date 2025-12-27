import { mount } from '@vue/test-utils'
import { printDom } from '../../src/utils/dom'
import renderHook from '../utils/renderHook'

// happy-dom 官方有一个 bug，无法使用 canvas.toDataURL 方法。所以该模块单测暂时无法通过
describe('printDom', () => {
  // let count = 1
  // const domRef = ref<HTMLElement>()
  // const canvas = document.createElement('canvas')
  // canvas.width = 100
  // canvas.height = 100
  // console.log('canvas.toDataURL result', canvas.toDataURL)
  // const wrapper = mount(
  //   defineComponent({
  //     setup() {
  //       const print = () => {
  //         count = 2
  //         printDom(canvas, {
  //           domToImageOptions: {
  //             created: () => {
  //               count = 2
  //             },
  //           },
  //         })
  //       }
  //       return {
  //         domRef,
  //         print,
  //       }
  //     },
  //     render() {
  //       const { print } = this
  //       return (
  //         <>
  //           <div ref="domRef">print html</div>
  //           <button onClick={print.bind(this)}>print</button>
  //         </>
  //       )
  //     },
  //   }),
  // )
  // it('print dom', () => {
  //   const button = wrapper.find('button')
  //   button.trigger('click')
  //   expect(count).toBe(2)
  // })

  it('print dom', () => {})
})
