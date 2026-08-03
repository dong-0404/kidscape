import { playSteps } from '../../homeData.js'
import { SoundIcon } from './Icons.jsx'
import Reveal from '../../motion/Reveal.jsx'
import Stagger from '../../motion/Stagger.jsx'
import StaggerItem from '../../motion/StaggerItem.jsx'

// "Cách chơi đơn giản 3 bước" — card lớn, pill tiêu đề đè lên mép trên.
export default function HowToPlay() {
  return (
    <section className="k-section" id="huong-dan">
      <div className="container">
        <Reveal className="k-panel">
          <span className="k-pill k-pill--blue k-panel__pill">Cách chơi đơn giản 3 bước</span>
          <p className="k-panel__sub">
            Bé tự chơi được ngay từ lần đầu — ba mẹ chỉ cần ngồi cạnh và cùng lắng nghe.
          </p>

          <Stagger className="k-steps" gap={0.12}>
            {playSteps.map((s, i) => (
              <StaggerItem key={s.n} className="k-steps__cell">
                <article className={`k-step k-step--${s.tone}`}>
                  <div className="k-step__media">
                    <img src={s.img} alt={s.title} loading="lazy" width="560" height="410" />
                    <span className="k-step__num">{s.n}</span>
                    {s.n === 3 && (
                      <span className="k-step__sound" aria-hidden="true">
                        <SoundIcon width="18" height="18" />
                      </span>
                    )}
                  </div>
                  <h3 className="k-step__title">{s.title}</h3>
                  <p className="k-step__desc">{s.desc}</p>
                </article>
                {i < playSteps.length - 1 && (
                  <span className="k-steps__arrow" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="26" height="26">
                      <path
                        d="m9 5 7 7-7 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>
      </div>
    </section>
  )
}
