import CacheRouteExample from '../../../../../components/CacheRouteExample'

export default defineComponent({
  name: 'SubMenuOther',
  render() {
    return (
      <CacheRouteExample
        title={this.$t('showcase.multiOtherTitle')}
        description={this.$t('showcase.multiOtherDescription')}
      />
    )
  },
})
