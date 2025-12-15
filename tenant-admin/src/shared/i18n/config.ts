import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const LANGUAGE_STORAGE_KEY = "tenant-admin-language";

export const supportedLanguages = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "tr", label: "Türkçe", shortLabel: "TR" },
  { code: "ru", label: "Русский", shortLabel: "RU" },
];

const resources = {
  en: {
    translation: {
      layout: {
        brand: "Tenant Admin",
        subtitle: "Single-tenant workspace",
        manage: "Manage",
      },
      nav: {
        dashboard: "Dashboard",
        users: "Users",
        observations: "Observations",
        tasks: "Tasks",
        supervisors: "Supervisors",
        source: "Sources",
        projects: "Projects",
        departments: "Departments",
        companies: "Companies",
        locations: "Locations",
        categories: "Categories",
        subcategories: "Subcategories",
        types: "Types",
        subscription: "Subscription",
      },
      common: {
        cancel: "Cancel",
        save: "Save",
        create: "Create",
        actions: "Actions",
        noData: "No data available.",
      },
      theme: {
        label: "Theme",
        light: "Light",
        dark: "Dark",
        system: "System",
      },
      language: {
        label: "Language",
      },
      form: {
        email: "Email",
        password: "Password",
        name: "Name",
        description: "Description",
      },
      auth: {
        errors: {
          generic: "Unable to sign in. Please try again.",
          inactive: "Account is not active.",
          sessionExpired: "Session expired. Please log in again.",
        },
        status: {
          signingIn: "Signing in...",
        },
      },
      tenant: {
        status: {
          active: "Active",
          offline: "Offline",
        },
      },
      pages: {
        login: {
          title: "Sign in",
          description: "Access your tenant admin workspace.",
          submit: "Login",
        },
        dashboard: {
          title: "Overview",
          description: "Track tenant health and key safety metrics.",
        },
        users: {
          title: "Users",
          description: "Manage your tenant workforce and permissions.",
        },
        supervisors: {
          title: "Supervisors",
          description: "Assign and monitor supervisors across projects.",
        },
        projects: {
          title: "Projects",
          description: "Organize tenant projects and assignments.",
        },
        observations: {
          title: "Observations",
          description: "Review observations and safety findings.",
        },
        tasks: {
          title: "Tasks",
          description: "Track and manage safety tasks.",
        },
        departments: {
          title: "Departments",
          description: "Organize teams by department.",
        },
        companies: {
          title: "Companies",
          description: "Track partner companies tied to projects.",
        },
        locations: {
          title: "Locations",
          description: "Manage physical locations.",
        },
        categories: {
          title: "Categories",
          description: "Configure observation categories and taxonomy.",
        },
        subcategories: {
          title: "Subcategories",
          description: "Manage nested category structures.",
        },
        types: {
          title: "Types",
          description: "Define observation or task types.",
        },
        subscription: {
          title: "Subscription",
          description: "View your trial and billing details.",
        },
        placeholder: "Content coming soon.",
      },
      categories: {
        tabs: {
          observation: "Observation Category",
          task: "Task Category",
        },
        actions: { addCategory: "Add Category" },
        table: {
          project: "Project",
          category: "Category",
          actions: "Actions",
          empty: "No categories yet.",
        },
        form: {
          editTitle: "Edit category",
          createTitle: "Add category",
          observationSubtitle: "Observation category details",
          taskSubtitle: "Task category details",
          project: "Project",
          projectPlaceholder: "Select project",
          name: "Category name",
        },
      },
      subcategories: {
        tabs: {
          observation: "Observation Subcategory",
          task: "Task Subcategory",
        },
        actions: { add: "Add Subcategory" },
        table: {
          project: "Project",
          category: "Category",
          subcategory: "Subcategory",
          actions: "Actions",
          empty: "No subcategories yet.",
        },
        form: {
          editTitle: "Edit subcategory",
          createTitle: "Add subcategory",
          observationSubtitle: "Observation subcategory details",
          taskSubtitle: "Task subcategory details",
          category: "Category",
          categoryPlaceholder: "Select category",
          name: "Subcategory name",
        },
      },
      departments: {
        actions: { add: "Add Department" },
        table: {
          project: "Project",
          name: "Department Name",
          actions: "Actions",
          empty: "No departments yet.",
        },
        form: {
          editTitle: "Edit Department",
          createTitle: "Add Department",
          subtitle: "Department details",
          project: "Project",
          projectPlaceholder: "Select project",
          name: "Department name",
        },
      },
      companies: {
        actions: { add: "Add Company" },
        table: {
          project: "Project",
          name: "Company",
          description: "Description",
          noDescription: "No description",
          actions: "Actions",
          empty: "No companies yet.",
        },
        form: {
          editTitle: "Edit Company",
          createTitle: "Add Company",
          subtitle: "Company details",
          project: "Project",
          projectPlaceholder: "Select project",
          name: "Company name",
          description: "Description",
        },
      },
      locations: {
        actions: { add: "Add Location" },
        table: {
          project: "Project",
          name: "Location Name",
          actions: "Actions",
          empty: "No locations yet.",
        },
        form: {
          editTitle: "Edit Location",
          createTitle: "Add Location",
          subtitle: "Location details",
          project: "Project",
          projectPlaceholder: "Select project",
          name: "Location name",
        },
      },
      types: {
        actions: { add: "Add Type" },
        table: {
          project: "Project",
          name: "Type name",
          description: "Description",
          noDescription: "No description",
          actions: "Actions",
          empty: "No types yet.",
        },
        form: {
          editTitle: "Edit Type",
          createTitle: "Add Type",
          subtitle: "Type details",
          project: "Project",
          projectPlaceholder: "Select project",
          name: "Type name",
          description: "Description",
        },
      },
      support: {
        title: "Contact support",
        description: "Send a message to the super admin team.",
        subject: "Subject",
        subjectPlaceholder: "Describe the issue briefly",
        message: "Message",
        messagePlaceholder: "Explain what happened...",
        send: "Send message",
        sending: "Sending...",
        success: "Message sent. We will reach out shortly.",
        error: "Could not send message. Please try again.",
        backToLogin: "Back to login",
        needHelp: "Need help?",
      },
      subscription: {
        plan: "Plan: {{plan}}",
        billingStatus: "Billing status",
        status: "Platform status",
        trialEnds: "Trial ends",
        paidUntil: "Paid until",
        daysLeft: "Days left",
        days: "days",
        active: "Access enabled",
        suspended: "Access suspended",
        payOnline: "Pay online (soon)",
        contactSupport: "Contact support",
        payPlaceholder:
          "Online payment is currently unavailable. Please contact support.",
      },
    },
  },

  tr: {
    translation: {
      layout: {
        brand: "Kiracı Yönetimi",
        subtitle: "Tek kiracılı çalışma alanı",
        manage: "Yönet",
      },
      nav: {
        dashboard: "Genel Bakış",
        users: "Kullanıcılar",
        observations: "Gözlemler",
        tasks: "Görevler",
        supervisors: "Denetçiler",
        source: "Kaynaklar",
        projects: "Projeler",
        departments: "Departmanlar",
        companies: "Şirketler",
        locations: "Lokasyonlar",
        categories: "Kategoriler",
        subcategories: "Alt Kategoriler",
        types: "Tipler",
        subscription: "Abonelik",
      },
      common: {
        cancel: "İptal",
        save: "Kaydet",
        create: "Oluştur",
        actions: "İşlemler",
        noData: "Veri yok.",
      },
      theme: {
        label: "Tema",
        light: "Açık",
        dark: "Koyu",
        system: "Sistem",
      },
      language: { label: "Dil" },
      form: {
        email: "E‑posta",
        password: "Şifre",
        name: "Ad",
        description: "Açıklama",
      },
      auth: {
        errors: {
          generic: "Giriş yapılamadı. Tekrar deneyin.",
          inactive: "Hesap aktif değil.",
          sessionExpired: "Oturum süresi doldu. Tekrar giriş yapın.",
        },
        status: { signingIn: "Giriş yapılıyor..." },
      },
      tenant: {
        status: { active: "Aktif", offline: "Çevrimdışı" },
      },
      pages: {
        login: {
          title: "Giriş",
          description: "Kiracı yönetim paneline erişin.",
          submit: "Giriş Yap",
        },
        dashboard: {
          title: "Genel Bakış",
          description: "Kiracı durumu ve güvenlik metriklerini izleyin.",
        },
        users: {
          title: "Kullanıcılar",
          description: "Çalışanları ve yetkileri yönetin.",
        },
        supervisors: {
          title: "Denetçiler",
          description: "Proje denetçilerini atayın ve izleyin.",
        },
        projects: {
          title: "Projeler",
          description: "Projeleri ve atamaları yönetin.",
        },
        observations: {
          title: "Gözlemler",
          description: "Gözlemleri ve güvenlik bulgularını inceleyin.",
        },
        tasks: {
          title: "Görevler",
          description: "Güvenlik görevlerini takip edin.",
        },
        departments: {
          title: "Departmanlar",
          description: "Ekipleri departmanlara göre düzenleyin.",
        },
        companies: {
          title: "Şirketler",
          description: "Projelerle ilişkili şirketleri yönetin.",
        },
        locations: {
          title: "Lokasyonlar",
          description: "Fiziksel lokasyonları yönetin.",
        },
        categories: {
          title: "Kategoriler",
          description: "Gözlem kategorilerini yapılandırın.",
        },
        subcategories: {
          title: "Alt Kategoriler",
          description: "Alt kategori yapılarını yönetin.",
        },
        types: {
          title: "Tipler",
          description: "Gözlem veya görev tiplerini tanımlayın.",
        },
        subscription: {
          title: "Abonelik",
          description: "Deneme ve faturalama durumunu görüntüleyin.",
        },
        placeholder: "İçerik yakında.",
      },
      categories: {
        tabs: { observation: "Gözlem Kategorisi", task: "Görev Kategorisi" },
        actions: { addCategory: "Kategori Ekle" },
        table: {
          project: "Proje",
          category: "Kategori",
          actions: "İşlemler",
          empty: "Henüz kategori yok.",
        },
        form: {
          editTitle: "Kategoriyi Düzenle",
          createTitle: "Kategori Ekle",
          observationSubtitle: "Gözlem kategori detayları",
          taskSubtitle: "Görev kategori detayları",
          project: "Proje",
          projectPlaceholder: "Proje seçin",
          name: "Kategori adı",
        },
      },
      subcategories: {
        tabs: {
          observation: "Gözlem Alt Kategorisi",
          task: "Görev Alt Kategorisi",
        },
        actions: { add: "Alt Kategori Ekle" },
        table: {
          project: "Proje",
          category: "Kategori",
          subcategory: "Alt Kategori",
          actions: "İşlemler",
          empty: "Henüz alt kategori yok.",
        },
        form: {
          editTitle: "Alt Kategoriyi Düzenle",
          createTitle: "Alt Kategori Ekle",
          observationSubtitle: "Gözlem alt kategori detayları",
          taskSubtitle: "Görev alt kategori detayları",
          category: "Kategori",
          categoryPlaceholder: "Kategori seçin",
          name: "Alt kategori adı",
        },
      },
      departments: {
        actions: { add: "Departman Ekle" },
        table: {
          project: "Proje",
          name: "Departman Adı",
          actions: "İşlemler",
          empty: "Henüz departman yok.",
        },
        form: {
          editTitle: "Departmanı Düzenle",
          createTitle: "Departman Ekle",
          subtitle: "Departman detayları",
          project: "Proje",
          projectPlaceholder: "Proje seçin",
          name: "Departman adı",
        },
      },
      companies: {
        actions: { add: "Şirket Ekle" },
        table: {
          project: "Proje",
          name: "Şirket",
          description: "Açıklama",
          noDescription: "Açıklama yok",
          actions: "İşlemler",
          empty: "Henüz şirket yok.",
        },
        form: {
          editTitle: "Şirketi Düzenle",
          createTitle: "Şirket Ekle",
          subtitle: "Şirket detayları",
          project: "Proje",
          projectPlaceholder: "Proje seçin",
          name: "Şirket adı",
          description: "Açıklama",
        },
      },
      locations: {
        actions: { add: "Lokasyon Ekle" },
        table: {
          project: "Proje",
          name: "Lokasyon Adı",
          actions: "İşlemler",
          empty: "Henüz lokasyon yok.",
        },
        form: {
          editTitle: "Lokasyonu Düzenle",
          createTitle: "Lokasyon Ekle",
          subtitle: "Lokasyon detayları",
          project: "Proje",
          projectPlaceholder: "Proje seçin",
          name: "Lokasyon adı",
        },
      },
      types: {
        actions: { add: "Tip Ekle" },
        table: {
          project: "Proje",
          name: "Tip adı",
          description: "Açıklama",
          noDescription: "Açıklama yok",
          actions: "İşlemler",
          empty: "Henüz tip yok.",
        },
        form: {
          editTitle: "Tipi Düzenle",
          createTitle: "Tip Ekle",
          subtitle: "Tip detayları",
          project: "Proje",
          projectPlaceholder: "Proje seçin",
          name: "Tip adı",
          description: "Açıklama",
        },
      },
      support: {
        title: "Destek ile İletişim",
        description: "Süper admin ekibine mesaj gönderin.",
        subject: "Konu",
        subjectPlaceholder: "Sorunu kısaca açıklayın",
        message: "Mesaj",
        messagePlaceholder: "Ne olduğunu anlatın...",
        send: "Gönder",
        sending: "Gönderiliyor...",
        success: "Mesaj gönderildi. Yakında iletişime geçeceğiz.",
        error: "Mesaj gönderilemedi. Tekrar deneyin.",
        backToLogin: "Girişe dön",
        needHelp: "Yardıma mı ihtiyacınız var?",
      },
      subscription: {
        plan: "Plan: {{plan}}",
        billingStatus: "Ödeme durumu",
        status: "Platform durumu",
        trialEnds: "Deneme bitişi",
        paidUntil: "Ödenen tarih",
        daysLeft: "Kalan gün",
        days: "gün",
        active: "Erişim açık",
        suspended: "Erişim askıda",
        payOnline: "Online öde (yakında)",
        contactSupport: "Destek ile iletişim",
        payPlaceholder:
          "Online ödeme şu anda kullanılamıyor. Lütfen destek ile iletişime geçin.",
      },
    },
  },

  ru: {
    translation: {
      layout: {
        brand: "Админ арендатора",
        subtitle: "Рабочее пространство арендатора",
        manage: "Управление",
      },
      nav: {
        dashboard: "Обзор",
        users: "Пользователи",
        observations: "Наблюдения",
        tasks: "Задачи",
        supervisors: "Руководители",
        source: "Источники",
        projects: "Проекты",
        departments: "Отделы",
        companies: "Компании",
        locations: "Локации",
        categories: "Категории",
        subcategories: "Подкатегории",
        types: "Типы",
        subscription: "Подписка",
      },
      common: {
        cancel: "Отмена",
        save: "Сохранить",
        create: "Создать",
        actions: "Действия",
        noData: "Нет данных.",
      },
      theme: {
        label: "Тема",
        light: "Светлая",
        dark: "Тёмная",
        system: "Системная",
      },
      language: { label: "Язык" },
      form: {
        email: "Email",
        password: "Пароль",
        name: "Название",
        description: "Описание",
      },
      auth: {
        errors: {
          generic: "Не удалось войти. Попробуйте ещё раз.",
          inactive: "Аккаунт не активен.",
          sessionExpired: "Сессия истекла. Войдите снова.",
        },
        status: { signingIn: "Вход..." },
      },
      tenant: {
        status: { active: "Активен", offline: "Не в сети" },
      },
      pages: {
        login: {
          title: "Вход",
          description: "Доступ к панели арендатора.",
          submit: "Войти",
        },
        dashboard: {
          title: "Обзор",
          description: "Отслеживайте состояние и метрики безопасности.",
        },
        users: {
          title: "Пользователи",
          description: "Управление сотрудниками и доступами.",
        },
        supervisors: {
          title: "Руководители",
          description: "Назначение и контроль руководителей проектов.",
        },
        projects: {
          title: "Проекты",
          description: "Организация проектов и назначений.",
        },
        observations: {
          title: "Наблюдения",
          description: "Просмотр наблюдений и находок.",
        },
        tasks: {
          title: "Задачи",
          description: "Управление задачами по безопасности.",
        },
        departments: {
          title: "Отделы",
          description: "Организация команд по отделам.",
        },
        companies: {
          title: "Компании",
          description: "Компании, привязанные к проектам.",
        },
        locations: {
          title: "Локации",
          description: "Управление физическими локациями.",
        },
        categories: {
          title: "Категории",
          description: "Настройка категорий наблюдений.",
        },
        subcategories: {
          title: "Подкатегории",
          description: "Управление вложенными категориями.",
        },
        types: {
          title: "Типы",
          description: "Определение типов наблюдений или задач.",
        },
        subscription: {
          title: "Подписка",
          description: "Информация о пробном периоде и оплате.",
        },
        placeholder: "Контент скоро появится.",
      },
      categories: {
        tabs: { observation: "Категория наблюдений", task: "Категория задач" },
        actions: { addCategory: "Добавить категорию" },
        table: {
          project: "Проект",
          category: "Категория",
          actions: "Действия",
          empty: "Категорий пока нет.",
        },
        form: {
          editTitle: "Редактировать категорию",
          createTitle: "Добавить категорию",
          observationSubtitle: "Детали категории наблюдений",
          taskSubtitle: "Детали категории задач",
          project: "Проект",
          projectPlaceholder: "Выберите проект",
          name: "Название категории",
        },
      },
      subcategories: {
        tabs: {
          observation: "Подкатегория наблюдений",
          task: "Подкатегория задач",
        },
        actions: { add: "Добавить подкатегорию" },
        table: {
          project: "Проект",
          category: "Категория",
          subcategory: "Подкатегория",
          actions: "Действия",
          empty: "Подкатегорий пока нет.",
        },
        form: {
          editTitle: "Редактировать подкатегорию",
          createTitle: "Добавить подкатегорию",
          observationSubtitle: "Детали подкатегории наблюдений",
          taskSubtitle: "Детали подкатегории задач",
          category: "Категория",
          categoryPlaceholder: "Выберите категорию",
          name: "Название подкатегории",
        },
      },
      departments: {
        actions: { add: "Добавить отдел" },
        table: {
          project: "Проект",
          name: "Название отдела",
          actions: "Действия",
          empty: "Отделов пока нет.",
        },
        form: {
          editTitle: "Редактировать отдел",
          createTitle: "Добавить отдел",
          subtitle: "Данные отдела",
          project: "Проект",
          projectPlaceholder: "Выберите проект",
          name: "Название отдела",
        },
      },
      companies: {
        actions: { add: "Добавить компанию" },
        table: {
          project: "Проект",
          name: "Компания",
          description: "Описание",
          noDescription: "Без описания",
          actions: "Действия",
          empty: "Компаний пока нет.",
        },
        form: {
          editTitle: "Редактировать компанию",
          createTitle: "Добавить компанию",
          subtitle: "Данные компании",
          project: "Проект",
          projectPlaceholder: "Выберите проект",
          name: "Название компании",
          description: "Описание",
        },
      },
      locations: {
        actions: { add: "Добавить локацию" },
        table: {
          project: "Проект",
          name: "Название локации",
          actions: "Действия",
          empty: "Локаций пока нет.",
        },
        form: {
          editTitle: "Редактировать локацию",
          createTitle: "Добавить локацию",
          subtitle: "Данные локации",
          project: "Проект",
          projectPlaceholder: "Выберите проект",
          name: "Название локации",
        },
      },
      types: {
        actions: { add: "Добавить тип" },
        table: {
          project: "Проект",
          name: "Название типа",
          description: "Описание",
          noDescription: "Без описания",
          actions: "Действия",
          empty: "Типов пока нет.",
        },
        form: {
          editTitle: "Редактировать тип",
          createTitle: "Добавить тип",
          subtitle: "Данные типа",
          project: "Проект",
          projectPlaceholder: "Выберите проект",
          name: "Название типа",
          description: "Описание",
        },
      },
      support: {
        title: "Связаться с поддержкой",
        description: "Отправьте сообщение команде суперадминов.",
        subject: "Тема",
        subjectPlaceholder: "Кратко опишите проблему",
        message: "Сообщение",
        messagePlaceholder: "Опишите, что произошло...",
        send: "Отправить",
        sending: "Отправляем...",
        success: "Сообщение отправлено. Мы скоро свяжемся.",
        error: "Не удалось отправить. Попробуйте ещё раз.",
        backToLogin: "Назад ко входу",
        needHelp: "Нужна помощь?",
      },
      subscription: {
        plan: "План: {{plan}}",
        billingStatus: "Статус оплаты",
        status: "Статус платформы",
        trialEnds: "Окончание пробного периода",
        paidUntil: "Оплачено до",
        daysLeft: "Осталось дней",
        days: "дн.",
        active: "Доступ открыт",
        suspended: "Доступ приостановлен",
        payOnline: "Оплатить онлайн (скоро)",
        contactSupport: "Связаться с поддержкой",
        payPlaceholder:
          "Онлайн-оплата пока недоступна. Свяжитесь с поддержкой.",
      },
    },
  },
};

const storedLanguage =
  typeof window !== "undefined"
    ? localStorage.getItem(LANGUAGE_STORAGE_KEY)
    : null;

const fallbackLanguage = "en";
const initialLanguage = storedLanguage ?? fallbackLanguage;

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: fallbackLanguage,
  supportedLngs: supportedLanguages.map((l) => l.code),
  interpolation: { escapeValue: false },
  keySeparator: ".",
});

export default i18n;
