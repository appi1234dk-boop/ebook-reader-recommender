export type AppStep = 'landing' | 'quiz' | 'analyzing' | 'result'

export interface Device {
  id: string
  name: string
  brand: string
  size: string
  priceRange: string
  imageUrl: string
  description: string
  androidVersion: string
  physicalButton: boolean
  hasColor: boolean
  releaseYear: string
  origin: 'korea' | 'china'
  priceTier: 'entry' | 'mid' | 'midHigh' | 'high'
}

export interface AiContent {
  readingType: string
  usage: string
  reason: string
}

export interface RecommendationResult {
  primary: Device
  secondary: Device
  primaryReasons: string[]
  secondaryReasons: string[]
  resultType: string
  probability: number
  description: string
  aiContent?: AiContent
}

export interface AnalyticsEventPayload {
  session_id: string
  event_type: string
  data?: Record<string, unknown>
  referrer?: string | null
  utm_source?: string | null
}
