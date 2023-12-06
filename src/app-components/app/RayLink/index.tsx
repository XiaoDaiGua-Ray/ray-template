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
        icon: 'https://r2chevereto.yka.moe/avatar.jpeg',
      },
      {
        key: 'yun-cloud-images',
        src: 'https://yunkuangao.com/',
        tooltip: '云图床',
        icon: 'https://r2chevereto.yka.moe/avatar.jpeg',
      },
      {
        key: 'ray-js-note',
        src: 'https://note.youdao.com/s/ObWEe2BB',
        tooltip: 'Ray的前端学习笔记',
        icon: 'https://r2chevereto.yka.moe/longmao.navigator.png',
      },
      {
        key: 'ray-js-cover',
        src: 'https://note.youdao.com/s/IC8xKPdB',
        tooltip: 'Ray的面试题总结',
        icon: 'https://r2chevereto.yka.moe/longmao.navigator.png',
      },
      {
        key: 'ray-template-doc',
        src: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
        tooltip: 'Ray Template Doc',
        icon: 'https://r2chevereto.yka.moe/longmao.navigator.png',
      },
      {
        key: 'ray-template-doc-out',
        src: 'https://ray-template.yunkuangao.com/',
        tooltip: 'Ray Template Doc (国内地址)',
        icon: 'https://r2chevereto.yka.moe/longmao.navigator.png',
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
          <NTooltip key={curr.key}>
            {{
              trigger: () => (
                <NAvatar
                  round
                  src={curr.icon}
                  style={['cursor: pointer']}
                  {...{
                    onClick: this.handleLinkClick.bind(this, curr),
                  }}
                  objectFit="cover"
                  size={24}
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
