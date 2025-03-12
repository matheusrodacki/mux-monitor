import { SingleMuxResponse } from "@/types/mux"
import { generateSystemData } from "@/utils/muxData"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
): Promise<NextResponse<SingleMuxResponse | { error: string }>> {
  try {
    const id = parseInt(params.id)

    if (isNaN(id) || id < 1 || id > 15) {
      return NextResponse.json(
        { error: "ID de sistema inválido" },
        { status: 400 },
      )
    }

    const primaryData = generateSystemData(id)
    const backupData = generateSystemData(id)

    // Em um cenário real, aqui buscaríamos os dados específicos deste sistema
    const system = {
      id,
      name: `Sistema de Compressão ${id}`,
      location: `Plataforma ${String.fromCharCode(65 + ((id - 1) % 8))}-${Math.floor((id - 1) / 8) + 1}`,
      status: primaryData[primaryData.length - 1].status,
      lastRun: new Date().toLocaleString("pt-BR"),
      ecmgConnections: {
        synamedia: Math.random() > 0.5 ? "Primário" : "Backup",
        nagra: Math.random() > 0.5 ? "Primário" : "Backup",
        verimatrix: Math.random() > 0.5 ? "Primário" : "Backup",
        nagraTVRO: Math.random() > 0.5 ? "Primário" : "Backup",
      },
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
    }

    return NextResponse.json({ system })
  } catch (error) {
    console.error("Erro ao buscar dados do sistema:", error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do sistema" },
      { status: 500 },
    )
  }
}
