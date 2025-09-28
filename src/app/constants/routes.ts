const base = "api/v2/users"

export const ROUTES = {
    HOME: "/",
    USER: {
        LOGIN: `${base}/login`,
        SIGNUP: `${base}/signup`,
        VIEWER: `${base}/viewer`,
        LOGOUT: `${base}/logout`
    }
} as const