interface SystemPageProps {
  params: {
    id: string
  }
}

// Interface para representar um serviço de canal
interface ChannelService {
  id: number
  name: string
  serviceNumber: number
  pids: {
    audio: number[]
    video: number
    subtitle: number[]
  }
  keyStatus: {
    audio: ("odd" | "even")[]
    video: "odd" | "even"
    subtitle: ("odd" | "even")[]
  }
}

// Função para gerar dados mock para os serviços
function generateMockServices(systemId: string): ChannelService[] {
  const seed = parseInt(systemId, 10) || 1

  return Array.from({ length: 5 }, (_, index) => {
    const serviceId = index + 1
    return {
      id: serviceId,
      name: `Canal ${serviceId}`,
      serviceNumber: 1000 + serviceId + seed,
      pids: {
        audio: [100 + serviceId * 10, 101 + serviceId * 10],
        video: 200 + serviceId * 10,
        subtitle: [300 + serviceId * 10, 301 + serviceId * 10],
      },
      keyStatus: {
        audio: [
          serviceId % 2 === 0 ? "even" : "odd",
          (serviceId + 1) % 2 === 0 ? "even" : "odd",
        ],
        video: serviceId % 2 === 0 ? "even" : "odd",
        subtitle: [
          serviceId % 2 === 0 ? "even" : "odd",
          (serviceId + 1) % 2 === 0 ? "even" : "odd",
        ],
      },
    }
  })
}

// Componente para exibir um card de serviço
function ServiceCard({ service }: { service: ChannelService }) {
  const getKeyBadge = (status: "odd" | "even") => {
    const bgColor = status === "odd" ? "bg-green-500" : "bg-blue-500"
    return (
      <span
        className={`ml-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white ${bgColor}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-700">
      <h2 className="mb-2 text-xl font-bold">{service.name}</h2>
      <div className="mb-2">
        <span className="font-semibold">Número do Serviço:</span>{" "}
        {service.serviceNumber}
      </div>
      <div className="mb-2">
        <span className="font-semibold">PID de Vídeo:</span>{" "}
        {service.pids.video} {getKeyBadge(service.keyStatus.video)}
      </div>
      <div className="mb-2">
        <span className="font-semibold">PIDs de Áudio:</span>{" "}
        {service.pids.audio.map((pid, index) => (
          <span key={pid}>
            {index > 0 ? ", " : ""}
            {pid} {getKeyBadge(service.keyStatus.audio[index])}
          </span>
        ))}
      </div>
      <div>
        <span className="font-semibold">PIDs de Legenda:</span>{" "}
        {service.pids.subtitle.map((pid, index) => (
          <span key={pid}>
            {index > 0 ? ", " : ""}
            {pid} {getKeyBadge(service.keyStatus.subtitle[index])}
          </span>
        ))}
      </div>
    </div>
  )
}

// Componente página para sistemas/[id]
export default async function SystemPage({ params }: SystemPageProps) {
  const { id } = params
  const services = generateMockServices(id)

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Sistema de Compressão</h1>
      <div className="mb-6 rounded-md bg-gray-100 p-4 dark:bg-gray-800">
        <p className="text-lg">
          ID do Sistema: <span className="font-mono">{id}</span>
        </p>
      </div>

      <h2 className="mb-4 text-xl font-semibold">Serviços de Canal</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  )
}
