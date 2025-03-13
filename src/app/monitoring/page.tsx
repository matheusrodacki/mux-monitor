"use client"

import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiShieldKeyholeFill,
  RiStopCircleFill,
} from "@remixicon/react"
import { JSX, useEffect, useState } from "react"

import { Card } from "@/components/Card"
import { Tracker } from "@/components/Tracker"
import { Status, System } from "@/types/mux"

// Constantes de mapeamento de status
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
  const [systems, setSystems] = useState<System[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Usar nossa nova API de monitoramento
        const response = await fetch("/api/monitoring")

        if (!response.ok) {
          throw new Error("Falha ao carregar dados dos sistemas")
        }

        const data = await response.json()
        setSystems(data.systems)
        setError(null)
      } catch (err) {
        setError("Erro ao carregar dados. Tente novamente.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Atualizar a cada 30 segundos
    const intervalId = setInterval(() => {
      fetchData()
    }, 30000)

    return () => clearInterval(intervalId)
  }, [])

  if (loading) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center">
        <p className="text-gray-500">Carregando sistemas...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="flex min-h-screen w-full flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Tentar novamente
        </button>
      </section>
    )
  }

  return (
    <section
      aria-label="Monitoramento de Sistemas de Compressão"
      className="flex min-h-screen w-full flex-col overflow-auto p-3"
    >
      <div className="grid grid-cols-1 gap-3 pb-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {systems.map((system) => (
          <SystemCard key={system.id} system={system} />
        ))}
      </div>
    </section>
  )
}
