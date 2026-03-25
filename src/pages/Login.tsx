import { AtSignIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "../context/AppContext"
import toast from "react-hot-toast"
import { motion } from "framer-motion"

const Login = () => {

  const [state, setState] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const { login, signup, user } = useAppContext()

  const handleSubmit = async (e: any) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    if (state === "login") {
      await login({ email, password })
      navigate("/")
    } else {
      await signup({ username, email, password })
      navigate("/")
    }
  } catch (error) {
    toast.error("Email o password incorrectos")
  }

  setIsSubmitting(false)
}

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  return (
    <>
      
      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 relative overflow-hidden">

        {/* EFECTOS DE FONDO */}
        <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-purple-300/20 rounded-full blur-3xl bottom-10 right-10"></div>

        {/* FORMULARIO */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-5 z-10"
        >

          {/* LOGO */}
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow">
              F
            </div>
          </div>

          {/* TÍTULO */}
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {state === "login" ? "Bienvenid@ de nuevo" : "Crear cuenta"}
          </h2>

          {/* USERNAME */}
          {state !== 'login' && (
            <div>
              <label className="text-sm font-medium text-gray-600">Username</label>
              <div className="relative mt-1">
                <AtSignIcon className="absolute left-3 top-3 text-gray-400 size-4"/>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-black border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <div className="relative mt-1">
              <MailIcon className="absolute left-3 top-3 text-gray-400 size-4"/>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black border rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ingresa tu email"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <div className="relative mt-1">
              <LockIcon className="absolute left-3 top-3 text-gray-400 size-4"/>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-black border rounded-lg px-10 py-2.5 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ingresa tu contraseña"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
              </button>
            </div>
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            {isSubmitting
              ? "Procesando..."
              : state === "login"
              ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>

          {/* CAMBIO LOGIN / REGISTER */}
          <p className="text-center text-sm text-gray-600">
            {state === "login" ? (
              <>
                ¿No tienes cuenta?
                <button
                  type="button"
                  onClick={() => setState("signup")}
                  className="ml-1 text-indigo-600 font-medium hover:underline"
                >
                  Regístrate
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?
                <button
                  type="button"
                  onClick={() => setState("login")}
                  className="ml-1 text-indigo-600 font-medium hover:underline"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>

        </motion.form>

      </main>
    </>
  )
}

export default Login