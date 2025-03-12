export interface Alarm {
  UID: string
  Type: number
  Level: AlarmLevel
  StartDate: number // timestamp em nanossegundos
  ClearDate?: number // timestamp em nanossegundos
  Source: string
  Name: string
  Description: string
}

export type AlarmLevel = "critical" | "major" | "minor" | "warning" | "info"

export interface AlarmsResponse {
  alarms: Alarm[]
}

export interface AlarmCountResponse {
  count: number
}
