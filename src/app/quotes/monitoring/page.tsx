"use client"

import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiShieldKeyholeFill,
  RiStopCircleFill,
} from "@remixicon/react"

import { Card } from "@/components/Card"
import { Tracker } from "@/components/Tracker"
import { JSX } from "react"

// Função para gerar dados aleatórios por hora
const generateSystemData = (systemId: number) => {
  const data: { tooltip: string; status: Status }[] = []
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

// Atualização do modelo de dados para incluir informações de ECMG
const systems = Array.from({ length: 15 }, (_, i) => {
  const systemId = i + 1
  const primaryData = generateSystemData(systemId)
  const backupData = generateSystemData(systemId)

  // Gerar aleatoriamente as conexões ECMG (primário ou backup)
  const ecmgConnections = {
    synamedia: Math.random() > 0.5 ? "Primário" : "Backup",
    nagra: Math.random() > 0.5 ? "Primário" : "Backup",
    verimatrix: Math.random() > 0.5 ? "Primário" : "Backup",
    nagraTVRO: Math.random() > 0.5 ? "Primário" : "Backup",
  }

  return {
    id: systemId,
    name: `Sistema de Compressão ${systemId}`,
    location: `Plataforma ${String.fromCharCode(65 + (i % 8))}-${Math.floor(i / 8) + 1}`,
    status: primaryData[primaryData.length - 1].status,
    lastRun: new Date().toLocaleString("pt-BR"),
    ecmgConnections,
    primary: {
      name: "MUX Primário",
      data: primaryData,
      status: primaryData[primaryData.length - 1].status,
    },
    backup: {
      name: "MUX Backup",
      data: backupData,
      status: backupData[backupData.length - 1].status,
    },
  }
})

type Status = "Operational" | "Downtime" | "Inactive"

const colorMapping: Record<Status, string> = {
  Operational: "bg-emerald-500 dark:bg-emerald-500",
  Downtime: "bg-red-500 dark:bg-red-500",
  Inactive: "bg-gray-300 dark:bg-gray-700",
}

const statusIcons: Record<Status, JSX.Element> = {
  Operational: (
    <RiCheckboxCircleFill
      className="size-5 shrink-0 text-emerald-500 dark:text-emerald-500"
      aria-hidden={true}
    />
  ),
  Downtime: (
    <RiErrorWarningFill
      className="size-5 shrink-0 text-red-500 dark:text-red-500"
      aria-hidden={true}
    />
  ),
  Inactive: (
    <RiStopCircleFill
      className="size-5 shrink-0 text-gray-500 dark:text-gray-500"
      aria-hidden={true}
    />
  ),
}

const statusLabels: Record<Status, string> = {
  Operational: "Operacional",
  Downtime: "Falha",
  Inactive: "Inativo",
}

const statusColors: Record<Status, string> = {
  Operational: "text-emerald-500 dark:text-emerald-500",
  Downtime: "text-red-500 dark:text-red-500",
  Inactive: "text-gray-500 dark:text-gray-500",
}

interface SystemData {
  tooltip: string
  status: Status
}

interface MuxSystem {
  name: string
  data: SystemData[]
  status: Status
}

interface System {
  id: number
  name: string
  location: string
  status: Status
  lastRun: string
  ecmgConnections: {
    synamedia: string
    nagra: string
    verimatrix: string
    nagraTVRO: string
  }
  primary: MuxSystem
  backup: MuxSystem
}

const SystemCard = ({ system }: { system: System }) => {
  const primaryData = system.primary.data.map((item) => ({
    ...item,
    color: colorMapping[item.status as Status],
  }))

  const backupData = system.backup.data.map((item) => ({
    ...item,
    color: colorMapping[item.status as Status],
  }))

  const systemStatus = system.status as Status

  return (
    <Card className="h-full">
      <div className="flex space-x-2">
        <span
          className={`w-1.5 shrink-0 rounded ${colorMapping[systemStatus]}`}
          aria-hidden={true}
        />
        <div className="w-full">
          <div className="flex items-center space-x-1.5">
            {statusIcons[systemStatus]}
            <span
              className={`text-sm font-medium ${statusColors[systemStatus]}`}
            >
              {statusLabels[systemStatus]}
            </span>
          </div>
          <h3 className="mt-1.5 text-lg font-medium text-gray-900 dark:text-gray-50">
            {system.name}
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <span
              tabIndex={1}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <RiShieldKeyholeFill
                className="-ml-0.5 size-3.5 shrink-0"
                aria-hidden={true}
              />
              Syn: {system.ecmgConnections.synamedia}
            </span>
            <span
              tabIndex={1}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <RiShieldKeyholeFill
                className="-ml-0.5 size-3.5 shrink-0"
                aria-hidden={true}
              />
              Nagra 1: {system.ecmgConnections.nagra}
            </span>
            <span
              tabIndex={1}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <RiShieldKeyholeFill
                className="-ml-0.5 size-3.5 shrink-0"
                aria-hidden={true}
              />
              Vx: {system.ecmgConnections.verimatrix}
            </span>
            <span
              tabIndex={1}
              className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400"
            >
              <RiShieldKeyholeFill
                className="-ml-0.5 size-3.5 shrink-0"
                aria-hidden={true}
              />
              Nagra 2: {system.ecmgConnections.nagraTVRO}
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {system.primary.name}
              </span>
              <span
                className={`${statusColors[system.primary.status as Status]}`}
              >
                {statusLabels[system.primary.status as Status]}
              </span>
            </div>
            <Tracker
              data={primaryData.slice(0, 48)}
              className="hidden h-5 sm:flex"
            />
            <Tracker
              data={primaryData.slice(24, 48)}
              className="flex h-5 sm:hidden"
            />
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {system.backup.name}
              </span>
              <span
                className={`${statusColors[system.backup.status as Status]}`}
              >
                {statusLabels[system.backup.status as Status]}
              </span>
            </div>
            <Tracker
              data={backupData.slice(0, 48)}
              className="hidden h-5 sm:flex"
            />
            <Tracker
              data={backupData.slice(24, 48)}
              className="flex h-5 sm:hidden"
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
            <span className="hidden sm:block">48 horas</span>
            <span className="sm:hidden">24 horas</span>
            <span>Agora</span>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function Monitoring() {
  return (
    <section
      aria-label="Monitoramento de Sistemas de Compressão"
      className="flex min-h-screen w-full flex-col overflow-auto p-3"
    >
      <div className="grid grid-cols-5 gap-3 pb-3">
        {systems.map((system) => (
          <SystemCard key={system.id} system={system} />
        ))}
      </div>
    </section>
  )
}
