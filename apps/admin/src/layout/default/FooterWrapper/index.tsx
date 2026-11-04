import './index.scss'

export default defineComponent({
  name: 'LayoutFooterWrapper',
  setup() {
    const {
      layout: { copyright },
    } = __APP_CFG__

    return {
      copyright,
    }
  },
  render() {
    return this.copyright ? (
      <div class="layout-footer-wrapper">{this.copyright}</div>
    ) : (
      ''
    )
  },
})
