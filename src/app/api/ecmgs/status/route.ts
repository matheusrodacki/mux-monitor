import { Ecmg } from "@/types/ecmg"
import { NextResponse } from "next/server"

// Importando os dados mockados
const mockEcmgs: Ecmg[] = [
  {
    Name: "ECMG SKY",
    CASystemID: 2374,
    UID: 4,
    ServersList: [{ Address: "10.218.222.152", Port: 11113 }],
  },
  {
    Name: "ECMG SKY - NAGRA",
    CASystemID: 6187,
    UID: 56274,
    ServersList: [
      { Address: "10.218.213.136", Port: 3335 },
      { Address: "10.218.213.137", Port: 3335 },
    ],
  },
  {
    Name: "ECMG VERIMATRIX",
    CASystemID: 5914,
    UID: 65631,
    ServersList: [{ Address: "10.218.215.10", Port: 12000 }],
  },
  {
    Name: "ECMG NAGRA - TVRO",
    CASystemID: 6250,
    UID: 80789,
    ServersList: [
      { Address: "10.218.214.134", Port: 3340 },
      { Address: "10.218.214.135", Port: 3340 },
    ],
  },
] as Ecmg[]

export async function GET() {
  try {
    // Gerar status para cada ECMG
    const ecmgStatuses = mockEcmgs.map((ecmg) => {
      const isFirstServerActive = Math.random() > 0.5

      return {
        uid: ecmg.UID,
        name: ecmg.Name,
        activeServer: isFirstServerActive ? "Primário" : "Backup",
        servers: ecmg.ServersList.map((server, idx) => ({
          address: server.Address,
          port: server.Port,
          active:
            (idx === 0 && isFirstServerActive) ||
            (idx === 1 && !isFirstServerActive),
        })),
      }
    })

    return NextResponse.json({ ecmgStatuses })
  } catch (error) {
    console.error("Erro ao buscar status dos ECMGs:", error)
    return NextResponse.json(
      { error: "Erro ao buscar status dos ECMGs" },
      { status: 500 },
    )
  }
}
