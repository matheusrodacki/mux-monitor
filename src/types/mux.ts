export type Status = "Operational" | "Downtime" | "Inactive"

export interface SystemData {
  tooltip: string
  status: Status
}

export interface MuxSystem {
  name: string
  data: SystemData[]
  status: Status
}

export interface System {
  id: number
  name: string
  status: Status
  lastRun: string
  ecmgConnections: {
    synamedia: string
    nagra: string
    verimatrix: string
    nagraTVRO: string
  }
  primary: MuxSystem
  backup: MuxSystem
}

export interface MuxResponse {
  systems: System[]
}

export interface SingleMuxResponse {
  system: System
}
