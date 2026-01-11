export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Default Headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Auth Token Injection (Readiness demonstration)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);
      
      // Generic Error Handling
      if (!response.ok) {
        // Try to parse error message from body
        let errorMessage = `HTTP Error: ${response.status}`;
        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorMessage;
        } catch (e) {
            // response was not json
        }
        throw new Error(errorMessage);
      }

      // Handle 204 No Content
      if (response.status === 204) {
          return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Request Failed: ${endpoint}`, error);
      throw error;
    }
  }

  get<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  post<T>(endpoint: string, body: any, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), headers });
  }

  put<T>(endpoint: string, body: any, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), headers });
  }

  patch<T>(endpoint: string, body: any, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), headers });
  }

  delete<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Export singleton instance (defaulting to relative path for current mock setup)
// In real prod, this would be process.env.NEXT_PUBLIC_API_URL
export const api = new ApiClient('http://localhost:3001'); 
