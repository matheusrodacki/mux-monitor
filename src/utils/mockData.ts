import { Alarm } from "@/types/alarm"

// Dados de exemplo baseados no arquivo exemples/alarms_history_response.json
export const mockAlarmHistory: Alarm[] = [
  {
    UID: "67d1e0a95459b601acfe740f",
    Type: 43,
    Level: "critical",
    StartDate: 1741807785366230143,
    ClearDate: 1741807785888951429,
    Source: "Scg",
    Name: "EIS communication error",
    Description: "No EIS activity.",
  },
  {
    UID: "67d1d9a15459b601acfdec38",
    Type: 43,
    Level: "critical",
    StartDate: 1741805985356374490,
    ClearDate: 1741805985477045022,
    Source: "Scg",
    Name: "EIS communication error",
    Description: "No EIS activity.",
  },
  {
    UID: "67d1d4025459b601acfd7e50",
    Type: 43,
    Level: "critical",
    StartDate: 1741804546290054966,
    ClearDate: 1741804546993636579,
    Source: "Scg",
    Name: "EIS communication error",
    Description: "No EIS activity.",
  },
  {
    UID: "67d10fb75459b601acee9b61",
    Type: 42,
    Level: "major",
    StartDate: 1741754295766886747,
    ClearDate: 1741754296550815379,
    Source: "Emmg",
    Name: "EMMG alarm",
    Description: "Emm data timeout CAS ID: 2370 - 0, DATA ID: 2",
  },
  {
    UID: "67cfe2195459b601acbdda36",
    Type: 42,
    Level: "major",
    StartDate: 1741677081846650063,
    ClearDate: 1741677081872028351,
    Source: "Emmg",
    Name: "EMMG alarm",
    Description: "Emm data timeout CAS ID: 5914 - 0, DATA ID: 3",
  },
]

// Exemplo de alarmes ativos - você pode adicionar mais conforme necessário
export const mockActiveAlarms: Alarm[] = []
