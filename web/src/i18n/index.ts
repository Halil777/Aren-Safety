import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const supported = ['en', 'tr', 'ru'] as const
export type Lang = typeof supported[number]

function detect(): Lang {
  try {
    const s = localStorage.getItem('lang')
    if (s && (supported as readonly string[]).includes(s)) return s as Lang
  } catch {}
  const nav = (navigator.language || 'en').slice(0, 2)
  if ((supported as readonly string[]).includes(nav)) return nav as Lang
  return 'en'
}

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', about: 'About', contact: 'Contact', demo: 'Request demo' },
      hero: {
        title: 'Safety, Compliance, and Operations — Smarter with Aren Safety',
        subtitle: 'Modular HSE platform for permits, training, incidents, and audits.',
        cta: 'Request a demo'
      },
      features: {
        title: 'Platform Capabilities',
        items: [
          { title: 'HSE Dashboard', desc: 'KPIs, compliance status, and actions in one view.' },
          { title: 'Permit-to-Work', desc: 'Digital workflows with approvals and audit trails.' },
          { title: 'Training & Certs', desc: 'Assign, track, and verify workforce competency.' },
          { title: 'Incident Reporting', desc: 'Capture, investigate, and prevent recurrences.' }
        ]
      },
      cta: { title: 'Ready to elevate safety?', subtitle: 'Let’s tailor Aren Safety to your operations.', action: 'Talk to us' },
      about: { title: 'About Aren Safety', body: 'Aren Safety helps teams build a proactive safety culture with modern software and thoughtful UX.' },
      contact: { title: 'Contact', subtitle: 'Tell us about your goals — we will reach you within one business day.', send: 'Send' }
    }
  },
  tr: {
    translation: {
      nav: { home: 'Ana sayfa', about: 'Hakkımızda', contact: 'İletişim', demo: 'Demo iste' },
      hero: {
        title: 'Güvenlik, Uyum ve Operasyonlar — Aren Safety ile daha akıllı',
        subtitle: 'İSG yönetimi, izin, eğitim, olay ve denetimler için modüler platform.',
        cta: 'Demo iste'
      },
      features: {
        title: 'Platform Yetenekleri',
        items: [
          { title: 'İSG Paneli', desc: 'Tüm KPI, uyum durumu ve aksiyonlar tek ekranda.' },
          { title: 'Çalışma İzni', desc: 'Onay ve denetim izleriyle dijital iş akışları.' },
          { title: 'Eğitim & Sertifika', desc: 'Yetkinlik atama, takip ve doğrulama.' },
          { title: 'Olay Bildirimi', desc: 'Kaydet, incele ve tekrarını önle.' }
        ]
      },
      cta: { title: 'Güvenliği yükseltmeye hazır mısınız?', subtitle: 'Aren Safety’yi operasyonlarınıza uyduralım.', action: 'Bizimle konuşun' },
      about: { title: 'Aren Safety Hakkında', body: 'Aren Safety, modern yazılım ve özenli arayüzlerle proaktif güvenlik kültürü oluşturmanıza yardımcı olur.' },
      contact: { title: 'İletişim', subtitle: 'Hedeflerinizi anlatın — bir iş günü içinde dönüş yapalım.', send: 'Gönder' }
    }
  },
  ru: {
    translation: {
      nav: { home: 'Главная', about: 'О нас', contact: 'Контакты', demo: 'Запросить демо' },
      hero: {
        title: 'Безопасность, комплаенс и операции — умнее с Aren Safety',
        subtitle: 'Модульная платформа для охраны труда, разрешений, обучения и аудитов.',
        cta: 'Запросить демо'
      },
      features: {
        title: 'Возможности платформы',
        items: [
          { title: 'HSE Дашборд', desc: 'KPI, статус соответствия и действия в одном месте.' },
          { title: 'Разрешения на работу', desc: 'Цифровые процессы с согласованиями и аудитом.' },
          { title: 'Обучение и сертификаты', desc: 'Назначение, контроль и проверка компетенций.' },
          { title: 'Инциденты', desc: 'Фиксация, расследование и предотвращение повторов.' }
        ]
      },
      cta: { title: 'Готовы повысить безопасность?', subtitle: 'Адаптируем Aren Safety под ваши процессы.', action: 'Связаться с нами' },
      about: { title: 'Об Aren Safety', body: 'Aren Safety помогает командам выстроить проактивную культуру безопасности с помощью современного ПО и отличного UX.' },
      contact: { title: 'Контакты', subtitle: 'Опишите цели — свяжемся в течение рабочего дня.', send: 'Отправить' }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detect(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  })

export const languages = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' },
  { code: 'ru', label: 'RU' }
] as const

export default i18n

