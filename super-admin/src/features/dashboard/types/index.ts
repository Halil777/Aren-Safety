export interface Statistics {
  total: number
  active: number
  offline: number
  growthData: GrowthDataPoint[]
  statusData: StatusDataPoint[]
}

export interface GrowthDataPoint {
  month: string
  count: number
}

export interface StatusDataPoint {
  month: string
  status: 'active' | 'offline'
  count: number
}
