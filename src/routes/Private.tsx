import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import LoadingPage from "../pages/LoadingPage/LoadingPage"

export default function Private({ children }: { children: React.ReactNode }) {

    const { loading, signed } = useAuth()

    if (loading) {
        return (
            <LoadingPage />
        )
    }

    if (!signed) {
        return <Navigate to="/" />
    }

    return (
        <div>
            {children}
        </div>
    )

}