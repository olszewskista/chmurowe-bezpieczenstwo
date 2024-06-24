import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { jwtDecode } from 'jwt-decode';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(token: JWT) {
    console.log(process.env.REFRESH_TOKEN_URL);
    const resp = await fetch(`${process.env.REFRESH_TOKEN_URL}`, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: process.env.AUTH_KEYCLOAK_ID as string,
            client_secret: process.env.AUTH_KEYCLOAK_SECRET as string,
            grant_type: 'refresh_token',
            refresh_token: token.refresh_token as string,
        }),
        method: 'POST',
    });
    const refreshToken = await resp.json();
    if (!resp.ok) throw refreshToken;

    return {
        ...token,
        access_token: refreshToken.access_token,
        decoded: jwtDecode(refreshToken.access_token),
        id_token: refreshToken.id_token,
        expires_at: Math.floor(Date.now() / 1000) + refreshToken.expires_in,
        refresh_token: refreshToken.refresh_token,
    };
}
export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: true,
    trustHost: true,
    providers: [
        Keycloak({
            jwks_endpoint: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/bloh/protocol/openid-connect/certs`,
            wellKnown: undefined,
            clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
            authorization: {
                params: {
                    scope: 'openid email profile',
                },
                url: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/blog/protocol/openid-connect/auth`,
            },
            token: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/blog/protocol/openid-connect/token`,
            userinfo: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/blog/protocol/openid-connect/userinfo`,
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            const nowTimeStamp = Math.floor(Date.now() / 1000);

            if (account && account.access_token) {
                // account is only available the first time this callback is called on a new session (after the user signs in)
                token.decrypted = jwtDecode(account?.access_token);
                token.access_token = account.access_token;
                token.id_token = account.id_token;
                token.expires_at = account.expires_at;
                token.refresh_token = account.refresh_token;
                console.log(token.decrypted)
                return token;
            } else if (
                typeof token.expires_at === 'number' &&
                nowTimeStamp < token.expires_at
            ) {
                // token has not expired yet, return it
                // console.log(token);
                return token;
            } else {
                // token is expired, try to refresh it
                console.log('Token has expired. Will refresh...');
                try {
                    const refreshedToken = await refreshAccessToken(token);
                    console.log('Token is refreshed.');
                    return refreshedToken;
                } catch (error) {
                    console.error('Error refreshing access token', error);
                    return { ...token, error: 'RefreshAccessTokenError' };
                }
            }
        },
        async session({ session, token }) {
            // session.accessToken = token.email
            // session.roles = "dfd"
            // session['roles'] = token.decoded.realm_access.roles;
            // const roles = token.decrypted.realm_access.roles;
            (session as any).roles = (token as any).decrypted.realm_access.roles;
            (session as any).access_token = token.access_token;
            console.log(session);
            return session;
        },
    },
});

declare module 'next-auth' {
    interface Session {
        access_token: string;
        roles: [string]
    }
}
