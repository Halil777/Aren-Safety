import type { CategoryType } from '@/features/categories/types/category'

export type Subcategory = {
  id: string
  subcategoryName: string
  categoryId: string
  projectId: string
  type: CategoryType
  category?: {
    id: string
    categoryName: string
  }
  project?: {
    id: string
    name: string
  }
  createdAt?: string
  updatedAt?: string
}

export type SubcategoryInput = {
  categoryId: string
  subcategoryName: string
}
