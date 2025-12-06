export interface Category {
  id: string;
  projectCode: string;
  title_en: string;
  title_ru: string;
  title_tr: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFilterParams {
  projectCode?: string;
  search?: string;
}
