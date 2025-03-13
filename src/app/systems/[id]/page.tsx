interface SystemPageProps {
  params: {
    id: string
  }
}

// Componente página para sistemas/[id]
export default async function SystemPage({ params }: SystemPageProps) {
  const { id } = await params

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Sistema</h1>
      <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-800">
        <p className="text-lg">
          ID do Sistema: <span className="font-mono">{id}</span>
        </p>
      </div>
    </div>
  )
}
