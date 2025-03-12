import prisma from "@/lib/prisma"
import { mockAlarmHistory } from "@/utils/mockData"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Em um cenário real, faríamos uma requisição para a API externa:
    // const response = await fetch('http://10.218.31.68/api/v1/alarms/history', {
    //   headers: {
    //     'Accept': 'application/json, text/plain',
    //     'Cache-Control': 'max-age=0',
    //     'If-Modified-Since': '0',
    //     'token': '41ac3e757a74432dbcc21be1b65f20e3'
    //   }
    // });
    // const alarms = await response.json();

    // Cálculo de data 48 horas atrás
    const fortyEightHoursAgo = new Date()
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48)

    // Buscar alarmes dos últimos 48 horas
    const historyAlarms = await prisma.alarm.findMany({
      where: {
        startDate: {
          gte: fortyEightHoursAgo,
        },
      },
      orderBy: {
        startDate: "desc",
      },
    })

    // Mapear os dados do formato do banco para o formato da API
    const alarms = historyAlarms.map((alarm) => ({
      UID: alarm.id.toString(),
      Type: alarm.type,
      Level: alarm.level.toLowerCase(),
      StartDate: new Date(alarm.startDate).getTime() * 1000000, // Converter para nanossegundos
      ClearDate: alarm.clearDate
        ? new Date(alarm.clearDate).getTime() * 1000000
        : undefined,
      Source: alarm.source,
      Name: alarm.name,
      Description: alarm.description,
    }))

    // Se não houver dados no banco, retorne dados simulados para testes
    if (alarms.length === 0) {
      return NextResponse.json(mockAlarmHistory)
    }

    return NextResponse.json(alarms)
  } catch (error) {
    console.error("Erro ao buscar histórico de alarmes:", error)
    return NextResponse.json(
      { error: "Erro ao buscar histórico de alarmes" },
      { status: 500 },
    )
  }
}
