"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function Breadcrumbs() {
  const pathname = usePathname()
  const [breadcrumbs, setBreadcrumbs] = useState<
    { name: string; href: string; current: boolean }[]
  >([])

  useEffect(() => {
    async function loadBreadcrumbs() {
      // Breadcrumbs padrão
      let newBreadcrumbs = []

      if (pathname.includes("/settings")) {
        newBreadcrumbs.push({
          name: "Configurações",
          href: "/settings",
          current: true,
        })
      } else if (pathname.includes("/monitoring")) {
        newBreadcrumbs.push({
          name: "Home",
          href: "/monitoring",
          current: true,
        })
      } else if (pathname.includes("/systems")) {
        // Adiciona breadcrumb para Sistemas
        newBreadcrumbs.push({
          name: "Sistemas",
          href: "#",
          current: false,
        })

        // Verifica se é um sistema específico (/systems/[id])
        const match = pathname.match(/\/systems\/(\d+)/)
        if (match) {
          const systemId = match[1]

          try {
            // Busca dados do sistema
            const response = await fetch(`/api/systems/${systemId}`)
            if (response.ok) {
              const data = await response.json()
              newBreadcrumbs.push({
                name: data.system.name,
                href: `/systems/${systemId}`,
                current: true,
              })
            }
          } catch (error) {
            console.error("Erro ao buscar nome do sistema:", error)
            newBreadcrumbs.push({
              name: `Sistema ${systemId}`,
              href: `/systems/${systemId}`,
              current: true,
            })
          }
        } else {
          // É a página de listagem de sistemas
          newBreadcrumbs[0].current = true
        }
      }

      setBreadcrumbs(newBreadcrumbs)
    }

    loadBreadcrumbs()
  }, [pathname])

  return (
    <>
      <nav aria-label="Breadcrumb" className="ml-2">
        <ol role="list" className="flex items-center space-x-3 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.name} className="flex">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <div className="flex items-center">
                <Link
                  href={breadcrumb.href}
                  aria-current={breadcrumb.current ? "page" : undefined}
                  className={
                    breadcrumb.current
                      ? "text-gray-900 dark:text-gray-50"
                      : "text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
                  }
                >
                  {breadcrumb.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
