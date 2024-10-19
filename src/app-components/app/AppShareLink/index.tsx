import { NAvatar, NTooltip, NFlex } from 'naive-ui'

interface AvatarOptions {
  key: string
  src: string
  tooltip: string
  icon: string
}

export default defineComponent({
  name: 'AppShareLink',
  setup() {
    const avatarOptions: AvatarOptions[] = [
      {
        key: 'ray-js-note',
        src: 'https://note.youdao.com/s/ObWEe2BB',
        tooltip: 'Ray的前端学习笔记',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
      },
      {
        key: 'ray-js-cover',
        src: 'https://note.youdao.com/s/IC8xKPdB',
        tooltip: 'Ray的面试题总结',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
      },
      {
        key: 'ray-template-doc',
        src: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
        tooltip: 'Ray Template Doc',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
      },
      {
        key: 'ray-template-doc-out',
        src: 'https://ray-template.yunkuangao.com/',
        tooltip: 'Ray Template Doc (国内地址)',
        icon: 'https://avatars.githubusercontent.com/u/51957438?v=4',
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
      <NFlex>
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
      </NFlex>
    )
  },
})
