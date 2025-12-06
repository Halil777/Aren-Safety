export interface Branch {
  id: string;
  projectCode: string;
  title_en: string;
  title_ru: string;
  title_tr: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchFilterParams {
  projectCode?: string;
  search?: string;
}
