import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Em um cenário real, faríamos uma requisição para a API externa:
    // const response = await fetch('http://10.218.31.68/api/v1/alarms/active/count', {
    //   headers: {
    //     'Accept': 'application/json, text/plain',
    //     'If-Modified-Since': '0',
    //     'token': '41ac3e757a74432dbcc21be1b65f20e3'
    //   }
    // });
    // const data = await response.json();

    // Contar alarmes sem ClearDate no banco de dados (alarmes ativos)
    const count = await prisma.alarm.count({
      where: {
        clearDate: null,
      },
    })

    return NextResponse.json(count)
  } catch (error) {
    console.error("Erro ao contar alarmes ativos:", error)
    return NextResponse.json(
      { error: "Erro ao contar alarmes ativos" },
      { status: 500 },
    )
  }
}
