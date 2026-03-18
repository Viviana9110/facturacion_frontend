import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const TopClients = ({ invoices }) => {

  const getTopClients = () => {

    const clients = {}

    invoices.forEach(inv => {

      if (!clients[inv.customer]) {
        clients[inv.customer] = 0
      }

      clients[inv.customer] += Number(inv.total)

    })

    return Object.entries(clients)
      .map(([name, total]) => ({ name, total }))
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