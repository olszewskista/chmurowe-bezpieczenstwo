import NextAuth from 'next-auth';
import Keycloak from 'next-auth/providers/keycloak';
import { jwtDecode } from 'jwt-decode';


export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: true,
    trustHost: true,
    secret: process.env.NEXT_PUBLIC_SECRET,
    providers: [Keycloak
        // Keycloak({
        //     checks: ['none'],
        //     clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID!,
        //     clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
        //     issuer: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/${process.env.NEXT_PUBLIC_KEYCLOAK_REALM}`,
        //     jwks_endpoint: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/blog/protocol/openid-connect/certs`,
        //     // wellKnown: undefined,
        //     authorization: {
        //         params: {
        //             scope: 'openid email profile',
        //         },
        //         url: `${process.env.NEXT_LOCAL_KEYCLOAK_URL}/realms/blog/protocol/openid-connect/auth`,
        //     },
        //     token: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/blog/protocol/openid-connect/token`,
        //     userinfo: `${process.env.NEXT_CONTAINER_KEYCLOAK_ENDPOINT}/realms/blog/protocol/openid-connect/userinfo`,
        // }),
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
                console.log(token.decrypted);
                return token;
            } else if (
                typeof token.expires_at === 'number' &&
                nowTimeStamp < token.expires_at
            ) {
                // token has not expired yet, return it

                return token;
            } else {
                // token is expired
                console.log('Token has expired. Please log again.');
                return token
            }
        },
        async session({ session, token }) {
            (session as any).roles = (
                token as any
            ).decrypted.realm_access.roles;
            (session as any).access_token = token.access_token;
            (session as any).id_token = token.id_token;
            return session;
        },
    },
});

declare module 'next-auth' {
    interface Session {
        access_token: string;
        id_token: string;
        roles: [string];
    }
}
