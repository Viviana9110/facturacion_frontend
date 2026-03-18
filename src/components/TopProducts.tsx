import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type Item = {
  name: string
  quantity: number
}

type Invoice = {
  items?: Item[]
}

type TopProductsProps = {
  invoices: Invoice[]
}

const TopProducts = ({ invoices }: TopProductsProps) => {

  const getTopProducts = () => {

    const productMap: Record<string, number> = {}

    invoices.forEach((inv) => {

      inv.items?.forEach((item) => {

        if (!productMap[item.name]) {
          productMap[item.name] = 0
        }

        productMap[item.name] += item.quantity

      })

    })

    return Object.entries(productMap)
      .map(([name, qty]) => ({ name, qty: Number(qty) }))
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