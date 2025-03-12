import prisma from "@/lib/prisma"
import { AlarmLevel } from "@prisma/client"
import { mockAlarmHistory } from "./mockData"

/**
 * Função para sincronizar alarmes com a API externa
 * Esta função pode ser chamada por um job agendado ou webhook
 */
export async function syncAlarms() {
  try {
    // Em um cenário real, faríamos uma requisição para a API externa
    // const response = await fetch('http://10.218.31.68/api/v1/alarms/history', {
    //   headers: {
    //     'Accept': 'application/json, text/plain',
    //     'If-Modified-Since': '0',
    //     'token': '41ac3e757a74432dbcc21be1b65f20e3'
    //   }
    // });
    // const alarms = await response.json();

    // Para fins de simulação, usamos dados mockados
    const alarms = mockAlarmHistory

    // Filtrar apenas alarmes das últimas 48h
    const fortyEightHoursAgoMs = Date.now() - 48 * 60 * 60 * 1000
    const recentAlarms = alarms.filter(
      (alarm) => alarm.StartDate / 1000000 > fortyEightHoursAgoMs,
    )

    // Para cada alarme, inserir ou atualizar no banco de dados
    for (const alarm of recentAlarms) {
      await prisma.alarm.upsert({
        where: { id: parseInt(alarm.UID) || 0 },
        update: {
          level: alarm.Level.toUpperCase() as AlarmLevel,
          startDate: new Date(alarm.StartDate / 1000000),
          clearDate: alarm.ClearDate
            ? new Date(alarm.ClearDate / 1000000)
            : null,
          source: alarm.Source,
          name: alarm.Name,
          description: alarm.Description,
        },
        create: {
          id: parseInt(alarm.UID) || 0,
          uid: alarm.UID,
          type: alarm.Type,
          level: alarm.Level.toUpperCase() as AlarmLevel,
          startDate: new Date(alarm.StartDate / 1000000),
          clearDate: alarm.ClearDate
            ? new Date(alarm.ClearDate / 1000000)
            : null,
          source: alarm.Source,
          name: alarm.Name,
          description: alarm.Description,
          muxId: 1, // Você precisará determinar a qual MUX este alarme pertence
        },
      })
    }

    // Remover alarmes muito antigos
    await prisma.alarm.deleteMany({
      where: {
        startDate: {
          lt: new Date(fortyEightHoursAgoMs),
        },
      },
    })

    console.log(`Sincronizados ${recentAlarms.length} alarmes`)
    return { success: true, count: recentAlarms.length }
  } catch (error) {
    console.error("Erro ao sincronizar alarmes:", error)
    return { success: false, error }
  }
}
