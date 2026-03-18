import { EditIcon, TrashIcon } from "lucide-react";
import { useState, useMemo } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/Modal";
import Input from "../components/ui/Input";
import { useAppContext } from "../context/AppContext";

const emptyProduct = {
  name: "",
  price: "",
  category: "",
  status: "Disponible"
};

export default function Products() {

  const {
    productsCatalog,
    createProduct,
    updateProduct,
    deleteProduct
  } = useAppContext();

  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({ ...emptyProduct });
  const [isEditing, setIsEditing] = useState(false);

  // 🔎 búsqueda optimizada
  const filteredProducts = useMemo(() => {
    return productsCatalog.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [productsCatalog, search]);

  const openCreateModal = () => {
    setSelectedProduct({ ...emptyProduct });
    setIsEditing(false);
    setIsOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct({ ...product });
    setIsEditing(true);
    setIsOpen(true);
  };

  const saveProduct = () => {

    if (!selectedProduct.name || !selectedProduct.price) {
      alert("Nombre y precio son obligatorios");
      return;
    }

    if (isEditing) {
      updateProduct(selectedProduct);
    } else {
      createProduct(selectedProduct);
    }

    setIsOpen(false);
  };

  const handleDelete = (id) => {

    if (!confirm("¿Eliminar producto?")) return;

    deleteProduct(id);
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-white">
          Productos
        </h1>

        <button
          onClick={openCreateModal}
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600"
        >
          + Nuevo Producto
        </button>

      </div>

      <Card>

        <div className="mb-4">

          <Input
            placeholder="Buscar producto..."
            value={search}
            onChange={(value) => setSearch(value)}
          />

        </div>

        <div className="overflow-x-auto">

          <table className="min-w-full text-sm">

            <thead>
              <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3">Categoría</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredProducts.map(product => (

                <tr key={product.id} className="hover:bg-gray-50">

                  <td className="px-6 py-4 font-medium text-gray-800">
                    {product.name}
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    ${product.price}
                  </td>

                  <td className="px-6 py-4 text-gray-800">
                    {product.category || "-"}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === "Disponible"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-center space-x-2">

                    <button
                      onClick={() => openEditModal(product)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    >
                      <EditIcon size={16}/>
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
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
        title={isEditing ? "Editar Producto" : "Nuevo Producto"}
      >

        <div className="space-y-4">

          <Input
            label="Nombre"
            value={selectedProduct.name}
            onChange={(value) =>
              setSelectedProduct({ ...selectedProduct, name: value })
            }
            required
          />

          <Input
            label="Precio"
            type="number"
            value={selectedProduct.price}
            onChange={(value) =>
              setSelectedProduct({ ...selectedProduct, price: value })
            }
            required
          />

          <Input
            label="Categoría"
            value={selectedProduct.category}
            onChange={(value) =>
              setSelectedProduct({ ...selectedProduct, category: value })
            }
          />

          <div>

            <label className="text-sm font-medium text-black">
              Estado
            </label>

            <select
              className="w-full border rounded-xl p-3 text-black"
              value={selectedProduct.status}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, status: e.target.value })
              }
            >
              <option>Disponible</option>
              <option>Agotado</option>
            </select>

          </div>

          <div className="flex gap-3 pt-2">

            <button
              onClick={saveProduct}
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
  );
}
