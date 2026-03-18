import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const TopProducts = ({ invoices }) => {

  const getTopProducts = () => {

    const productMap = {}

    invoices.forEach(inv => {

      inv.items?.forEach(item => {

        if (!productMap[item.name]) {
          productMap[item.name] = 0
        }

        productMap[item.name] += item.quantity

      })

    })

    return Object.entries(productMap)
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)

  }

  const data = getTopProducts()

  return (

    <div className="h-72">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <XAxis dataKey="name"/>

          <YAxis/>

          <Tooltip/>

          <Bar dataKey="qty" fill="#6366f1"/>

        </BarChart>

      </ResponsiveContainer>

    </div>

  )

}

export default TopProducts