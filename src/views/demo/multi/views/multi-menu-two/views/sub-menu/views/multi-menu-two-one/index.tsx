import CacheRouteExample from '../../../../../../../components/CacheRouteExample'

export default defineComponent({
  name: 'MultiMenuTwoOne',
  render() {
    return (
      <CacheRouteExample
        title={this.$t('showcase.multiNestedTitle')}
        description={this.$t('showcase.multiNestedDescription')}
      />
    )
  },
})
