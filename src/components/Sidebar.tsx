import { BoxesIcon, Factory, HomeIcon, ReceiptIcon, Users2Icon, LogOut } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

const Sidebar = () => {

  const {logout} = useAppContext()
  const navigate = useNavigate()

  const navItems = [
    { path: "/", label: "Dashboard", icon: HomeIcon },
    { path: "/clientes", label: "Clientes", icon: Users2Icon },
    { path: "/productos", label: "Productos", icon: BoxesIcon },
    { path: "/facturacion", label: "Facturación", icon: ReceiptIcon }
  ]

  const handleLogout = () => {
   if (confirm("¿Seguro que deseas cerrar sesión?")) {
    logout()
    navigate('/login')
  }
}

  return (

    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-slate-200 shadow-sm">

      {/* LOGO */}

      <div className="flex items-center gap-3 px-6 py-6 border-b">

        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
          <Factory className="w-6 h-6 text-white"/>
        </div>

        <h1 className="text-xl font-bold text-slate-800">
          Factus
        </h1>

      </div>


      {/* MENU */}

      <nav className="flex flex-col gap-2 p-4 flex-1">

        {navItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-semibold shadow-sm"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`
            }
          >

            <item.icon className="w-5 h-5"/>

            <span className="text-sm">
              {item.label}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* FOOTER USUARIO */}

      <div className="border-t p-4">

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition"
        >

          <LogOut size={18}/>

          <span className="text-sm font-medium">
            Cerrar sesión
          </span>

        </button>

      </div>

    </aside>

  )

}

export default Sidebar