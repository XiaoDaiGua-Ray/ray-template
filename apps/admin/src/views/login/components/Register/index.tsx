import { NAlert } from 'naive-ui'

export default defineComponent({
  name: 'RRegister',
  render() {
    return (
      <NAlert type="info" title={this.$t('views.login.index.Register')}>
        {this.$t('views.login.index.RegisterHint')}
      </NAlert>
    )
  },
})
