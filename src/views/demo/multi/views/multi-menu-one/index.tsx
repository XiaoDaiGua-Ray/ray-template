import CacheRouteExample from '../../../components/CacheRouteExample'

export default defineComponent({
  name: 'MultiMenuOne',
  render() {
    return (
      <CacheRouteExample
        title={this.$t('showcase.multiOneTitle')}
        description={this.$t('showcase.multiOneDescription')}
      />
    )
  },
})
