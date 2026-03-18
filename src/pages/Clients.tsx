import { EditIcon, TrashIcon } from "lucide-react";
import { useState, useMemo } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/Modal";
import Input from "../components/ui/Input";
import { useAppContext } from "../context/AppContext";

const emptyClient = {
  name: "",
  email: "",
  phone: "",
  identification: "",
  address: "",
  status: "Activo"
};


export default function Clients() {

  const { clients, createClient, updateClient, deleteClient } = useAppContext()

  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState({ ...emptyClient })
  const [isEditing, setIsEditing] = useState(false)

  // 🔎 búsqueda optimizada
  const filteredClients = useMemo(() => {
    return clients.filter(client =>
      client.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [clients, search])

  const openCreateModal = () => {
    setSelectedClient({ ...emptyClient })
    setIsEditing(false)
    setIsOpen(true)
  }

  const openEditModal = (client) => {
    setSelectedClient({ ...client })
    setIsEditing(true)
    setIsOpen(true)
  }

  const saveClient = () => {

    if (!selectedClient.name || !selectedClient.email) {
      alert("Nombre y Email son obligatorios")
      return
    }

    if (isEditing) {
      updateClient(selectedClient)
    } else {
      createClient(selectedClient)
    }

    setIsOpen(false)
  }

  const handleDelete = (id) => {

    if (!confirm("¿Eliminar cliente?")) return

    deleteClient(id)

  }

  return (

    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-white">
          Clientes
        </h1>

        <button
          onClick={openCreateModal}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
        >
          + Nuevo Cliente
        </button>

      </div>

      <Card>

        <div className="mb-4">

          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(value) => setSearch(value)}
          />

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead>
              <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredClients.map(client => (

                <tr key={client.id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {client.name}
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    {client.email}
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    {client.phone}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        client.status === "Activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {client.status}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-center space-x-2">

                    <button
                      onClick={() => openEditModal(client)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                      <EditIcon size={16}/>
                    </button>

                    <button
                      onClick={() => handleDelete(client.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                    >
                      <TrashIcon size={16}/>
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </Card>

      {/* Modal */}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}
      >

        <div className="space-y-4">

          <Input
            label="Nombre"
            value={selectedClient.name}
            onChange={(value) =>
              setSelectedClient({ ...selectedClient, name: value })
            }
            required
          />

          <Input
            label="Identificación"
            value={selectedClient.identification || ""}
            onChange={(value) =>
              setSelectedClient({ ...selectedClient, identification: value })
            }
          />

          <Input
            label="Email"
            type="email"
            value={selectedClient.email}
            onChange={(value) =>
              setSelectedClient({ ...selectedClient, email: value })
            }
            required
          />

          <Input
            label="Teléfono"
            value={selectedClient.phone}
            onChange={(value) =>
              setSelectedClient({ ...selectedClient, phone: value })
            }
          />

          <Input
            label="Dirección"
            value={selectedClient.address || ""}
            onChange={(value) =>
              setSelectedClient({ ...selectedClient, address: value })
            }
          />

          <div>

            <label className="text-sm font-medium text-black">
              Estado
            </label>

            <select
              className="w-full border rounded-xl p-3 text-black"
              value={selectedClient.status}
              onChange={(e) =>
                setSelectedClient({ ...selectedClient, status: e.target.value })
              }
            >
              <option>Activo</option>
              <option>Inactivo</option>
            </select>

          </div>

          <div className="flex gap-3 pt-2">

            <button
              onClick={saveClient}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
            >
              Guardar
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Cancelar
            </button>

          </div>

        </div>

      </Modal>

    </div>
  )
}
