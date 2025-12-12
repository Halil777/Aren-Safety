export type MobileUser = {
  id: string
  fullName: string
  phoneNumber: string
  email?: string | null
  login: string
  profession?: string | null
  role?: 'USER' | 'SUPERVISOR'
  isActive: boolean
  projectIds: string[]
  projects?: { id: string; name: string }[]
  createdAt?: string
}

export type MobileUserInput = {
  fullName: string
  phoneNumber: string
  email?: string
  login: string
  password?: string
  profession?: string
  isActive?: boolean
  projectIds: string[]
}
