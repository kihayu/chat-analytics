import { Button } from '@app/components/Button'
import { Platform, PlatformsInfo } from '@pipeline/Platforms'

import { PlatformLogos } from '@assets/PlatformLogos'
import Lock from '@assets/images/icons/lock.svg'
import GitHub from '@assets/images/logos/github.svg'
import '@assets/styles/Landing.less'

interface Props {
  onStart: () => void
}

export const Landing = ({ onStart }: Props) => {
  return (
    <div className="Landing">
      <h1 className="Landing__title">Generate interactive, beautiful and insightful chat analysis reports</h1>
      <div className="Landing__desc">
        <div className="Landing__sameline">
          <p className="Landing__browser">Everything is processed in your browser.</p>
          <span className="Landing__secure">
            <img src={Lock} alt="Lock" />
            <p>No data leaves your device.</p>
          </span>
        </div>
        <br />
        <p>
          Can handle millions of messages and multiple chats. <b>Free and open source ❤️</b>
        </p>
        <br />
        <div className="Landing__platforms-line">
          <span>Supports</span>
          {Object.entries(PlatformsInfo).map(([key, p]) => (
            <div
              className="Landing__platform"
              key={key}
              style={{
                backgroundColor: `hsl(${p.color[0]}, ${p.color[1]}%, ${p.color[2]}%)`,
              }}
            >
              {PlatformLogos[key as Platform]}
            </div>
          ))}
        </div>
      </div>
      <div className="Landing__buttons">
        <Button hueColor={[258, 90, 61]} className="Landing__cta" onClick={onStart}>
          Generate a report
        </Button>
        <Button hueColor={[244, 90, 61]} href={env.isDev ? '/report.html' : '/demo'} target="_blank">
          View Demo
        </Button>
        <Button hueColor={[207, 23, 8]} href="https://github.com/mlomb/chat-analytics" target="_blank">
          <img src={GitHub} alt="" />
          GitHub
        </Button>
      </div>
    </div>
  )
}
