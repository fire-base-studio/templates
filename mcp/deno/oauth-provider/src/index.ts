import { AuthorizationParams, OAuthServerProvider } from '../../server/auth/provider.ts';
import { OAuthRegisteredClientsStore } from '../../server/auth/clients.ts';
import { OAuthClientInformationFull, OAuthMetadata, OAuthTokens } from '../../shared/auth.ts';
import { AuthInfo } from '../../server/auth/types.ts';
import { createOAuthMetadata, mcpAuthRouter } from '../../server/auth/router.ts';
import { resourceUrlFromServerUrl } from '../../shared/auth-utils.ts';
import { InvalidRequestError } from '../../server/auth/errors.ts';
import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';

export class DemoInMemoryClientsStore implements OAuthRegisteredClientsStore {
    private clients = new Map<string, OAuthClientInformationFull>();

    async getClient(clientId: string) {
        return this.clients.get(clientId);
    }

    async registerClient(clientMetadata: OAuthClientInformationFull) {
        this.clients.set(clientMetadata.client_id, clientMetadata);
        return clientMetadata;
    }
}

/**
 * 🚨 DEMO ONLY - NOT FOR PRODUCTION
 *
 * This example demonstrates MCP OAuth flow but lacks some of the features required for production use,
 * for example:
 * - Persistent token storage
 * - Rate limiting
 */
export class DemoInMemoryAuthProvider implements OAuthServerProvider {
    clientsStore = new DemoInMemoryClientsStore();
    private codes = new Map<
        string,
        {
            params: AuthorizationParams;
            client: OAuthClientInformationFull;
        }
    >();
    private tokens = new Map<string, AuthInfo>();

    constructor(private validateResource?: (resource?: URL) => boolean) {}

    async authorize(client: OAuthClientInformationFull, params: AuthorizationParams, res: Response): Promise<void> {
        const code = crypto.randomUUID();

        const searchParams = new URLSearchParams({
            code
        });
        if (params.state !== undefined) {
            searchParams.set('state', params.state);
        }

        this.codes.set(code, {
            client,
            params
        });

        if (!client.redirect_uris.includes(params.redirectUri)) {
            throw new InvalidRequestError('Unregistered redirect_uri');
        }
        const targetUrl = new URL(params.redirectUri);
        targetUrl.search = searchParams.toString();

        // In Deno, we return a Response object to redirect.
        return new Response(null, {
            status: 302, // Temporary Redirect
            headers: {
                Location: targetUrl.toString(),
            },
        });
    }

    async challengeForAuthorizationCode(client: OAuthClientInformationFull, authorizationCode: string): Promise<string> {
        // Store the challenge with the code data
        const codeData = this.codes.get(authorizationCode);
        if (!codeData) {
            throw new Error('Invalid authorization code');
        }

        return codeData.params.codeChallenge;
    }

    async exchangeAuthorizationCode(
        client: OAuthClientInformationFull,
        authorizationCode: string,
        // Note: code verifier is checked in token.ts by default
        // it's unused here for that reason.
        _codeVerifier?: string
    ): Promise<OAuthTokens> {
        const codeData = this.codes.get(authorizationCode);
        if (!codeData) {
            throw new Error('Invalid authorization code');
        }

        if (codeData.client.client_id !== client.client_id) {
            throw new Error(`Authorization code was not issued to this client, ${codeData.client.client_id} != ${client.client_id}`);
        }

        if (this.validateResource && !this.validateResource(codeData.params.resource)) {
            throw new Error(`Invalid resource: ${codeData.params.resource}`);
        }

        this.codes.delete(authorizationCode);
        const token = crypto.randomUUID();

        const tokenData = {
            token,
            clientId: client.client_id,
            scopes: codeData.params.scopes || [],
            expiresAt: Date.now() + 3600000, // 1 hour
            resource: codeData.params.resource,
            type: 'access'
        };

        this.tokens.set(token, tokenData);

        return {
            access_token: token,
            token_type: 'bearer',
            expires_in: 3600,
            scope: (codeData.params.scopes || []).join(' ')
        };
    }

    async exchangeRefreshToken(
        _client: OAuthClientInformationFull,
        _refreshToken: string,
        _scopes?: string[],
        _resource?: URL
    ): Promise<OAuthTokens> {
        throw new Error('Not implemented for example demo');
    }

    async verifyAccessToken(token: string): Promise<AuthInfo> {
        const tokenData = this.tokens.get(token);
        if (!tokenData || !tokenData.expiresAt || tokenData.expiresAt < Date.now()) {
            throw new Error('Invalid or expired token');
        }

        return {
            token,
            clientId: tokenData.clientId,
            scopes: tokenData.scopes,
            expiresAt: Math.floor(tokenData.expiresAt / 1000),
            resource: tokenData.resource
        };
    }
}

export const setupAuthServer = ({
    authServerUrl,
    mcpServerUrl,
    strictResource
}: {
    authServerUrl: URL;
    mcpServerUrl: URL;
    strictResource: boolean;
}): OAuthMetadata => {
    // Create separate auth server app
    // NOTE: This is a separate app on a separate port to illustrate
    // how to separate an OAuth Authorization Server from a Resource
    // server in the SDK. The SDK is not intended to be provide a standalone
    // authorization server.

    const validateResource = strictResource
        ? (resource?: URL) => {
              if (!resource) return false;
              const expectedResource = resourceUrlFromServerUrl(mcpServerUrl);
              return resource.toString() === expectedResource.toString();
          }
        : undefined;

    const provider = new DemoInMemoryAuthProvider(validateResource);
    const authRouter = mcpAuthRouter({
        provider,
        issuerUrl: authServerUrl,
        scopesSupported: ['mcp:tools']
    });

    const handler = async (req: Request): Promise<Response> => {
        const url = new URL(req.url);
        const introspectionPath = '/' + 'introspect'; // Avoid ts-lint complain about /introspect directly
        if (url.pathname === introspectionPath) {
            try {
                const formData = await req.formData();
                const token = formData.get('token');

                if (!token || typeof token !== 'string') {
                    return new Response(JSON.stringify({ error: 'Token is required' }), { status: 400 });
                }

                const tokenInfo = await provider.verifyAccessToken(token);
                return new Response(JSON.stringify({
                    active: true,
                    client_id: tokenInfo.clientId,
                    scope: tokenInfo.scopes.join(' '),
                    exp: tokenInfo.expiresAt,
                    aud: tokenInfo.resource
                }));
            } catch (error) {
                return new Response(JSON.stringify({
                    active: false,
                    error: 'Unauthorized',
                    error_description: `Invalid token: ${error}`
                }), { status: 401 });
            }
        }

        const response = await authRouter(req);
        if (response) {
            return response;
        }

        return new Response('Not Found', { status: 404 });
    };


    const auth_port = parseInt(authServerUrl.port, 10);
    // Start the auth server
    serve(handler, { port: auth_port });
    console.log(`OAuth Authorization Server listening on port ${auth_port}`);


    // Note: we could fetch this from the server, but then we end up
    // with some top level async which gets annoying.
    const oauthMetadata: OAuthMetadata = createOAuthMetadata({
        provider,
        issuerUrl: authServerUrl,
        scopesSupported: ['mcp:tools']
    });

    oauthMetadata.introspection_endpoint = new URL('/introspect', authServerUrl).href;

    return oauthMetadata;
};
