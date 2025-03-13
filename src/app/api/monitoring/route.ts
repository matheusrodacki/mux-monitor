import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// Função para gerar dados de status simulados para muxes
// Esta função pode ser substituída por dados reais quando disponíveis
function generateMuxStatusData(count = 48) {
  const statuses = ["Operational", "Downtime", "Inactive"]
  const data = []

  for (let i = 0; i < count; i++) {
    // Maior probabilidade de status operacional para simular sistemas estáveis
    const statusWeight = Math.random()
    let status

    if (statusWeight > 0.9) status = "Downtime"
    else if (statusWeight > 0.85) status = "Inactive"
    else status = "Operational"

    data.push({
      timestamp: new Date(
        Date.now() - (count - i) * 30 * 60 * 1000,
      ).toISOString(),
      status: status,
    })
  }

  return data
}

// Determina o status geral com base nos dados recentes
interface MuxStatusData {
  timestamp: string
  status: "Operational" | "Downtime" | "Inactive"
}

function determineOverallStatus(
  data: MuxStatusData[],
): "Operational" | "Downtime" | "Inactive" {
  // Verificamos os últimos 5 itens para determinar o status atual
  const recentData = data.slice(-5)
  const hasDowntime = recentData.some(
    (item: MuxStatusData) => item.status === "Downtime",
  )
  const hasInactive = recentData.some(
    (item: MuxStatusData) => item.status === "Inactive",
  )

  if (hasDowntime) return "Downtime"
  if (hasInactive) return "Inactive"
  return "Operational"
}

export async function GET() {
  try {
    // Buscar sistemas e seus muxes associados
    const systems = await prisma.compressionSystem.findMany({
      include: {
        muxes: true,
      },
    })

    // Formatar os dados para o formato esperado pelo frontend
    const formattedSystems = systems.map((system) => {
      // Para cada sistema, gerar dados para seus muxes
      const muxes = system.muxes.map((mux) => {
        // Gerar dados de status para o mux
        const rawStatusData = generateMuxStatusData(48)
        const statusData = rawStatusData.map((item) => ({
          ...item,
          status: item.status as "Operational" | "Downtime" | "Inactive",
        }))
        const currentStatus = determineOverallStatus(statusData)

        return {
          id: mux.id,
          name: String(mux.type),
          status: currentStatus,
          data: statusData,
        }
      })

      // Separar muxes em primário e backup
      const primaryMux = muxes.find((mux) => mux.name.includes("Primary")) ||
        muxes[0] || {
          id: 0,
          name: "Primary",
          status: "Inactive",
          data: generateMuxStatusData(48),
        }

      const backupMux = muxes.find((mux) => mux.name.includes("Backup")) ||
        muxes[1] || {
          id: 0,
          name: "Backup",
          status: "Inactive",
          data: generateMuxStatusData(48),
        }

      // Determinar o status geral do sistema
      let systemStatus = "Operational"
      if (primaryMux.status === "Downtime" && backupMux.status === "Downtime") {
        systemStatus = "Downtime"
      } else if (
        primaryMux.status === "Inactive" &&
        backupMux.status === "Inactive"
      ) {
        systemStatus = "Inactive"
      }

      // Mock dos dados de ecmgConnections
      // Estes serão substituídos por dados reais quando a API do mux estiver disponível
      const mockedEcmgConnections = {
        synamedia: Math.floor(Math.random() * 10 + 1), // Valores entre 1 e 10
        nagra: Math.floor(Math.random() * 8 + 1), // Valores entre 1 e 8
        verimatrix: Math.floor(Math.random() * 5 + 1), // Valores entre 1 e 5
        nagraTVRO: Math.floor(Math.random() * 3 + 1), // Valores entre 1 e 3
      }

      // Construir o objeto do sistema formatado
      return {
        id: system.id,
        name: system.name,
        status: systemStatus,
        primary: primaryMux,
        backup: backupMux,
        ecmgConnections: mockedEcmgConnections,
      }
    })

    return NextResponse.json({ systems: formattedSystems })
  } catch (error) {
    console.error("Erro ao buscar dados de monitoramento:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados de monitoramento" },
      { status: 500 },
    )
  }
}
