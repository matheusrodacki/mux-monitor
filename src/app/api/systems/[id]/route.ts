import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/systems/[id] - Buscar um sistema específico
export async function GET(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = await context.params
    const systemId = parseInt(id)

    if (isNaN(systemId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const system = await prisma.compressionSystem.findUnique({
      where: { id: systemId },
      include: {
        muxes: true,
      },
    })

    if (!system) {
      return NextResponse.json(
        { error: "Sistema não encontrado" },
        { status: 404 },
      )
    }

    return NextResponse.json({ system })
  } catch (error) {
    console.error("Erro ao buscar sistema:", error)
    return NextResponse.json(
      { error: "Erro ao buscar sistema" },
      { status: 500 },
    )
  }
}

// PUT /api/systems/[id] - Atualizar um sistema
export async function PUT(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = await context.params
    const systemId = parseInt(id)

    if (isNaN(systemId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { name, location, status } = body

    // Validação básica
    if (!name || !location || !status) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const system = await prisma.compressionSystem.update({
      where: { id: systemId },
      data: {
        name,
        status,
      },
    })

    return NextResponse.json({ system })
  } catch (error) {
    console.error("Erro ao atualizar sistema:", error)
    return NextResponse.json(
      { error: "Erro ao atualizar sistema" },
      { status: 500 },
    )
  }
}

// DELETE /api/systems/[id] - Excluir um sistema
export async function DELETE(
  request: Request,
  context: { params: { id: string } },
) {
  try {
    const { id } = await context.params
    const systemId = parseInt(id)

    if (isNaN(systemId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await prisma.compressionSystem.delete({
      where: { id: systemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao excluir sistema:", error)
    return NextResponse.json(
      { error: "Erro ao excluir sistema" },
      { status: 500 },
    )
  }
}
