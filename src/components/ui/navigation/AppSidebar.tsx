"use client"
import { Divider } from "@/components/Divider"
import { Input } from "@/components/Input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarLink,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSubLink,
} from "@/components/Sidebar"
import { cx, focusRing } from "@/lib/utils"
import { RiArrowDownSFill } from "@remixicon/react"
import {
  BookText,
  Cog,
  House,
  LucideIcon,
  PackageSearch,
  Server,
} from "lucide-react"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Logo } from "../../../../public/Logo"
import { UserProfile } from "./UserProfile"

// Tipagem para item de navegação simples
interface NavigationItem {
  name: string
  href: string
  icon: string // Alterado para string
  notifications?: number | boolean
  active: boolean
}

// Tipagem para item com submenu
interface NavigationItemWithChildren {
  name: string
  href: string
  icon: string // Alterado para componente de ícone
  children?: {
    name: string
    href: string
    active: boolean
  }[]
}

// Mapeamento de strings para componentes de ícones
const iconMap: Record<string, LucideIcon> = {
  House,
  Cog,
  Server,
  BookText,
  PackageSearch,
  // adicione mais ícones conforme necessário
}

// Interface de props para o componente AppSidebar
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  sidebarData: {
    navigation: NavigationItem[]
    navigation2: NavigationItemWithChildren[]
  }
}

export function AppSidebar({ sidebarData, ...props }: AppSidebarProps) {
  const { navigation, navigation2 } = sidebarData
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = React.useState<string[]>(() => {
    return navigation2.map((item) => item.name)
  })

  const toggleMenu = (name: string) => {
    setOpenMenus((prev: string[]) =>
      prev.includes(name)
        ? prev.filter((item: string) => item !== name)
        : [...prev, name],
    )
  }

  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-925">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-white p-1.5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
            <Logo className="size-6 text-blue-500 dark:text-blue-500" />
          </span>
          <div>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
              Innovex Systems
            </span>
            <span className="block text-xs text-gray-900 dark:text-gray-50">
              Premium Starter Plan
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Input
              type="search"
              placeholder="Search items..."
              className="[&>input]:sm:py-1.5"
            />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="pt-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => {
                const IconComponent = iconMap[item.icon] || (() => null)
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarLink
                      href={item.href}
                      isActive={pathname === item.href}
                      icon={IconComponent}
                      notifications={item.notifications}
                    >
                      {item.name}
                    </SidebarLink>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Renderiza o divisor apenas se existirem itens em navigation2 */}
        {navigation2.length > 0 && (
          <div className="px-3">
            <Divider className="my-0 py-0" />
          </div>
        )}

        {/* Renderiza o grupo de navegação secundário apenas se houver itens */}
        {navigation2.length > 0 && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-4">
                {navigation2.map((item) => {
                  const IconComponent = iconMap[item.icon] || (() => null)
                  return (
                    <SidebarMenuItem key={item.name}>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={cx(
                          "flex w-full items-center justify-between gap-x-2.5 rounded-md p-2 text-base text-gray-900 transition hover:bg-gray-200/50 sm:text-sm dark:text-gray-400 hover:dark:bg-gray-900 hover:dark:text-gray-50",
                          focusRing,
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent
                            className="size-[18px] shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </div>
                        <RiArrowDownSFill
                          className={cx(
                            openMenus.includes(item.name)
                              ? "rotate-0"
                              : "-rotate-90",
                            "size-5 shrink-0 transform text-gray-400 transition-transform duration-150 ease-in-out dark:text-gray-600",
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {item.children &&
                        item.children.length > 0 &&
                        openMenus.includes(item.name) && (
                          <SidebarMenuSub>
                            <div className="absolute inset-y-0 left-4 w-px bg-gray-300 dark:bg-gray-800" />
                            {item.children.map((child) => (
                              <SidebarMenuItem key={child.name}>
                                <SidebarSubLink
                                  href={child.href}
                                  isActive={pathname === child.href}
                                >
                                  {child.name}
                                </SidebarSubLink>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
