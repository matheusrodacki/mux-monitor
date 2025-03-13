import { Sidebar } from "@/components/Sidebar"
import prisma from "@/lib/prisma"
import * as React from "react"
import { AppSidebar } from "./AppSidebar"

// Defina as interfaces localmente
interface NavigationItem {
  name: string
  href: string
  icon: string
  notifications?: number | boolean
  active: boolean
}

interface NavigationItemWithChildren {
  name: string
  href: string
  icon: string
  children?: {
    name: string
    href: string
    active: boolean
  }[]
}

// Defina AppSidebarProps localmente
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sidebarData: {
    navigation: NavigationItem[]
    navigation2: NavigationItemWithChildren[]
  }
}

// Função assíncrona para buscar os itens do banco
async function getSidebarItems() {
  // Itens fixos de navegação
  const navigationItems: NavigationItem[] = [
    {
      name: "Home",
      href: "/monitoring",
      icon: "House",
      notifications: false,
      active: false,
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: "Cog",
      notifications: false,
      active: false,
    },
  ]

  // Buscar sistemas do banco de dados
  try {
    const systems = await prisma.compressionSystem.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        muxes: true,
      },
    })

    // Criar item de menu para Sistemas com submenu baseado nos dados obtidos
    const systemsMenuItem: NavigationItemWithChildren = {
      name: "Sistemas",
      href: "#",
      icon: "Server",
      children: systems.map((system) => ({
        name: system.name,
        href: `/systems/${system.id}`,
        active: false, // Definir lógica de ativo conforme necessário
      })),
    }

    return {
      navigation: navigationItems,
      navigation2: [systemsMenuItem],
    }
  } catch (error) {
    console.error("Erro ao buscar sistemas para o menu:", error)
    // Em caso de erro, retorna apenas os itens fixos
    return {
      navigation: navigationItems,
      navigation2: [],
    }
  }
}

// Define props sem precisar de "sidebarData" pois ele é buscado internamente.
type ServerAppSidebarProps = Omit<AppSidebarProps, "sidebarData">

export default async function ServerAppSidebar(props: ServerAppSidebarProps) {
  const sidebarItems = await getSidebarItems()

  // Passa os dados já obtidos como props para AppSidebar.
  return <AppSidebar {...props} sidebarData={sidebarItems} />
}
