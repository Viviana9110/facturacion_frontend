import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type Invoice = {
  customer: string
  total: number | string
}

type TopClientsProps = {
  invoices: Invoice[]
}

const TopClients = ({ invoices }: TopClientsProps) => {

  const getTopClients = () => {

    const clients: Record<string, number> = {}

    invoices.forEach((inv) => {

      if (!clients[inv.customer]) {
        clients[inv.customer] = 0
      }

      clients[inv.customer] += Number(inv.total)

    })

    return Object.entries(clients)
      .map(([name, total]) => ({ name, total: Number(total) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

  }

  const data = getTopClients()

  return (

    <div className="h-72">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <XAxis dataKey="name"/>

          <YAxis/>

          <Tooltip/>

          <Bar dataKey="total" fill="#22c55e"/>

        </BarChart>

      </ResponsiveContainer>

    </div>

  )

}

export default TopClients