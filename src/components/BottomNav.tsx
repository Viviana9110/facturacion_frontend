import { BoxesIcon, HomeIcon, LogOutIcon, ReceiptIcon, Users2Icon } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"

const BottomNav = () => {

  const { logout } = useAppContext()
  const navigate = useNavigate()

  const navItems = [
    { path: "/", label: "Dashboard", icon: HomeIcon },
    { path: "/clientes", label: "Clientes", icon: Users2Icon },
    { path: "/productos", label: "Productos", icon: BoxesIcon },
    { path: "/facturacion", label: "Facturación", icon: ReceiptIcon },
  ]

  const handleLogout = () => {
    if (confirm("¿Seguro que deseas cerrar sesión?")) {
    logout()
    navigate('/login')
  }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-4 pb-safe lg:hidden transition-colors duration-200">
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        
        {/* Items normales */}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`
            }
          >
            <item.icon className="size-5.5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}

        {/* Botón Logout */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-500 transition-all duration-200"
        >
          <LogOutIcon className="size-5.5" />
          <span className="text-xs font-medium">Logout</span>
        </button>

      </div>
    </nav>
  )
}

export default BottomNav