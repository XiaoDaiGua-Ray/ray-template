import { NAvatar, NTooltip, NSpace } from 'naive-ui'

interface AvatarOptions {
  key: string
  src: string
  tooltip: string
  icon: string
}

const RayLink = defineComponent({
  name: 'RayLink',
  setup() {
    const avatarOptions: AvatarOptions[] = [
      {
        key: 'yunhome',
        src: 'https://yunkuangao.me/',
        tooltip: '云之家',
        icon: 'https://yunkuangao.me/wp-content/uploads/2022/05/cropped-cropped-QQ%E5%9B%BE%E7%89%8720220511113928.jpg',
      },
      {
        key: 'yun-cloud-images',
        src: 'https://yunkuangao.com/',
        tooltip: '云图床',
        icon: 'https://yunkuangao.com/images/20170801_005902048_iOS.md.jpg',
      },
      {
        key: 'ray-js-note',
        src: 'https://note.youdao.com/s/ObWEe2BB',
        tooltip: 'Ray的前端学习笔记',
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
      },
      {
        key: 'ray-js-cover',
        src: 'https://note.youdao.com/s/IC8xKPdB',
        tooltip: 'Ray的面试题总结',
        icon: 'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg',
      },
    ]

    const handleLinkClick = (item: AvatarOptions) => {
      window.open(item.src)
    }

    return {
      handleLinkClick,
      avatarOptions,
    }
  },
  render() {
    return (
      <NSpace>
        {this.avatarOptions.map((curr) => (
          <NTooltip>
            {{
              trigger: () => (
                <NAvatar
                  round
                  src={curr.icon}
                  style={['cursor: pointer']}
                  onClick={this.handleLinkClick.bind(this, curr)}
                  objectFit="cover"
                />
              ),
              default: () => curr.tooltip,
            }}
          </NTooltip>
        ))}
      </NSpace>
    )
  },
})

export default RayLink

/**
 *
 * 友链组件
 *
 * 这个组件用作初试模板中, 不喜欢自行删除
 */
