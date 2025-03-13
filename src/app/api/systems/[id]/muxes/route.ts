import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/systems/[id]/muxes - Listar muxes de um sistema
export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = await context.params
    const systemId = parseInt(id)

    if (isNaN(systemId)) {
      return NextResponse.json(
        { error: "ID de sistema inválido" },
        { status: 400 },
      )
    }

    const muxes = await prisma.mux.findMany({
      where: {
        systemId,
      },
    })

    return NextResponse.json({ muxes })
  } catch (error) {
    console.error("Erro ao buscar muxes:", error)
    return NextResponse.json({ error: "Erro ao buscar muxes" }, { status: 500 })
  }
}

// POST /api/systems/[id]/muxes - Adicionar um mux a um sistema
export async function POST(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = await context.params
    const systemId = parseInt(id)

    if (isNaN(systemId)) {
      return NextResponse.json(
        { error: "ID de sistema inválido" },
        { status: 400 },
      )
    }

    // Verificar se o sistema existe
    const system = await prisma.compressionSystem.findUnique({
      where: { id: systemId },
    })

    if (!system) {
      return NextResponse.json(
        { error: "Sistema não encontrado" },
        { status: 404 },
      )
    }

    const body = await request.json()
    const { ipAddress, type } = body

    // Validação básica
    if (!ipAddress || !type) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const mux = await prisma.mux.create({
      data: {
        ipAddress,
        type,
        systemId,
        status: "Operational", // Adicionado o campo status obrigatório
      },
    })

    return NextResponse.json({ mux })
  } catch (error) {
    // Correção do manipulador de erro para evitar null
    console.error(
      "Erro ao criar mux:",
      error instanceof Error ? error.message : "Erro desconhecido",
    )
    return NextResponse.json({ error: "Erro ao criar mux" }, { status: 500 })
  }
}
