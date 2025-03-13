"use client"

import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Toaster } from "@/components/Toaster"
import { useToast } from "@/hooks/useToast"
import { RiAddLine, RiDeleteBinLine, RiPencilLine } from "@remixicon/react"
import { useEffect, useState } from "react"

// Tipos para os formulários
interface SystemFormData {
  id?: number
  name: string
  status: string
}

interface MuxFormData {
  id?: number
  ipAddress: string
  type: "PRIMARY" | "BACKUP"
  systemId: number
}

export default function Settings() {
  // Estados para sistemas e muxes
  const [systems, setSystems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedSystem, setExpandedSystem] = useState<number | null>(null)

  // Estados para formulários
  const [showSystemForm, setShowSystemForm] = useState(false)
  const [showMuxForm, setShowMuxForm] = useState(false)
  const [editingSystem, setEditingSystem] = useState<SystemFormData | null>(
    null,
  )
  const [editingMux, setEditingMux] = useState<MuxFormData | null>(null)

  const { toast } = useToast()

  // Buscar sistemas e muxes
  useEffect(() => {
    async function fetchSystems() {
      try {
        setLoading(true)
        const response = await fetch("/api/systems")

        if (!response.ok) {
          throw new Error("Erro ao buscar sistemas")
        }

        const data = await response.json()
        setSystems(data.systems || [])
      } catch (error) {
        console.error(error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os sistemas",
          variant: "error",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSystems()
  }, [toast])

  // Expandir/recolher sistema para mostrar muxes
  const toggleExpand = (systemId: number) => {
    setExpandedSystem(expandedSystem === systemId ? null : systemId)
  }

  // Funções para adicionar/editar sistema
  const handleAddSystem = () => {
    setEditingSystem({ name: "", status: "Operational" })
    setShowSystemForm(true)
  }

  const handleEditSystem = (system: any) => {
    setEditingSystem({
      id: system.id,
      name: system.name,
      status: system.status,
    })
    setShowSystemForm(true)
  }

  // Funções para adicionar/editar mux
  const handleAddMux = (systemId: number) => {
    setEditingMux({
      ipAddress: "",
      type: "PRIMARY",
      systemId,
    })
    setShowMuxForm(true)
  }

  const handleEditMux = (mux: any) => {
    setEditingMux({
      id: mux.id,
      ipAddress: mux.ipAddress,
      type: mux.type,
      systemId: mux.systemId,
    })
    setShowMuxForm(true)
  }

  // Funções para salvar sistema/mux
  const handleSaveSystem = async (formData: SystemFormData) => {
    try {
      const url = formData.id ? `/api/systems/${formData.id}` : "/api/systems"
      const method = formData.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar sistema")
      }

      // Recarregar sistemas
      const systemsResponse = await fetch("/api/systems")
      const data = await systemsResponse.json()
      setSystems(data.systems)

      setShowSystemForm(false)
      toast({
        title: "Sucesso",
        description: `Sistema ${formData.id ? "atualizado" : "adicionado"} com sucesso`,
        variant: "success",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o sistema",
        variant: "error",
      })
    }
  }

  const handleSaveMux = async (formData: MuxFormData) => {
    try {
      const url = formData.id
        ? `/api/muxes/${formData.id}`
        : `/api/systems/${formData.systemId}/muxes`
      const method = formData.id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Erro ao salvar mux")
      }

      // Recarregar sistemas
      const systemsResponse = await fetch("/api/systems")
      const data = await systemsResponse.json()
      setSystems(data.systems)

      setShowMuxForm(false)
      toast({
        title: "Sucesso",
        description: `MUX ${formData.id ? "atualizado" : "adicionado"} com sucesso`,
        variant: "success",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível salvar o MUX",
        variant: "error",
      })
    }
  }

  // Função para excluir sistema
  const handleDeleteSystem = async (systemId: number) => {
    if (!confirm("Tem certeza que deseja excluir este sistema?")) return

    try {
      const response = await fetch(`/api/systems/${systemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir sistema")
      }

      // Atualizar lista
      setSystems(systems.filter((sys) => sys.id !== systemId))
      toast({
        title: "Sucesso",
        description: "Sistema excluído com sucesso",
        variant: "success",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o sistema",
        variant: "error",
      })
    }
  }

  // Função para excluir mux
  const handleDeleteMux = async (muxId: number) => {
    if (!confirm("Tem certeza que deseja excluir este MUX?")) return

    try {
      const response = await fetch(`/api/muxes/${muxId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erro ao excluir MUX")
      }

      // Atualizar lista de sistemas
      const systemsResponse = await fetch("/api/systems")
      const data = await systemsResponse.json()
      setSystems(data.systems)

      toast({
        title: "Sucesso",
        description: "MUX excluído com sucesso",
        variant: "success",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o MUX",
        variant: "error",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p>Carregando configurações...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <Button onClick={handleAddSystem} className="flex items-center gap-2">
          <RiAddLine className="h-5 w-5" />
          Adicionar Sistema
        </Button>
      </div>

      {/* Lista de Sistemas */}
      <div className="space-y-4">
        {systems.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">Nenhum sistema cadastrado</p>
          </Card>
        ) : (
          systems.map((system) => (
            <Card key={system.id} className="overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <div>
                  <h3 className="text-lg font-medium">{system.name}</h3>
                  <p className="text-sm text-gray-500">{system.location}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    onClick={() => toggleExpand(system.id)}
                  >
                    {expandedSystem === system.id
                      ? "Ocultar MUXs"
                      : "Mostrar MUXs"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleEditSystem(system)}
                  >
                    <RiPencilLine className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteSystem(system.id)}
                  >
                    <RiDeleteBinLine className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* MUXes do sistema */}
              {expandedSystem === system.id && (
                <div className="border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <div className="flex justify-end p-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleAddMux(system.id)}
                      className="flex items-center gap-1 py-1 text-sm"
                    >
                      <RiAddLine className="h-4 w-4" />
                      Adicionar MUX
                    </Button>
                  </div>
                  {system.muxes && system.muxes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              IP
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Tipo
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {system.muxes.map((mux: any) => (
                            <tr
                              key={mux.id}
                              className="border-b border-gray-200 dark:border-gray-700"
                            >
                              <td className="px-4 py-3">{mux.ipAddress}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded px-2 py-1 text-xs font-medium ${
                                    mux.type === "PRIMARY"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                      : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                  }`}
                                >
                                  {mux.type === "PRIMARY"
                                    ? "Primário"
                                    : "Backup"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex space-x-2">
                                  <Button
                                    variant="ghost"
                                    className="py-1 text-sm"
                                    onClick={() => handleEditMux(mux)}
                                  >
                                    <RiPencilLine className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="py-1 text-sm text-red-500 hover:text-red-700"
                                    onClick={() => handleDeleteMux(mux.id)}
                                  >
                                    <RiDeleteBinLine className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="p-4 text-center text-gray-500">
                      Nenhum MUX cadastrado para este sistema
                    </p>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Modais de formulários */}
      {showSystemForm && (
        <SystemFormModal
          system={editingSystem}
          onClose={() => setShowSystemForm(false)}
          onSave={handleSaveSystem}
        />
      )}

      {showMuxForm && (
        <MuxFormModal
          mux={editingMux}
          onClose={() => setShowMuxForm(false)}
          onSave={handleSaveMux}
          systems={systems}
        />
      )}
    </div>
  )
}

// Componente de modal para o formulário de sistema
function SystemFormModal({
  system,
  onClose,
  onSave,
}: {
  system: SystemFormData | null
  onClose: () => void
  onSave: (data: SystemFormData) => void
}) {
  const [formData, setFormData] = useState<SystemFormData>(
    system || {
      name: "",
      status: "Operational",
    },
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 dark:text-gray-100">
        <h2 className="mb-4 text-xl font-semibold">
          {system?.id ? "Editar Sistema" : "Novo Sistema"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-1 block font-medium dark:text-gray-200"
            >
              Nome
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="status"
              className="mb-1 block font-medium dark:text-gray-200"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="Operational">Operacional</option>
              <option value="Inactive">Inativo</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componente de modal para o formulário de MUX
function MuxFormModal({
  mux,
  onClose,
  onSave,
  systems,
}: {
  mux: MuxFormData | null
  onClose: () => void
  onSave: (data: MuxFormData) => void
  systems: any[]
}) {
  const [formData, setFormData] = useState<MuxFormData>(
    mux || {
      ipAddress: "",
      type: "PRIMARY",
      systemId: systems[0]?.id || 0,
    },
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "systemId" ? parseInt(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800 dark:text-gray-100">
        <h2 className="mb-4 text-xl font-semibold">
          {mux?.id ? "Editar MUX" : "Novo MUX"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="ipAddress"
              className="mb-1 block font-medium dark:text-gray-200"
            >
              Endereço IP
            </label>
            <input
              type="text"
              id="ipAddress"
              name="ipAddress"
              value={formData.ipAddress}
              onChange={handleChange}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="mb-1 block font-medium dark:text-gray-200"
            >
              Tipo
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            >
              <option value="PRIMARY">Primário</option>
              <option value="BACKUP">Backup</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="systemId"
              className="mb-1 block font-medium dark:text-gray-200"
            >
              Sistema
            </label>
            <select
              id="systemId"
              name="systemId"
              value={formData.systemId}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              disabled={mux?.id !== undefined}
            >
              {systems.map((sys) => (
                <option key={sys.id} value={sys.id}>
                  {sys.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
