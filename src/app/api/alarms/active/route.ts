import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Em um cenário real, faríamos uma requisição para a API externa:
    // const response = await fetch('http://10.218.31.68/api/v1/alarms/active', {
    //   headers: {
    //     'Accept': 'application/json, text/plain',
    //     'If-Modified-Since': '0',
    //     'token': '41ac3e757a74432dbcc21be1b65f20e3'
    //   }
    // });
    // const alarms = await response.json();

    // Buscar alarmes sem ClearDate do banco de dados (alarmes ativos)
    const activeAlarms = await prisma.alarm.findMany({
      where: {
        clearDate: null,
      },
      orderBy: {
        startDate: "desc",
      },
    })

    // Mapear os dados do formato do banco para o formato da API
    const alarms = activeAlarms.map((alarm) => ({
      UID: alarm.id.toString(),
      Type: alarm.type,
      Level: alarm.level.toLowerCase(),
      StartDate: new Date(alarm.startDate).getTime() * 1000000, // Converter para nanossegundos
      Source: alarm.source,
      Name: alarm.name,
      Description: alarm.description,
    }))

    return NextResponse.json(alarms)
  } catch (error) {
    console.error("Erro ao buscar alarmes ativos:", error)
    return NextResponse.json(
      { error: "Erro ao buscar alarmes ativos" },
      { status: 500 },
    )
  }
}
