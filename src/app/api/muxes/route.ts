import { MuxResponse, System } from "@/types/mux"
import { generateSystemData } from "@/utils/muxData"
import { NextResponse } from "next/server"

export async function GET(): Promise<
  NextResponse<MuxResponse | { error: string }>
> {
  try {
    // Em um cenário real, aqui teríamos a comunicação com a API externa dos muxes
    // Por enquanto, vamos simular os dados
    const systems = Array.from({ length: 15 }, (_, i) => {
      const systemId = i + 1
      const primaryData = generateSystemData(systemId)
      const backupData = generateSystemData(systemId)

      // Gerar aleatoriamente as conexões ECMG (primário ou backup)
      const ecmgConnections = {
        synamedia: Math.random() > 0.5 ? "Primário" : "Backup",
        nagra: Math.random() > 0.5 ? "Primário" : "Backup",
        verimatrix: Math.random() > 0.5 ? "Primário" : "Backup",
        nagraTVRO: Math.random() > 0.5 ? "Primário" : "Backup",
      }

      return {
        id: systemId,
        name: `Sistema de Compressão ${systemId}`,
        location: `Plataforma ${String.fromCharCode(65 + (i % 8))}-${Math.floor(i / 8) + 1}`,
        status: primaryData[primaryData.length - 1].status,
        lastRun: new Date().toLocaleString("pt-BR"),
        ecmgConnections,
        primary: {
          name: "MUX Primário",
          data: primaryData,
          status: primaryData[primaryData.length - 1].status,
        },
        backup: {
          name: "MUX Backup",
          data: backupData,
          status: backupData[backupData.length - 1].status,
        },
      } as System
    })

    return NextResponse.json({ systems })
  } catch (error) {
    console.error("Erro ao buscar dados dos sistemas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados dos sistemas" },
      { status: 500 },
    )
  }
}
