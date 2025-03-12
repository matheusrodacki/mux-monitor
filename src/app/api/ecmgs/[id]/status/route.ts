import { EcmgStatus } from "@/types/ecmg"
import { NextResponse } from "next/server"

// Função para gerar status simulado de um ECMG
function generateEcmgStatus(id: number): EcmgStatus {
  // Aleatoriamente define se o servidor primário ou backup está ativo
  const isFirstServerActive = Math.random() > 0.5

  return {
    ecmguid: id,
    servers: [
      // Primeiro servidor (prioridade 0)
      {
        priority: 0,
        state: isFirstServerActive ? 3 : 0,
      },
      // Segundo servidor (prioridade 1)
      {
        priority: 1,
        state: isFirstServerActive ? 0 : 3,
      },
    ],
    activeserverpriority: isFirstServerActive ? 0 : 1,
  }
}

// Map dos IDs de ECMGs para seus nomes (opcional, para validação)
const ecmgIdMap = {
  4: "ECMG SKY",
  56274: "ECMG SKY - NAGRA",
  65631: "ECMG VERIMATRIX",
  80789: "ECMG NAGRA - TVRO",
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    // Em um cenário real, faríamos uma solicitação para a API externa:
    // const response = await fetch(`http://10.218.31.73/api/v1/mux/cas/ecmgs/${id}/status`, {
    //   headers: {
    //     'Accept': 'application/json, text/plain',
    //     'token': 'eef8a892fcd143a3acf1598a7e9c2fa9',
    //     // Outros cabeçalhos necessários
    //   }
    // });
    // const status = await response.json();

    // Mas aqui, geramos dados simulados
    const status = generateEcmgStatus(id)

    return NextResponse.json(status)
  } catch (error) {
    console.error("Erro ao buscar status do ECMG:", error)
    return NextResponse.json(
      { error: "Erro ao buscar status do ECMG" },
      { status: 500 },
    )
  }
}
