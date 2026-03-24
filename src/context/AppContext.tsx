import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type FoodEntry, type User } from "../types";
import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";

const AppContext = createContext(initialState)

export const AppProvider = ({children} : {children: React.ReactNode}) => {
 
    const navigate = useNavigate()

    const [user, setUser] = useState<User>(null)
    const [isUserFetched, setIsUserFetched] = useState(false)
    const [onboardingCompleted, setOnboardingCompleted] = useState(false)

    const [allFoodLogs, setAllFoodLogs] = useState<FoodEntry[]>([])
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([])

    /* =========================
       CLIENTES
    ========================= */

    const [clients, setClients] = useState<any[]>(() => {
        const saved = localStorage.getItem("clients")
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem("clients", JSON.stringify(clients))
    }, [clients])

    const createClient = (client:any) => {

        const newClient = {
            ...client,
            id: Date.now()
        }

        setClients(prev => [...prev, newClient])
    }

    const updateClient = (client:any) => {

        setClients(prev =>
            prev.map(c => c.id === client.id ? client : c)
        )
    }

    const deleteClient = (id:number) => {

        setClients(prev =>
            prev.filter(c => c.id !== id)
        )
    }

    /* =========================
   PRODUCTOS
========================= */

const [productsCatalog, setProductsCatalog] = useState<any[]>(() => {
    const saved = localStorage.getItem("products")
    return saved ? JSON.parse(saved) : []
})

useEffect(() => {
    localStorage.setItem("products", JSON.stringify(productsCatalog))
}, [productsCatalog])

const createProduct = (product:any) => {

    const newProduct = {
        ...product,
        id: Date.now()
    }

    setProductsCatalog(prev => [...prev, newProduct])
}

const updateProduct = (product:any) => {

    setProductsCatalog(prev =>
        prev.map(p => p.id === product.id ? product : p)
    )
}

const deleteProduct = (id:number) => {

    setProductsCatalog(prev =>
        prev.filter(p => p.id !== id)
    )
}


    /* =========================
       AUTH
    ========================= */

    const signup = async (credentials: Credentials) => {
        const {data} = await mockApi.auth.register(credentials)

        setUser(data.user)

        if(data?.user?.age && data?.user?.weight && data?.user?.goal){
            setOnboardingCompleted(true)
            navigate('/')
        }

        localStorage.setItem('token', data.jwt)
    }

    const login = async (credentials: Credentials) => {

        const { data } = await mockApi.auth.login(credentials)

        setUser({...data.user, token: data.jwt})

        if(data?.user?.age && data?.user?.weight && data?.user?.goal){
            setOnboardingCompleted(true)
        }

        localStorage.setItem('token', data.jwt)
    }

    const fetchUser = async (token: string) => {

        const { data } = await mockApi.user.me()

        setUser({...data, token})

        if(data?.age && data?.weight && data?.goal){
            setOnboardingCompleted(true)
        }

        setIsUserFetched(true)
        
    }

    const logout = () => {

        localStorage.removeItem('token')
        setUser(null)

        navigate('/')
    }

  
    useEffect(() => {

        const token = localStorage.getItem('token')

        if(token){

            (async () => {
                await fetchUser(token)                
            })();

        }else{
            setIsUserFetched(true)
        }

    }, [])

    const value = {
        user, setUser, isUserFetched, fetchUser,
        signup, login, logout,
        onboardingCompleted, setOnboardingCompleted,
        allFoodLogs, allActivityLogs,
        setAllFoodLogs, setAllActivityLogs,

        /* CLIENTES */
        clients,
        createClient,
        updateClient,
        deleteClient,

        /* PRODUCTOS */

productsCatalog,
createProduct,
updateProduct,
deleteProduct
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)
