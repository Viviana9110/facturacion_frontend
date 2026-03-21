import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type InvoiceItem = {
  name: string
  quantity: number
}

type Invoice = {
  items?: InvoiceItem[]
}

type TopProductsProps = {
  invoices: Invoice[]
}

const TopProducts = ({ invoices }: TopProductsProps) => {

  const getTopProducts = () => {
    const products: Record<string, number> = {}

    invoices.forEach((inv) => {
      inv.items?.forEach((item) => {
        if (!products[item.name]) {
          products[item.name] = 0
        }
        products[item.name] += Number(item.quantity)
      })
    })

    return Object.entries(products)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  }

  const data = getTopProducts()

  return (
    <div className="h-72">

      <ResponsiveContainer width="100%" height="100%">

        <BarChart data={data}>

          <XAxis dataKey="name" />

          <YAxis
            allowDecimals={false}  // 👈 Esto evita números .5
            interval={0}           // 👈 Muestra cada número entero
          />

          <Tooltip />

         <Bar dataKey="quantity" fill="url(#colorGradient)" />

  <defs>
    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
    </linearGradient>
  </defs>
        </BarChart>

      </ResponsiveContainer>

    </div>
  )
}

export default TopProducts