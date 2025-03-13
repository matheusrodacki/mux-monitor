import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// GET /api/systems - Listar todos os sistemas
export async function GET() {
  try {
    const systems = await prisma.compressionSystem.findMany({
      include: {
        muxes: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({ systems })
  } catch (error) {
    console.error("Erro ao buscar sistemas:", error)
    return NextResponse.json(
      { error: "Erro ao buscar sistemas" },
      { status: 500 },
    )
  }
}

// POST /api/systems - Adicionar um novo sistema
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, status } = body

    // Validação básica
    if (!name || !status) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 })
    }

    const system = await prisma.compressionSystem.create({
      data: {
        name,
        status,
      },
    })

    return NextResponse.json({ system }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar sistema:", error)
    return NextResponse.json(
      { error: "Erro ao criar sistema" },
      { status: 500 },
    )
  }
}
