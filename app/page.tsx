import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import styles from './page.module.css'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              공동육아 어린이집<br />
              <span className={styles.heroAccent}>지출 관리 시스템</span>
            </h1>
            <p className={styles.heroDesc}>
              지출 신청·승인·증빙을 디지털로 전환합니다.<br />
              소위별 예산 집행 현황을 실시간으로 파악하고,<br />
              조합원 전체의 재정 투명성을 확보합니다.
            </p>
            <div className={styles.heroCta}>
              <Link href="/auth/login" className={styles.ctaPrimary}>
                시작하기
              </Link>
              <Link href="/auth/register" className={styles.ctaSecondary}>
                회원가입
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.process}>
          <div className={styles.processInner}>
            <h2 className={styles.sectionTitle}>지출 승인 프로세스</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">1</div>
                <h3 className={styles.stepTitle}>지출 신청</h3>
                <p className={styles.stepDesc}>
                  조합원·교사가 지출 신청서를 작성하고
                  영수증을 첨부합니다.
                </p>
              </div>
              <div className={styles.stepArrow} aria-hidden="true">→</div>
              <div className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">2</div>
                <h3 className={styles.stepTitle}>재정이사 승인</h3>
                <p className={styles.stepDesc}>
                  재정이사가 내용을 검토하고
                  승인 또는 반려합니다.
                </p>
              </div>
              <div className={styles.stepArrow} aria-hidden="true">→</div>
              <div className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">3</div>
                <h3 className={styles.stepTitle}>지출 완료</h3>
                <p className={styles.stepDesc}>
                  원장이 실제 결제를 처리하고
                  지출 완료 확인을 합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.featuresInner}>
            <h2 className={styles.sectionTitle}>주요 기능</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} aria-hidden="true">📋</div>
                <h3 className={styles.featureTitle}>디지털 지출 신청</h3>
                <p className={styles.featureDesc}>구두·수기 대신 온라인 신청서와 증빙 파일 첨부</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} aria-hidden="true">✅</div>
                <h3 className={styles.featureTitle}>사전 승인 체계</h3>
                <p className={styles.featureDesc}>사후 처리 없이 지출 전 재정이사 승인 필수</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} aria-hidden="true">📊</div>
                <h3 className={styles.featureTitle}>실시간 현황 조회</h3>
                <p className={styles.featureDesc}>소위별 지출 현황과 처리 상태를 실시간 확인</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon} aria-hidden="true">🔒</div>
                <h3 className={styles.featureTitle}>역할 기반 접근 제어</h3>
                <p className={styles.featureDesc}>조합원·교사·재정이사·관리자 역할별 권한 분리</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>© 2026 공동육아 어린이집 지출 관리 시스템</p>
      </footer>
    </>
  )
}
