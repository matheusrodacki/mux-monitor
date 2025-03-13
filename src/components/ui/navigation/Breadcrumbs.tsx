"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Breadcrumbs() {
  const pathname = usePathname()

  let breadcrumbs = []

  if (pathname.includes("/quotes/settings")) {
    breadcrumbs.push({
      name: "Configurações",
      href: "/quotes/settings",
      current: true,
    })
  } else if (pathname.includes("/quotes/monitoring")) {
    breadcrumbs.push({
      name: "Home",
      href: "/quotes/monitoring",
      current: true,
    })
  }

  return (
    <>
      <nav aria-label="Breadcrumb" className="ml-2">
        <ol role="list" className="flex items-center space-x-3 text-sm">
          {breadcrumbs.map((breadcrumb) => (
            <li key={breadcrumb.name} className="flex">
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
