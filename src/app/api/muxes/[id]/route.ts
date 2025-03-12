import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/muxes/[id] - Buscar um MUX específico
export async function GET(
  request: Request,
  { params }: { params: { id: string | Promise<string> } },
) {
  try {
    // Aguardar o valor de params.id antes de usá-lo
    const id = await params.id
    const muxId = parseInt(id)

    if (isNaN(muxId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const mux = await prisma.mux.findUnique({
      where: { id: muxId },
    })

    if (!mux) {
      return NextResponse.json({ error: "MUX não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ mux })
  } catch (error) {
    console.error("Erro ao buscar MUX:", error)
    return NextResponse.json({ error: "Erro ao buscar MUX" }, { status: 500 })
  }
}

// PUT /api/muxes/[id] - Atualizar um MUX
export async function PUT(
  request: Request,
  { params }: { params: { id: string | Promise<string> } },
) {
  try {
    // Aguardar o valor de params.id antes de usá-lo
    const id = await params.id
    const muxId = parseInt(id)

    if (isNaN(muxId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()
    const { ipAddress, type } = body

    // Validação básica
    if (!ipAddress || !type) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const mux = await prisma.mux.update({
      where: { id: muxId },
      data: {
        ipAddress,
        type,
        // Mantemos o status existente
      },
    })

    return NextResponse.json({ mux })
  } catch (error) {
    console.error(
      "Erro ao atualizar MUX:",
      error instanceof Error ? error.message : "Erro desconhecido",
    )
    return NextResponse.json(
      { error: "Erro ao atualizar MUX" },
      { status: 500 },
    )
  }
}

// DELETE /api/muxes/[id] - Excluir um MUX
export async function DELETE(
  request: Request,
  { params }: { params: { id: string | Promise<string> } },
) {
  try {
    // Aguardar o valor de params.id antes de usá-lo
    const id = await params.id
    const muxId = parseInt(id)

    if (isNaN(muxId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await prisma.mux.delete({
      where: { id: muxId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(
      "Erro ao excluir MUX:",
      error instanceof Error ? error.message : "Erro desconhecido",
    )
    return NextResponse.json({ error: "Erro ao excluir MUX" }, { status: 500 })
  }
}
