import { Trash2Icon } from "lucide-react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { useAppContext } from "../context/AppContext"

const Bill = () => {

  const { clients, productsCatalog } = useAppContext()

  const [invoice, setInvoice] = useState({
    date: "",
    payment_method: ""
  })

  const [customer, setCustomer] = useState<any>({})
  const [products, setProducts] = useState([
    { description: "", quantity: 1, price: 0 }
  ])
  const [loading, setLoading] = useState(false)

  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem("invoices")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(history))
  }, [history])

  const selectClient = (id: number) => {
    const selected = clients.find((c:any) => c.id == id)
    if (!selected) return
    setCustomer(selected)
  }

  const addProduct = () => {
    setProducts(prev => [...prev, { description: "", quantity: 1, price: 0 }])
  }

  const updateProduct = (index: number, field: string, value: number | string) => {
    setProducts(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeProduct = (index: number) => {
    setProducts(prev => prev.filter((_, i) => i !== index))
  }

  const subtotal = products.reduce((acc, p) => acc + p.quantity * p.price, 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  const generateInvoice = async () => {

    if (!invoice.date || !invoice.payment_method) {
      toast.error("Completa los datos de la factura")
      return
    }

    if (!customer.identification) {
      toast.error("Selecciona un cliente")
      return
    }

    const validProducts = products.filter(p => p.description && p.price > 0)

    if (!validProducts.length) {
      toast.error("Agrega productos válidos")
      return
    }

    const toastId = toast.loading("Generando factura...")

    try {
      setLoading(true)

      const API_URL = import.meta.env.VITE_API_URL

      const response = await fetch(`${API_URL}/crear-factura`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ invoice, customer, products: validProducts })
      })

      const data = await response.json()
      toast.dismiss(toastId)

      if (!response.ok) return toast.error("Error al generar factura")

      toast.success("Factura generada")

      setHistory(prev => [...prev, {
        number: data.numero_factura,
        customer: customer.name,
        total,
        qr: data.qr,
        pdf: data.pdf,
        items: validProducts.map(p => ({
    name: p.description,
    quantity: p.quantity
  }))
      }])

      setInvoice({ date: "", payment_method: "" })
      setCustomer({})
      setProducts([{ description: "", quantity: 1, price: 0 }])

    } catch (err) {
      toast.dismiss(toastId)
      toast.error("Error en la factura")
    } finally {
      setLoading(false)
    }
  }

  return (

    <div className="max-w-7xl mx-auto p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Facturación</h1>
        <p className="text-gray-500">Crea y gestiona tus facturas fácilmente</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Facturas</p>
          <h3 className="text-2xl text-gray-800 font-bold">{history.length}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Ingresos</p>
          <h3 className="text-2xl text-gray-800 font-bold">
            ${history.reduce((a, b) => a + Number(b.total || 0), 0).toLocaleString()}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Promedio</p>
          <h3 className="text-2xl text-gray-800 font-bold">
            ${history.length
              ? (history.reduce((a, b) => a + Number(b.total || 0), 0) / history.length).toLocaleString()
              : 0}
          </h3>
        </div>

      </div>

      {/* FORM */}
      <div className="bg-white text-gray-800 p-6 rounded-xl shadow space-y-6">

        {/* DATOS */}
        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="date"
            className="input"
            value={invoice.date}
            onChange={(e) => setInvoice({...invoice, date: e.target.value})}
          />

          <select
            className="input"
            value={invoice.payment_method}
            onChange={(e) => setInvoice({...invoice, payment_method: e.target.value})}
          >
            <option value="">Método de pago</option>
            <option value="cash">Efectivo</option>
            <option value="transfer">Transferencia</option>
            <option value="card">Tarjeta</option>
          </select>

        </div>

        {/* CLIENTE */}
        <select
          className="input"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value
          if (!value) return
          selectClient(Number(value))
          }}
        >
          <option value="">Seleccionar cliente</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.identification}
            </option>
          ))}
        </select>

        {/* PRODUCTOS */}
        <div>

          <div className="flex justify-between mb-3">
            <h2 className="font-semibold text-gray-700">Productos</h2>

            <button
              onClick={addProduct}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              + Agregar
            </button>
          </div>

          <div className="space-y-3">
            {/* ENCABEZADO */}
    <div className="grid grid-cols-5 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-600">
      <span>Producto</span>
      <span className="text-center">Cantidad</span>
      <span className="text-center">Precio</span>
      <span className="text-center">Subtotal</span>
      <span className="text-center">Acción</span>
    </div>

            {products.map((p, i) => {

              const rowTotal = p.quantity * p.price

              return (
                <div key={i} className="grid md:grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded-lg">

                  <select
                    className="input"
                    value={p.description}
                    onChange={(e) => {
                      const prod = productsCatalog.find(x => x.name === e.target.value)
                      if (!prod) return
                      updateProduct(i, "description", prod.name)
                      updateProduct(i, "price", Number(prod.price))
                    }}
                  >
                    <option value="">Producto</option>
                    {productsCatalog.map(prod => (
                      <option key={prod.id} value={prod.name}>
                        {prod.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    className="input"
                    value={p.quantity}
                    onChange={(e) => updateProduct(i, "quantity", Number(e.target.value))}
                  />

                  <input
                    type="number"
                    className="input"
                    value={p.price}
                    onChange={(e) => updateProduct(i, "price", Number(e.target.value))}
                  />

                  <p className="text-center font-medium">
                    ${rowTotal.toLocaleString()}
                  </p>

                  <button onClick={() => removeProduct(i)} className="text-red-500">
                    <Trash2Icon size={18}/>
                  </button>

                </div>
              )

            })}

          </div>

        </div>

        {/* TOTAL */}
        <div className="flex justify-end">
          <div className="bg-gray-50 p-4 rounded-xl w-72 space-y-2">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>IVA</span>
              <span>${tax.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-bold text-lg text-indigo-600">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>

          </div>
        </div>

        {/* BOTÓN */}
        <div className="flex justify-end">
          <button
            onClick={generateInvoice}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            {loading ? "Generando..." : "Generar factura"}
          </button>
        </div>

      </div>

    </div>
  )
}

export default Bill