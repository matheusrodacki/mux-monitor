import { Status, SystemData } from "@/types/mux"

// Função para gerar dados de sistema simulado
export const generateSystemData = (systemId: number): SystemData[] => {
  const data: SystemData[] = []
  const now = new Date()

  // Gerar dados para 48 horas (2 dias)
  for (let i = 48; i >= 0; i--) {
    const date = new Date()
    date.setHours(now.getHours() - i)

    // Formato da data para tooltip (dia e hora)
    const tooltipDate = `${date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    })} ${date.getHours().toString().padStart(2, "0")}:00h`

    // Gerar status aleatório com maior probabilidade de estar operacional
    const rand = Math.random() * 100
    let status: Status = "Operational"
    if (rand < 5) status = "Downtime"
    else if (rand < 8) status = "Inactive"

    data.push({
      tooltip: tooltipDate,
      status,
    })
  }

  return data
}
