import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const LANGUAGE_STORAGE_KEY = 'super-admin-language'

export const supportedLanguages = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'tr', label: 'Türkçe', shortLabel: 'TR' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU' },
]

const resources = {
  en: {
    translation: {
      layout: {
        brand: 'Super Admin',
        subtitle: 'Platform control center',
        manage: 'Manage',
      },
      nav: {
        dashboard: 'Dashboard',
        tenants: 'Tenants',
        login: 'Login',
        messages: 'Messages',
      },
      theme: {
        label: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      language: {
        label: 'Language',
      },
      pages: {
        dashboard: {
          title: 'Overview',
          description: 'Monitor tenant health and platform-wide activity.',
        },
        tenants: {
          title: 'Tenants',
          description: 'Manage all tenants across the platform.',
        },
        login: {
          title: 'Sign in',
          description: 'Access the super admin workspace.',
          submit: 'Login',
        },
        placeholder: 'Content coming soon.',
      },
      messages: {
        title: 'Support messages',
        description: 'Messages sent by tenants when their panel is blocked.',
        inbox: 'Inbox',
        loading: 'Loading messages...',
        empty: 'No messages yet.',
        from: 'From',
        subject: 'Subject',
        body: 'Message',
        date: 'Received',
        unknownEmail: 'Unknown email',
        unknownTenant: 'Unknown tenant',
      },
      actions: {
        addTenant: 'Add tenant',
      },
      form: {
        email: 'Email',
        password: 'Password',
      },
      common: {
        cancel: 'Cancel',
        loading: 'Loading tenants...',
      },
      tenant: {
        status: {
          active: 'Active',
          trial: 'Trial',
          suspended: 'Suspended',
          disabled: 'Disabled',
        },
        table: {
          fullname: 'Full name',
          email: 'Email',
          phone: 'Phone',
          status: 'Status',
          toggle: 'Toggle status',
          created: 'Created',
          actions: 'Actions',
          edit: 'Edit',
          delete: 'Delete',
          empty: 'No tenants yet',
          confirmDelete: 'Delete {{name}}?',
        },
        form: {
          fullname: 'Full name',
          fullnamePlaceholder: 'Safety Builders LLC',
          email: 'Email',
          password: 'Password',
          passwordPlaceholder: 'Set a secure password',
          passwordOptional: 'Leave blank to keep current password',
          passwordHint: 'Keep the placeholder to retain the current password.',
          optional: 'optional',
          phone: 'Phone number',
          status: 'Status',
          billingStatus: 'Billing status',
          trialEndsAt: 'Trial ends at',
          paidUntil: 'Paid until',
          create: 'Create tenant',
          update: 'Update tenant',
          createTitle: 'Create tenant',
          editTitle: 'Edit tenant',
        },
      },
    },
  },
  tr: {
    translation: {
      layout: {
        brand: 'Süper Yönetici',
        subtitle: 'Platform kontrol merkezi',
        manage: 'Yönet',
      },
      nav: {
        dashboard: 'Panel',
        tenants: 'Kiracılar',
        login: 'Giriş',
        messages: 'Mesajlar',
      },
      theme: {
        label: 'Tema',
        light: 'Açık',
        dark: 'Koyu',
        system: 'Sistem',
      },
      language: {
        label: 'Dil',
      },
      pages: {
        dashboard: {
          title: 'Genel Bakış',
          description: 'Kiracı sağlığını ve platform aktivitelerini izleyin.',
        },
        tenants: {
          title: 'Kiracılar',
          description: 'Platformdaki tüm kiracıları yönetin.',
        },
        login: {
          title: 'Giriş yap',
          description: 'Süper yönetici alanına erişin.',
          submit: 'Giriş',
        },
        placeholder: 'İçerik yakında eklenecek.',
      },
      messages: {
        title: 'Destek mesajları',
        description: 'Paneli engellenen kiracıların gönderdiği mesajlar.',
        inbox: 'Gelen kutusu',
        loading: 'Mesajlar yükleniyor...',
        empty: 'Mesaj yok.',
        from: 'Gönderen',
        subject: 'Konu',
        body: 'Mesaj',
        date: 'Alındı',
        unknownEmail: 'Bilinmeyen e-posta',
        unknownTenant: 'Bilinmeyen kiracı',
      },
      actions: {
        addTenant: 'Kiracı ekle',
      },
      form: {
        email: 'E-posta',
        password: 'Parola',
      },
      common: {
        cancel: 'İptal',
        loading: 'Kiracılar yükleniyor...',
      },
      tenant: {
        status: {
          active: 'Aktif',
          trial: 'Deneme',
          suspended: 'Askıya alındı',
          disabled: 'Devre dışı',
        },
        table: {
          fullname: 'Ad Soyad',
          email: 'E-posta',
          phone: 'Telefon',
          status: 'Durum',
          toggle: 'Durumu değiştir',
          created: 'Oluşturulma',
          actions: 'İşlemler',
          edit: 'Düzenle',
          delete: 'Sil',
          empty: 'Henüz kiracı yok',
          confirmDelete: '{{name}} silinsin mi?',
        },
        form: {
          fullname: 'Ad Soyad',
          fullnamePlaceholder: 'Güvenlik İnşaat AŞ',
          email: 'E-posta',
          password: 'Parola',
          passwordPlaceholder: 'Güçlü bir şifre belirleyin',
          passwordOptional: 'Şifreyi korumak için boş bırakın',
          passwordHint: 'Mevcut şifreyi korumak için yerinde bırakın.',
          optional: 'opsiyonel',
          phone: 'Telefon',
          status: 'Durum',
          billingStatus: 'Faturalandırma durumu',
          trialEndsAt: 'Deneme bitiş tarihi',
          paidUntil: 'Ödeme son tarihi',
          create: 'Kiracı oluştur',
          update: 'Kiracıyı güncelle',
          createTitle: 'Kiracı oluştur',
          editTitle: 'Kiracıyı düzenle',
        },
      },
    },
  },
  ru: {
    translation: {
      layout: {
        brand: 'Супер админ',
        subtitle: 'Центр управления платформой',
        manage: 'Управление',
      },
      nav: {
        dashboard: 'Обзор',
        tenants: 'Арендаторы',
        login: 'Вход',
        messages: 'Сообщения',
      },
      theme: {
        label: 'Тема',
        light: 'Светлая',
        dark: 'Тёмная',
        system: 'Системная',
      },
      language: {
        label: 'Язык',
      },
      pages: {
        dashboard: {
          title: 'Обзор',
          description:
            'Отслеживайте состояние арендаторов и активность платформы.',
        },
        tenants: {
          title: 'Арендаторы',
          description: 'Управляйте всеми арендаторами платформы.',
        },
        login: {
          title: 'Вход',
          description: 'Доступ к рабочему месту супер админа.',
          submit: 'Войти',
        },
        placeholder: 'Скоро будет добавлено содержимое.',
      },
      messages: {
        title: 'Сообщения поддержки',
        description: 'Сообщения от арендаторов при блокировке панели.',
        inbox: 'Входящие',
        loading: 'Загрузка сообщений...',
        empty: 'Сообщений нет.',
        from: 'От',
        subject: 'Тема',
        body: 'Сообщение',
        date: 'Получено',
        unknownEmail: 'Неизвестный email',
        unknownTenant: 'Неизвестный арендатор',
      },
      actions: {
        addTenant: 'Добавить арендатора',
      },
      form: {
        email: 'Email',
        password: 'Пароль',
      },
      common: {
        cancel: 'Отмена',
        loading: 'Загрузка арендаторов...',
      },
      tenant: {
        status: {
          active: 'Активен',
          trial: 'Пробный',
          suspended: 'Приостановлен',
          disabled: 'Отключен',
        },
        table: {
          fullname: 'Имя',
          email: 'Email',
          phone: 'Телефон',
          status: 'Статус',
          toggle: 'Переключить статус',
          created: 'Создан',
          actions: 'Действия',
          edit: 'Редактировать',
          delete: 'Удалить',
          empty: 'Арендаторы отсутствуют',
          confirmDelete: 'Удалить {{name}}?',
        },
        form: {
          fullname: 'Имя',
          fullnamePlaceholder: 'Безопасность Строй',
          email: 'Email',
          password: 'Пароль',
          passwordPlaceholder: 'Задайте надёжный пароль',
          passwordOptional: 'Оставьте пустым чтобы сохранить пароль',
          passwordHint: 'Оставьте поле без изменений, чтобы сохранить пароль.',
          optional: 'необязательное',
          phone: 'Телефон',
          status: 'Статус',
          billingStatus: 'Статус оплаты',
          trialEndsAt: 'Окончание пробного периода',
          paidUntil: 'Оплачено до',
          create: 'Создать арендатора',
          update: 'Обновить арендатора',
          createTitle: 'Создать арендатора',
          editTitle: 'Редактировать арендатора',
        },
      },
    },
  },
}

const storedLanguage =
  typeof window !== 'undefined'
    ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
    : null
const fallbackLanguage = 'en'
const initialLanguage = storedLanguage ?? fallbackLanguage

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: fallbackLanguage,
  supportedLngs: supportedLanguages.map(item => item.code),
  interpolation: {
    escapeValue: false,
  },
  keySeparator: '.',
})

export default i18n
