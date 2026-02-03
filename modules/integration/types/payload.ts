import { IntegrationData } from '.';

export interface CreateIntegrationPayload extends Partial<IntegrationData> {}

export interface UpdateIntegrationPayload extends CreateIntegrationPayload {
    integrationConnections?: {
        id: string;
        credentials: Credential;
    }[];
}
