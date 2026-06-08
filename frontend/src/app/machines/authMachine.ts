export interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: unknown;
}

export type AuthState =
    | "GUEST"
    | "AUTHENTICATING"
    | "AUTHENTICATED"
    | "LOGGING_OUT";

export type AuthEvent =
    | {type: "LOGIN_ATTEMPT"; credentials: {email: string; password: string}}
    | {type: "LOGIN_SUCCESS"; user: User}
    | {type: "LOGIN_FAILURE"; error: string}
    | {type : "LOGOUT"}
    | {type : "LOGOUT_COMPLETE"};

export type AuthEventType = AuthEvent["type"];

export const authTransitions : Record<AuthState, Partial<Record<AuthEventType, AuthState>>
> = {
    GUEST: {
        LOGIN_ATTEMPT: "AUTHENTICATING",
    },
    AUTHENTICATING: {
        LOGIN_SUCCESS: "AUTHENTICATED",
        LOGIN_FAILURE: "GUEST",
    },
    AUTHENTICATED: {
        LOGOUT: "LOGGING_OUT",
    },
    LOGGING_OUT: {
        LOGOUT_COMPLETE: "GUEST",
    },
};

export function transition(current : AuthState, event: AuthEvent): AuthState {
    return authTransitions[current]?.[event.type] ?? current;
}

export const AuthGuard = {
    isGuest: (s : AuthState) => s === "GUEST",
    isAuthenticating: (s : AuthState) => s === "AUTHENTICATING",
    isAuthenticated: (s : AuthState) => s === "AUTHENTICATED",
    isLoggingOut: (s : AuthState) => s === "LOGGING_OUT",
    isLoading: (s : AuthState) => s === "AUTHENTICATING" || s === "LOGGING_OUT",
} as const;