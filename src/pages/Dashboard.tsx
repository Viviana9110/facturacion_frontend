import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import Card from "../components/ui/Card"
import { ReceiptIcon, Users2Icon, PackageIcon, PlusCircleIcon, EyeIcon} from "lucide-react"

import TopProducts from "../components/TopProducts"
import TopClients from "../components/TopClients"
import toast from "react-hot-toast"

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Invoice = {
  number: string
  customer: string
  total: number
  qr: string
  pdf: string
  items?: {
    name: string
    quantity: number
    price?: number
    tax_rate?: number
  }[]
}



const Dashboard = () => {

  const navigate = useNavigate()
  const { user, clients, productsCatalog } = useAppContext()

  const [previewPDF] = useState<string | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
const [showPDFModal, setShowPDFModal] = useState(false);

  const loadUserData = () => {}

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

  const getItems = () => {
    if (invoiceData?.items && invoiceData.items.length > 0) {
      return invoiceData.items;
    }

    const localInvoice = history.find(
      (inv) => inv.number === invoiceData?.bill?.number
    );

    return localInvoice?.items || [];
  };

  const handleViewInvoice = async (number: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/invoice/${number}`);

      if (!res.ok) throw new Error("Error en API");

      const data = await res.json();

      console.log("API DATA:", data);

      setInvoiceData(data.data);
      setShowInvoiceModal(true);

    } catch (error) {
      console.error(error);
      toast.error("Error cargando factura");
    }
  };

  
  // 🔥 DESCARGAR PDF
  const downloadPDF = (number: string) => {
    const url = `${import.meta.env.VITE_API_URL}/factura-pdf/${number}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `Factura-${number}.pdf`;
    a.click();
  };

  //Exportar a PDF
const exportInvoiceToPDF = () => {
  try {
    if (!invoiceData?.bill) {
      toast.error("No hay datos de factura");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");

    const logoBase64 = ""; // 👈 pega tu logo aquí

    // =========================
    // 🟦 HEADER PRINCIPAL
    // =========================
    if (logoBase64) {
      pdf.addImage(logoBase64, "PNG", 10, 8, 30, 20);
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text("FACTUS S.A.S", 45, 12);

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("NIT: 900123456", 45, 17);
    pdf.text("Responsable de IVA", 45, 21);
    pdf.text("Dirección: Manizales - Colombia", 45, 25);
    pdf.text("Tel: 3001234567", 45, 29);

    // =========================
    // 🟥 BLOQUE FACTURA (DIAN)
    // =========================
    pdf.setDrawColor(0);
    pdf.rect(140, 10, 60, 30);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("FACTURA ELECTRÓNICA", 145, 16);

    pdf.setFont("helvetica", "normal");
    pdf.text(`No: ${invoiceData.bill.number}`, 145, 22);
    pdf.text(`Fecha: ${invoiceData.bill.created_at}`, 145, 27);

    // =========================
    // 🟦 RESOLUCIÓN DIAN
    // =========================
    pdf.setFontSize(8);
    pdf.text(
      "Resolución DIAN No. 18764000000001 del 01/01/2024",
      10,
      40
    );
    pdf.text(
      "Rango autorizado: SETP00000001 - SETP99999999",
      10,
      44
    );

    // =========================
    // 🟦 CLIENTE
    // =========================
    pdf.setDrawColor(0);
    pdf.rect(10, 48, 190, 25);

    pdf.setFont("helvetica", "bold");
    pdf.text("DATOS DEL CLIENTE", 12, 53);

    pdf.setFont("helvetica", "normal");
    pdf.text(`Nombre: ${invoiceData.customer?.names}`, 12, 59);
    pdf.text(
      `Identificación: ${invoiceData.customer?.identification}`,
      12,
      64
    );
    pdf.text(`Email: ${invoiceData.customer?.email || "-"}`, 12, 69);

    // =========================
    // 🟦 FORMA DE PAGO
    // =========================
    pdf.text(
      `Forma de pago: ${invoiceData.bill.payment_form?.name || "Contado"}`,
      120,
      59
    );

    // =========================
    // 🟦 TABLA PRODUCTOS
    // =========================
    const items = getItems();

    const tableData = items.map((item: any) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      const tax = Number(item.tax_rate || 0);

      const subtotal = price * qty;
      const iva = subtotal * (tax / 100);
      const total = subtotal + iva;

      return [
        item.name,
        qty,
        `$${price.toLocaleString("es-CO")}`,
        `${tax}%`,
        `$${iva.toLocaleString("es-CO")}`,
        `$${total.toLocaleString("es-CO")}`
      ];
    });

    autoTable(pdf, {
      startY: 75,
      head: [["Producto", "Cant", "Precio", "%IVA", "IVA", "Total"]],
      body: tableData,

      styles: { fontSize: 8 },

      headStyles: {
        fillColor: [0, 0, 0],
        textColor: 255,
      }
    });

    const finalY = (pdf as any).lastAutoTable.finalY + 8;

    // =========================
    // 🟦 TOTALES
    // =========================
    const subtotal = Number(invoiceData.bill.gross_value || 0);
    const iva = Number(invoiceData.bill.tax_amount || 0);
    const total = Number(invoiceData.bill.total || 0);

    pdf.setFont("helvetica", "bold");

    pdf.text("Subtotal:", 130, finalY);
    pdf.text(`$${subtotal.toLocaleString("es-CO")}`, 170, finalY);

    pdf.text("IVA:", 130, finalY + 5);
    pdf.text(`$${iva.toLocaleString("es-CO")}`, 170, finalY + 5);

    pdf.setFontSize(11);
    pdf.text("TOTAL:", 130, finalY + 12);
    pdf.text(`$${total.toLocaleString("es-CO")}`, 170, finalY + 12);

    // =========================
    // 🟦 CUFE
    // =========================
    let y = finalY + 20;

    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");

    pdf.text("CUFE:", 10, y);
    y += 4;

    const cufe = invoiceData.bill.cufe || "";
    const splitCUFE = pdf.splitTextToSize(cufe, 180);
    pdf.text(splitCUFE, 10, y);

    // =========================
    // 🟦 QR
    // =========================
    if (invoiceData.bill.qr_image) {
      try {
        pdf.addImage(invoiceData.bill.qr_image, "PNG", 150, y + 5, 40, 40);
      } catch (err) {}
    }

    // =========================
    // 🟦 FOOTER LEGAL DIAN
    // =========================
    pdf.setFontSize(7);

    pdf.text(
      "Esta factura electrónica se valida según la DIAN.",
      10,
      270
    );

    pdf.text(
      "Software de facturación autorizado.",
      10,
      274
    );

    pdf.text(
      "Representación gráfica de la factura electrónica.",
      10,
      278
    );

    pdf.save(`Factura-${invoiceData.bill.number}.pdf`);

  } catch (error) {
    console.error(error);
    toast.error("Error generando PDF");
  }
};

  return (
    <div className="p-6 space-y-8">

      {/* HEADER */}
      <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">

        <p className="text-sm opacity-90">Bienvenida de nuevo</p>

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

        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users2Icon className="w-5 h-5 text-blue-600"/>
            </div>
            <span className="text-xs text-slate-400">Hoy</span>
          </div>

          <p className="text-sm text-slate-500">Clientes activos</p>
          <p className="text-3xl font-bold text-slate-800">
            {clients.filter((c: any) => c.status === "Activo").length}
          </p>
        </Card>


        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <ReceiptIcon className="w-5 h-5 text-purple-600"/>
            </div>
            <span className="text-xs text-slate-400">Total</span>
          </div>

          <p className="text-sm text-slate-500">Facturas generadas</p>
          <p className="text-3xl font-bold text-slate-800">{history.length}</p>
        </Card>


        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Users2Icon className="w-5 h-5 text-emerald-600"/>
            </div>
          </div>

          <p className="text-sm text-slate-500">Total clientes</p>
          <p className="text-3xl font-bold text-slate-800">{clients?.length || 0}</p>
        </Card>


        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-orange-600"/>
            </div>
          </div>

          <p className="text-sm text-slate-500">Productos registrados</p>
          <p className="text-3xl font-bold text-slate-800">{productsCatalog?.length || 0}</p>
        </Card>

      </div>


      {/* ACCIONES RÁPIDAS */}
      <Card className="shadow-md">

        <h3 className="font-semibold text-black text-lg mb-4">Acciones rápidas</h3>

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


      {/* TOPS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-black mb-4">Top productos vendidos</h3>
          <TopProducts invoices={history}/>
        </Card>

        <Card>
          <h3 className="font-semibold text-black mb-4">Top clientes</h3>
          <TopClients invoices={history}/>
        </Card>
      </div>


      {/* HISTORIAL */}
      {history.length > 0 && (
        <Card className="shadow-md">

          <h2 className="text-xl font-bold text-black mb-6">Historial de Facturas</h2>

          <div className="overflow-x-auto">

            <table className="w-full text-sm rounded-lg overflow-hidden">

              <thead className="bg-slate-700 text-white">
                <tr>
                  <th className="p-3 text-left">Factura</th>
                  <th className="p-3 text-left">Cliente</th>
                  <th className="p-3 text-center">Total</th>
                  <th className="p-3 text-center">CUFE</th>
                  <th className="p-3 text-center">PDF</th>
                </tr>
              </thead>

              <tbody>
                {history.map((invoice: Invoice, index: number) => (
                  <tr key={index} className="border-b hover:bg-slate-200 transition">

                    <td className="p-3 text-black font-medium">#{invoice.number}</td>
                    <td className="p-3 text-black">{invoice.customer}</td>

                    <td className="p-3 text-center text-black">
                      ${Number(invoice.total).toLocaleString()}
                    </td>

                    <td className="p-3 text-center">
                      <a
                        href={invoice.qr}
                        target="_blank"
                        className="text-indigo-600 text-center cursor-pointer"
                      >
                        Ver
                      </a>
                    </td>

                    <td className="p-3 text-center">

  {/* 👁 VER FACTURA (MODAL) */}
  <button
    onClick={() => handleViewInvoice(invoice.number)}
    className="text-blue-600 hover:underline mr-2 cursor-pointer"
  >
    <EyeIcon/>
  </button>

</td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </Card>
      )}

     {showInvoiceModal && invoiceData?.bill && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div
  id="invoice-to-pdf"
  className="bg-white w-225 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8"
>
  

      {/* HEADER */}
      <div className="flex justify-between items-start border-b pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600">
            FACTURA ELECTRÓNICA
          </h1>
          <p className="text-sm text-gray-500">
            N° {invoiceData.bill.number}
          </p>
        </div>

        <div className="text-right text-sm">
          <p><strong>Fecha:</strong> {invoiceData.bill.created_at}</p>
          <p className="mt-1"><strong>CUFE:</strong></p>
          <p className="text-xs break-all text-gray-500">
            {invoiceData.bill.cufe}
          </p>
        </div>
      </div>

      {/* EMPRESA Y CLIENTE */}
      <div className="grid grid-cols-2 gap-6 mb-8">

        <div>
          <h2 className="font-semibold text-gray-700 mb-2">EMISOR</h2>
          <p className="text-sm font-medium">Tu Empresa S.A.S</p>
          <p className="text-sm text-gray-500">NIT: 900123456</p>
          <p className="text-sm text-gray-500">Colombia</p>
        </div>

        <div>
          <h2 className="font-semibold text-gray-700 mb-2">CLIENTE</h2>
          <p className="text-sm font-medium">{invoiceData.customer?.names}</p>
          <p className="text-sm text-gray-500">
            CC/NIT: {invoiceData.customer?.identification}
          </p>
          <p className="text-sm text-gray-500">
            {invoiceData.customer?.email}
          </p>
        </div>

      </div>

      {/* TABLA PRODUCTOS */}
      <div className="mb-8">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-center">Cant</th>
              <th className="p-3 text-center">Precio</th>
              <th className="p-3 text-center">IVA</th>
              <th className="p-3 text-center">Total</th>
            </tr>
          </thead>

          <tbody className="text-black">
            {getItems().map((item: any, index: number) => {
              
              const price = Number(item.price || 0)
  const quantity = Number(item.quantity || 0)
  const taxRate = Number(item.tax_rate || 0)

  const subtotal = price * quantity
  const iva = subtotal * (taxRate / 100)
  const total = subtotal + iva
  
              return (
                <tr key={index} className="border-b text-black">
                  <td className="p-3">{item.name}</td>

                  <td className="p-3 text-center">
                    {quantity}
                  </td>

                  <td className="p-3 text-center">
                    ${price.toLocaleString("es-CO")}
                  </td>

                  <td className="p-3 text-center">
                    ${iva.toLocaleString("es-CO")}
                  </td>

                  <td className="p-3 text-center font-medium">
                    ${total.toLocaleString("es-CO")}
                  </td>
                </tr>
              )
            })}
          </tbody>

        </table>
      </div>

      {/* TOTALES */}
      <div className="flex justify-end mb-8">
        <div className="w-80 text-sm space-y-3 text-black">

          <div className="flex justify-between  text-black">
            <span>Subtotal:</span>
            <span>
              ${Number(invoiceData.bill.gross_value || 0).toLocaleString("es-CO")}
            </span>
          </div>

          <div className="flex justify-between  text-black">
            <span>IVA:</span>
            <span>
              ${Number(invoiceData.bill.tax_amount || 0).toLocaleString("es-CO")}
            </span>
          </div>

          <div className="flex justify-between text-lg font-bold border-t pt-3  text-black">
            <span>Total:</span>
            <span>
              ${Number(invoiceData.bill.total || 0).toLocaleString("es-CO")}
            </span>
          </div>

        </div>
      </div>

      {/* QR */}
      <div className="flex justify-between items-center border-t pt-6">

        <div className="text-xs text-gray-500 max-w-md">
          Esta factura es válida electrónicamente según la DIAN.
          Verifique su autenticidad escaneando el código QR.
        </div>

        {invoiceData.bill.qr_image && (
          <img
  src={invoiceData.bill.qr_image}
  crossOrigin="anonymous"
  alt="QR"
  className="w-28"
/>
        )}

      </div>

      {/* BOTONES */}
      <div className="flex justify-end gap-3 mt-8">

  <button
    onClick={exportInvoiceToPDF}
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
  >
    Exportar PDF
  </button>

  <button
    onClick={() => downloadPDF(invoiceData.bill.number)}
    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
  >
    Descargar PDF
  </button>

  <button
    onClick={() => setShowInvoiceModal(false)}
    className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
  >
    Cerrar
  </button>

</div>


    </div>
  </div>
)}

{showPDFModal && previewPDF && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-[90%] h-[90%] rounded-xl overflow-hidden">

      <iframe
        src={previewPDF}
        className="w-full h-full"
      />

      <button
        onClick={() => setShowPDFModal(false)}
        className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded"
      >
        X
      </button>

    </div>
  </div>
)}

    </div>
  )
}

export default Dashboard