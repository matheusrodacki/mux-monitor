export interface EcmgServer {
  Address: string
  Port: number
}

export interface Ecmg {
  Name: string
  CASystemID: number
  CASubsystemID: number
  ChannelID: number
  CAAlgorithm: string
  CAAesScramblingMode: string
  ScramblingDesc: boolean
  PrivateData: string
  UID: number
  ServersList: EcmgServer[]
  // Outros campos podem ser adicionados conforme necessário
}

export interface EcmgStatus {
  ecmguid: number
  servers: {
    priority: number
    state: number
  }[]
  activeserverpriority: number
}

export interface EcmgsResponse {
  ecmgs: Ecmg[]
}

export interface EcmgStatusResponse {
  status: EcmgStatus
}
