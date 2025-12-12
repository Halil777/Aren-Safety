import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

export const LANGUAGE_STORAGE_KEY = 'tenant-admin-language'

export const supportedLanguages = [
  { code: 'en', label: 'English', shortLabel: 'EN' },
  { code: 'tr', label: 'Türkçe', shortLabel: 'TR' },
  { code: 'ru', label: 'Русский', shortLabel: 'RU' },
]

const resources = {
  en: {
    translation: {
      layout: {
        brand: 'Tenant Admin',
        subtitle: 'Single-tenant workspace',
        manage: 'Manage',
      },
      nav: {
        dashboard: 'Dashboard',
        users: 'Users',
        observations: 'Observation',
        tasks: 'Tasks',
        supervisors: 'Supervisors',
        source: 'Source',
        projects: 'Projects',
        departments: 'Departments',
        companies: 'Companies',
        categories: 'Categories',
        subcategories: 'Subcategories',
        types: 'Types',
        subscription: 'Subscription',
      },
      categories: {
        tabs: {
          observation: 'Observation Category',
          task: 'Task Category',
        },
        actions: {
          addCategory: 'Add Category',
        },
        table: {
          project: 'Project',
          category: 'Category',
          actions: 'Actions',
          empty: 'No categories yet.',
        },
        form: {
          editTitle: 'Edit category',
          createTitle: 'Add category',
          observationSubtitle: 'Observation category details',
          taskSubtitle: 'Task category details',
          project: 'Project',
          projectPlaceholder: 'Select project',
          name: 'Category name',
        },
      },
      departments: {
        actions: {
          add: 'Add Department',
        },
        table: {
          project: 'Project',
          name: 'Department Name',
          actions: 'Actions',
          empty: 'No departments yet.',
        },
        form: {
          editTitle: 'Edit Department',
          createTitle: 'Add Department',
          subtitle: 'Department details',
          project: 'Project',
          projectPlaceholder: 'Select project',
          name: 'Department name',
        },
      },
      companies: {
        actions: {
          add: 'Add Company',
        },
        table: {
          project: 'Project',
          name: 'Company',
          description: 'Description',
          noDescription: 'No description',
          actions: 'Actions',
          empty: 'No companies yet.',
        },
        form: {
          editTitle: 'Edit Company',
          createTitle: 'Add Company',
          subtitle: 'Company details',
          project: 'Project',
          projectPlaceholder: 'Select project',
          name: 'Company name',
          description: 'Description',
        },
      },
      subcategories: {
        tabs: {
          observation: 'Observation Subcategory',
          task: 'Task Subcategory',
        },
        actions: {
          add: 'Add Subcategory',
        },
        table: {
          project: 'Project',
          category: 'Category',
          subcategory: 'Subcategory',
          actions: 'Actions',
          empty: 'No subcategories yet.',
        },
        form: {
          editTitle: 'Edit subcategory',
          createTitle: 'Add subcategory',
          observationSubtitle: 'Observation subcategory details',
          taskSubtitle: 'Task subcategory details',
          category: 'Category',
          categoryPlaceholder: 'Select category',
          name: 'Subcategory name',
        },
      },
      types: {
        actions: {
          add: 'Add Type',
        },
        table: {
          project: 'Project',
          name: 'Type name',
          description: 'Description',
          noDescription: 'No description',
          actions: 'Actions',
          empty: 'No types yet.',
        },
        form: {
          editTitle: 'Edit Type',
          createTitle: 'Add Type',
          subtitle: 'Type details',
          project: 'Project',
          projectPlaceholder: 'Select project',
          name: 'Type name',
          description: 'Description',
        },
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
      form: {
        email: 'Email',
        password: 'Password',
      },
      auth: {
        errors: {
          generic: 'Unable to sign in. Please try again.',
          inactive: 'Account is not active.',
          sessionExpired: 'Session expired. Please log in again.',
        },
        status: {
          signingIn: 'Signing in...',
        },
      },
      common: {
        cancel: 'Cancel',
      },
      tenant: {
        status: {
          active: 'Active',
          offline: 'Offline',
        },
      },
      pages: {
        login: {
          title: 'Sign in',
          description: 'Access your tenant admin workspace.',
          submit: 'Login',
        },
        subscription: {
          title: 'Subscription',
          description: 'View your trial and billing details.',
        },
        dashboard: {
          title: 'Overview',
          description: 'Track tenant health and key safety metrics.',
        },
        users: {
          title: 'Users',
          description: 'Manage your tenant workforce and permissions.',
        },
        supervisors: {
          title: 'Supervisors',
          description: 'Assign and monitor supervisors across projects.',
        },
        projects: {
          title: 'Projects',
          description: 'Organize tenant projects and assignments.',
        },
        observations: {
          title: 'Observations',
          description: 'Review observations and safety findings.',
        },
        tasks: {
          title: 'Tasks',
          description: 'Track and manage safety tasks.',
        },
        departments: {
          title: 'Departments',
          description: 'Organize teams by department.',
        },
        companies: {
          title: 'Companies',
          description: 'Track partner companies tied to projects.',
        },
        categories: {
          title: 'Categories',
          description: 'Configure observation categories and taxonomy.',
        },
        subcategories: {
          title: 'Subcategories',
          description: 'Manage nested category structures.',
        },
        types: {
          title: 'Types',
          description: 'Define observation or task types.',
        },
        placeholder: 'Content coming soon.',
      },
      support: {
        title: 'Contact support',
        description: 'Send a message to the super admin team.',
        subject: 'Subject',
        subjectPlaceholder: 'Describe the issue briefly',
        message: 'Message',
        messagePlaceholder: 'Explain what happened...',
        send: 'Send message',
        sending: 'Sending...',
        success: 'Message sent. We will reach out shortly.',
        error: 'Could not send message. Please try again.',
        backToLogin: 'Back to login',
        needHelp: 'Need help?',
      },
      subscription: {
        title: 'Subscription',
        description: 'Monitor your trial and billing status.',
        plan: 'Plan: {{plan}}',
        billingStatus: 'Billing status',
        status: 'Platform status',
        trialEnds: 'Trial ends',
        paidUntil: 'Paid until',
        daysLeft: 'Days left',
        days: 'days',
        active: 'Access enabled',
        suspended: 'Access suspended',
        payOnline: 'Pay online (soon)',
        contactSupport: 'Contact support',
        payPlaceholder:
          'Online payment is currently unavailable. Please contact support to renew or request an invoice.',
      },
    },
  },
  tr: {
    translation: {
      layout: {
        brand: 'Kiracı Yönetimi',
        subtitle: 'Tek kiracı çalışma alanı',
        manage: 'Yönet',
      },
      nav: {
        dashboard: 'Genel Bakış',
        users: 'Kullanıcılar',
        observations: 'Gözlem',
        tasks: 'Görevler',
        supervisors: 'Denetçiler',
        source: 'Kaynak',
        projects: 'Projeler',
        departments: 'Departmanlar',
        companies: 'Sirketler',
        categories: 'Kategoriler',
        subcategories: 'Alt kategoriler',
        types: 'Tipler',
        subscription: 'Abonelik',
      },
      categories: {
        tabs: {
          observation: 'Gözlem kategorisi',
          task: 'Görev kategorisi',
        },
        actions: {
          addCategory: 'Kategori ekle',
        },
        table: {
          project: 'Proje',
          category: 'Kategori',
          actions: 'İşlemler',
          empty: 'Henüz kategori yok.',
        },
        form: {
          editTitle: 'Kategoriyi düzenle',
          createTitle: 'Kategori ekle',
          observationSubtitle: 'Gözlem kategorisi detayları',
          taskSubtitle: 'Görev kategorisi detayları',
          project: 'Proje',
          projectPlaceholder: 'Proje seçin',
          name: 'Kategori adı',
        },
      },
      departments: {
        actions: {
          add: 'Departman ekle',
        },
        table: {
          project: 'Proje',
          name: 'Departman adi',
          actions: 'Islemler',
          empty: 'Henuz departman yok.',
        },
        form: {
          editTitle: 'Departmani duzenle',
          createTitle: 'Departman ekle',
          subtitle: 'Departman detaylari',
          project: 'Proje',
          projectPlaceholder: 'Proje secin',
          name: 'Departman adi',
        },
      },
      subcategories: {
        tabs: {
          observation: 'Gozlem alt kategorisi',
          task: 'Gorev alt kategorisi',
        },
        actions: {
          add: 'Alt kategori ekle',
        },
        table: {
          project: 'Proje',
          category: 'Kategori',
          subcategory: 'Alt kategori',
          actions: 'Islemler',
          empty: 'Henuz alt kategori yok.',
        },
        form: {
          editTitle: 'Alt kategoriyi duzenle',
          createTitle: 'Alt kategori ekle',
          observationSubtitle: 'Gozlem alt kategori detaylar?',
          taskSubtitle: 'Gorev alt kategori detaylar?',
          category: 'Kategori',
          categoryPlaceholder: 'Kategori secin',
          name: 'Alt kategori ad?',
        },
      },
      types: {
        actions: {
          add: 'Add Type',
        },
        table: {
          project: 'Project',
          name: 'Type name',
          description: 'Description',
          noDescription: 'No description',
          actions: 'Actions',
          empty: 'No types yet.',
        },
        form: {
          editTitle: 'Edit Type',
          createTitle: 'Add Type',
          subtitle: 'Type details',
          project: 'Project',
          projectPlaceholder: 'Select project',
          name: 'Type name',
          description: 'Description',
        },
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
      form: {
        email: 'Email',
        password: 'Пароль',
      },
      auth: {
        errors: {
          generic: 'Не удалось войти. Попробуйте ещё раз.',
          inactive: 'Аккаунт не активен.',
          sessionExpired: 'Сессия истекла. Войдите снова.',
        },
        status: {
          signingIn: 'Вход...',
        },
      },
      common: {
        cancel: 'Отмена',
      },
      tenant: {
        status: {
          active: 'Активен',
          offline: 'Неактивен',
        },
      },
      pages: {
        login: {
          title: 'Вход',
          description: 'Доступ к панели арендатора.',
          submit: 'Войти',
        },
        subscription: {
          title: 'Подписка',
          description: 'Посмотрите информацию о пробном периоде и оплате.',
        },
        dashboard: {
          title: 'Обзор',
          description: 'Следите за состоянием арендатора и метриками безопасности.',
        },
        users: {
          title: 'Пользователи',
          description: 'Управляйте доступом и разрешениями.',
        },
        supervisors: {
          title: 'Руководители',
          description: 'Назначайте и контролируйте руководителей проектов.',
        },
        projects: {
          title: 'Проекты',
          description: 'Организуйте проекты и команды.',
        },
        observations: {
          title: 'Наблюдения',
          description: 'Просматривайте наблюдения и результаты проверок.',
        },
        categories: {
          title: 'Категории',
          description: 'Настраивайте категории и таксономию наблюдений.',
        },
        placeholder: 'Скоро будет добавлено содержимое.',
      },
      support: {
        title: 'Связаться с поддержкой',
        description: 'Отправьте сообщение супер администратору.',
        subject: 'Тема',
        subjectPlaceholder: 'Кратко опишите проблему',
        message: 'Сообщение',
        messagePlaceholder: 'Опишите, что произошло...',
        send: 'Отправить сообщение',
        sending: 'Отправка...',
        success: 'Сообщение отправлено. Мы свяжемся с вами в ближайшее время.',
        error: 'Не удалось отправить сообщение. Попробуйте ещё раз.',
        backToLogin: 'Назад к входу',
        needHelp: 'Нужна помощь?',
      },
      subscription: {
        title: 'Подписка',
        description: 'Отслеживайте пробный период и оплату.',
        plan: 'План: {{plan}}',
        billingStatus: 'Статус оплаты',
        status: 'Статус доступа',
        trialEnds: 'Окончание пробного периода',
        paidUntil: 'Оплачено до',
        daysLeft: 'Осталось дней',
        days: 'дн.',
        active: 'Доступ включен',
        suspended: 'Доступ приостановлен',
        payOnline: 'Оплатить онлайн (скоро)',
        contactSupport: 'Связаться с поддержкой',
        payPlaceholder:
          'Онлайн-оплата сейчас недоступна. Пожалуйста, свяжитесь с поддержкой для продления или счета.',
      },
    },
  },
  ru: {
    translation: {
      layout: {
        brand: 'Админ арендатора',
        subtitle: 'Рабочее пространство арендатора',
        manage: 'Управление',
      },
      nav: {
        dashboard: 'Панель',
        users: 'Пользователи',
        observations: 'Наблюдения',
        tasks: 'Задачи',
        supervisors: 'Руководители',
        source: 'Источник',
        projects: 'Проекты',
        departments: 'Отделы',
        categories: 'Категории',
        subcategories: 'Подкатегории',
        types: 'Типы',
        subscription: 'Подписка',
      },
      categories: {
        tabs: {
          observation: '��������� ����������',
          task: '��������� �����',
        },
        actions: {
          addCategory: '�������� ���������',
        },
        table: {
          project: '������',
          category: '���������',
          actions: '��������',
          empty: '��������� �����������.',
        },
        form: {
          editTitle: '������������� ���������',
          createTitle: '�������� ���������',
          observationSubtitle: '������ ��������� ����������',
          taskSubtitle: '������ ��������� �����',
          project: '������',
          projectPlaceholder: '�������� ������',
          name: '�������� ���������',
        },
      },
      departments: {
        actions: {
          add: 'Добавить отдел',
        },
        table: {
          project: 'Проект',
          name: 'Название отдела',
          actions: 'Действия',
          empty: 'Отделы пока не добавлены.',
        },
        form: {
          editTitle: 'Редактировать отдел',
          createTitle: 'Добавить отдел',
          subtitle: 'Данные отдела',
          project: 'Проект',
          projectPlaceholder: 'Выберите проект',
          name: 'Название отдела',
        },
      },
      subcategories: {
        tabs: {
          observation: '������������ ����������',
          task: '������������ �����',
        },
        actions: {
          add: '�������� ������������',
        },
        table: {
          project: '������',
          category: '���������',
          subcategory: '������������',
          actions: '��������',
          empty: '������������ ���� ���.',
        },
        form: {
          editTitle: '������������� ������������',
          createTitle: '�������� ������������',
          observationSubtitle: '������ ������������ ����������',
          taskSubtitle: '������ ������������ �����',
          category: '���������',
          categoryPlaceholder: '�������� ���������',
          name: '�������� ������������',
        },
      },
      types: {
        actions: {
          add: 'Add Type',
        },
        table: {
          project: 'Project',
          name: 'Type name',
          description: 'Description',
          noDescription: 'No description',
          actions: 'Actions',
          empty: 'No types yet.',
        },
        form: {
          editTitle: 'Edit Type',
          createTitle: 'Add Type',
          subtitle: 'Type details',
          project: 'Project',
          projectPlaceholder: 'Select project',
          name: 'Type name',
          description: 'Description',
        },
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
      form: {
        email: 'Email',
        password: 'Пароль',
      },
      auth: {
        errors: {
          generic: 'Не удалось войти. Попробуйте ещё раз.',
          inactive: 'Аккаунт не активен.',
          sessionExpired: 'Сессия истекла. Войдите снова.',
        },
        status: {
          signingIn: 'Входим...',
        },
      },
      common: {
        cancel: 'Отмена',
      },
      tenant: {
        status: {
          active: 'Активен',
          offline: 'Не в сети',
        },
      },
      pages: {
        login: {
          title: 'Вход',
          description: 'Получите доступ в рабочее пространство арендатора.',
          submit: 'Войти',
        },
        subscription: {
          title: 'Подписка',
          description: 'Посмотрите данные о пробном периоде и оплате.',
        },
        dashboard: {
          title: 'Обзор',
          description: 'Отслеживайте состояние арендатора и ключевые метрики безопасности.',
        },
        users: {
          title: 'Пользователи',
          description: 'Управляйте сотрудниками и правами доступа.',
        },
        supervisors: {
          title: 'Руководители',
          description: 'Назначайте и контролируйте руководителей по проектам.',
        },
        projects: {
          title: 'Проекты',
          description: 'Организуйте проекты и назначения.',
        },
        observations: {
          title: 'Наблюдения',
          description: 'Просматривайте наблюдения и находки по безопасности.',
        },
        tasks: {
          title: 'Задачи',
          description: 'Отслеживайте и управляйте задачами по безопасности.',
        },
        departments: {
          title: 'Отделы',
          description: 'Организуйте команды по отделам.',
        },
        categories: {
          title: 'Категории',
          description: 'Настройте категории наблюдений и таксономию.',
        },
        subcategories: {
          title: 'Подкатегории',
          description: 'Управляйте вложенной структурой категорий.',
        },
        types: {
          title: 'Типы',
          description: 'Определяйте типы наблюдений или задач.',
        },
        placeholder: 'Скоро появится контент.',
      },
      support: {
        title: 'Связаться с поддержкой',
        description: 'Отправьте сообщение команде суперадминов.',
        subject: 'Тема',
        subjectPlaceholder: 'Кратко опишите проблему',
        message: 'Сообщение',
        messagePlaceholder: 'Что произошло...',
        send: 'Отправить',
        sending: 'Отправляем...',
        success: 'Сообщение отправлено. Мы скоро свяжемся.',
        error: 'Не удалось отправить. Попробуйте ещё раз.',
        backToLogin: 'Назад ко входу',
        needHelp: 'Нужна помощь?',
      },
      subscription: {
        title: 'Подписка',
        description: 'Следите за пробным периодом и оплатой.',
        plan: 'План: {{plan}}',
        billingStatus: 'Статус оплаты',
        status: 'Статус платформы',
        trialEnds: 'Окончание пробного периода',
        paidUntil: 'Оплачено до',
        daysLeft: 'Осталось дней',
        days: 'дн.',
        active: 'Доступ открыт',
        suspended: 'Доступ приостановлен',
        payOnline: 'Оплатить онлайн (скоро)',
        contactSupport: 'Связаться с поддержкой',
        payPlaceholder:
          'Онлайн-оплата пока недоступна. Свяжитесь с поддержкой, чтобы продлить или запросить счёт.',
      },
    },
  },
}

const storedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem(LANGUAGE_STORAGE_KEY) : null
const fallbackLanguage = 'en'
const initialLanguage = storedLanguage ?? fallbackLanguage

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: fallbackLanguage,
  supportedLngs: supportedLanguages.map((item) => item.code),
  interpolation: {
    escapeValue: false,
  },
  keySeparator: '.',
})

export default i18n
