import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import { ReceiptIcon, Users2Icon, PackageIcon, PlusCircleIcon } from "lucide-react"

import TopProducts from "../components/TopProducts"
import TopClients from "../components/TopClients"

type Invoice = {
  number: string
  customer: string
  total: number
  qr: string
  pdf: string
  items?: {
    name: string
    quantity: number
  }[]
}

const Dashboard = () => {

  const navigate = useNavigate()

  const { user, clients, productsCatalog } = useAppContext()

  const loadUserData = () => {

    /*const today = new Date().toISOString().split('T')[0]*/

  }

  useEffect(() => {
    loadUserData()
  }, [])

  

  // HISTORIAL PERSISTENTE
  const [history] = useState<Invoice[]>(() => {
  const saved = localStorage.getItem("invoices")
  return saved ? (JSON.parse(saved) as Invoice[]) : []
})

  
  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(history))
  }, [history])

  return (

    <div className="p-6 space-y-8">

      {/* HEADER */}

      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">

        <p className="text-sm opacity-90">
          Bienvenida de nuevo
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Hola {user?.username} 👋
        </h1>

        <p className="text-sm mt-2 opacity-90">
          Administra tus clientes, productos y facturación desde tu panel
        </p>

        <p className="text-sm mt-4 opacity-80">
          Hoy tienes <span className="font-semibold">{history.length}</span> facturas registradas
        </p>

      </div>


      {/* TARJETAS ESTADÍSTICAS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Clientes activos */}

        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between mb-4">

            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users2Icon className="w-5 h-5 text-blue-600"/>
            </div>

            <span className="text-xs text-slate-400">
              Hoy
            </span>

          </div>

          <p className="text-sm text-slate-500">
            Clientes activos
          </p>

         <p className="text-3xl font-bold text-slate-800">
  {clients.filter((c: any) => c.status === "Activo").length}
</p>

        </Card>


        {/* Facturas */}

        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between mb-4">

            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <ReceiptIcon className="w-5 h-5 text-purple-600"/>
            </div>

            <span className="text-xs text-slate-400">
              Total
            </span>

          </div>

          <p className="text-sm text-slate-500">
            Facturas generadas
          </p>

          <p className="text-3xl font-bold text-slate-800">
            {history.length}
          </p>

        </Card>


        {/* Clientes totales */}

        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between mb-4">

            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Users2Icon className="w-5 h-5 text-emerald-600"/>
            </div>

          </div>

          <p className="text-sm text-slate-500">
            Total clientes
          </p>

          <p className="text-3xl font-bold text-slate-800">
            {clients?.length || 0}
          </p>

        </Card>


        {/* Productos */}

        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

          <div className="flex items-center justify-between mb-4">

            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-orange-600"/>
            </div>

          </div>

          <p className="text-sm text-slate-500">
            Productos registrados
          </p>

          <p className="text-3xl font-bold text-slate-800">
            {productsCatalog?.length || 0}
          </p>

        </Card>

      </div>


      {/* ACCIONES RÁPIDAS */}

      <Card className="shadow-md">

        <h3 className="font-semibold text-black text-lg mb-4">
          Acciones rápidas
        </h3>

        <div className="flex flex-wrap gap-4">

          <button
  onClick={() => navigate("/facturacion")}
  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
>
  <PlusCircleIcon size={18}/>
  Crear factura
</button>

<button
  onClick={() => navigate("/clientes")}
  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
>
  <PlusCircleIcon size={18}/>
  Nuevo cliente
</button>

<button
  onClick={() => navigate("/productos")}
  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
>
  <PlusCircleIcon size={18}/>
  Nuevo producto
</button>

        </div>

      </Card>

  

{/*Productos mas vendidos */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  <Card>

    <h3 className="font-semibold text-black mb-4">
      Top productos vendidos
    </h3>

    <TopProducts invoices={history}/>

  </Card>

{/*Top Clientes */}
  <Card>

    <h3 className="font-semibold text-black mb-4">
      Top clientes
    </h3>

    <TopClients invoices={history}/>

  </Card>

</div>


      {/* HISTORIAL FACTURAS */}

      {history.length > 0 && (

        <Card className="shadow-md">

          <h2 className="text-xl font-bold text-black mb-6">
            Historial de Facturas
          </h2>

          <div className="overflow-x-auto">

            <table className="w-full text-sm rounded-lg overflow-hidden">

              <thead className="bg-slate-700 text-white">

                <tr>
                  <th className="p-3 text-left">Factura</th>
                  <th className="p-3 text-left">Cliente</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">QR</th>
                  <th className="p-3 text-center">PDF</th>
                </tr>

              </thead>

              <tbody>

                {history.map((invoice: Invoice, index: number) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-slate-50 transition"
                  >

                    <td className="p-3 text-black font-medium">
                      {invoice.number}
                    </td>

                    <td className="p-3 text-black">
                      {invoice.customer}
                    </td>

                    <td className="p-3 text-center text-black">
                      ${Number(invoice.total).toLocaleString()}
                    </td>

                    <td className="p-3 text-center">

                      <a
                        href={invoice.qr}
                        target="_blank"
                        className="text-indigo-600 hover:underline"
                      >
                        Ver QR
                      </a>

                    </td>

                    <td className="p-3 text-center">

                      <a
                        href={invoice.pdf}
                        target="_blank"
                        className="text-green-600 hover:underline"
                      >
                        Descargar
                      </a>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </Card>

      )}

    </div>

  )

}

export default Dashboard