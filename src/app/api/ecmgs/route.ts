import { Ecmg } from "@/types/ecmg"
import { NextResponse } from "next/server"

// Dados simulados baseados no exemplo ecmgs_response.json
const mockEcmgs: Ecmg[] = [
  {
    Name: "ECMG SKY",
    CASystemID: 2374,
    CASubsystemID: 1,
    ChannelID: 7,
    CAAlgorithm: "DVB CSA",
    CAAesScramblingMode: "CBC",
    ScramblingDesc: true,
    PrivateData: "",
    ServersList: [{ Address: "10.218.222.152", Port: 11113 }],
    UID: 4,
  },
  {
    Name: "ECMG SKY - NAGRA",
    CASystemID: 6187,
    CASubsystemID: 0,
    ChannelID: 7,
    CAAlgorithm: "DVB CSA",
    CAAesScramblingMode: "ECB",
    ScramblingDesc: true,
    PrivateData: "",
    ServersList: [
      { Address: "10.218.213.136", Port: 3335 },
      { Address: "10.218.213.137", Port: 3335 },
    ],
    UID: 56274,
  },
  {
    Name: "ECMG VERIMATRIX",
    CASystemID: 5914,
    CASubsystemID: 5,
    ChannelID: 111,
    CAAlgorithm: "DVB CSA",
    CAAesScramblingMode: "ECB",
    ScramblingDesc: true,
    PrivateData: "",
    ServersList: [{ Address: "10.218.215.10", Port: 12000 }],
    UID: 65631,
  },
  {
    Name: "ECMG NAGRA - TVRO",
    CASystemID: 6250,
    CASubsystemID: 1,
    ChannelID: 7,
    CAAlgorithm: "DVB CSA",
    CAAesScramblingMode: "ECB",
    ScramblingDesc: true,
    PrivateData: "",
    ServersList: [
      { Address: "10.218.214.134", Port: 3340 },
      { Address: "10.218.214.135", Port: 3340 },
    ],
    UID: 80789,
  },
]

export async function GET() {
  try {
    // Em um cenário real, faríamos uma solicitação para a API externa:
    // const response = await fetch('http://10.218.31.68/api/v1/mux/cas/ecmgs', {
    //   headers: {
    //     'Accept': '*/*',
    //     'Authorization': 'Basic T3BlcmF0b3I6VGl0YW5NdXhAQXQzbWU=',
    //     // Outros cabeçalhos necessários
    //   }
    // });
    // const ecmgs = await response.json();

    // Mas aqui, usamos dados simulados
    return NextResponse.json({ ecmgs: mockEcmgs })
  } catch (error) {
    console.error("Erro ao buscar ECMGs:", error)
    return NextResponse.json(
      { error: "Erro ao buscar informações dos ECMGs" },
      { status: 500 },
    )
  }
}
