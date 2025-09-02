const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api');

// Debug logging for API configuration
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    API_BASE_URL,
    NODE_ENV: process.env.NODE_ENV
  });
}

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private refreshPromise: Promise<ApiResponse> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string, 
    method: HttpMethod = 'GET', 
    body?: any, 
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    if (typeof window === 'undefined') return { error: 'Server-side requests not allowed' }

    const url = `${this.baseURL}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    };

    if (body) options.body = JSON.stringify(body);

    // Debug logging for auth endpoints
    if (endpoint.includes('/auth/') && process.env.NODE_ENV === 'development') {
      console.log(`🔐 API Request: ${method} ${url}`, { body, retryCount });
    }

    // Debug logging for achievements endpoints
    if (endpoint.includes('/achievements') && process.env.NODE_ENV === 'development') {
      console.log(`🏆 API Request: ${method} ${url}`, { body, retryCount });
    }

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.warn(`⚠️ Request timeout: ${method} ${url}`);
        controller.abort();
      }, 3000); // 3 seconds for normal timeout
      
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);

      // Debug logging for auth responses
      if (endpoint.includes('/auth/') && process.env.NODE_ENV === 'development') {
        console.log(`🔐 API Response: ${method} ${url}`, { 
          status: response.status, 
          ok: response.ok,
          statusText: response.statusText 
        });
      }

      // Debug logging for achievements responses
      if (endpoint.includes('/achievements') && process.env.NODE_ENV === 'development') {
        console.log(`🏆 API Response: ${method} ${url}`, { 
          status: response.status, 
          ok: response.ok,
          statusText: response.statusText 
        });
      }

      if (response.status === 401 && retryCount === 0) {
        if (this.isRefreshing && this.refreshPromise) {
          console.log('🔄 Token refresh already in progress, waiting...');
          await this.refreshPromise;
          return this.request(endpoint, method, body, retryCount + 1);
        }

        console.log('🔄 Starting token refresh...');
        this.isRefreshing = true;
        this.refreshPromise = this.refreshToken();

        try {
          const refreshResult = await this.refreshPromise;
          if (!refreshResult.error) {
            console.log('✅ Token refresh successful, retrying original request');
            return this.request(endpoint, method, body, retryCount + 1);
          } else {
            console.log('❌ Token refresh failed:', refreshResult.error);
            return { error: 'Authentication failed' };
          }
        } finally {
          this.isRefreshing = false;
          this.refreshPromise = null;
        }
      }

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch {
          // If not JSON, try to get text
          const text = await response.text();
          errorData = { message: text };
        }
        return { error: (errorData && typeof errorData.message === 'string') ? errorData.message : `HTTP error! status: ${response.status}` };
      }

      // Check if response is empty
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.warn(`⚠️ Empty response from: ${method} ${url}`);
        return { data: undefined }; // Return undefined for empty responses
      }

      // Parse JSON safely
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error(`❌ JSON parse error for: ${method} ${url}`, parseError, 'Response text:', responseText);
        return { error: 'Invalid JSON response from server' };
      }
      
      // Debug logging for achievements data
      if (endpoint.includes('/achievements') && process.env.NODE_ENV === 'development') {
        console.log(`🏆 API Data: ${method} ${url}`, { 
          data,
          dataType: typeof data,
          isArray: Array.isArray(data),
          length: Array.isArray(data) ? data.length : 'N/A'
        });
      }
      
      return { data };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout' };
      }
      console.error(`❌ Request error: ${method} ${url}`, error);
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Health check endpoint
  healthCheck = () => this.request('/health');

  // Auth endpoints
  register = (email: string, password: string, username: string) =>
    this.request('/auth/register', 'POST', { email, password, username, name: username, role: 'student' });

  login = (email: string, password: string) =>
    this.request('/auth/login', 'POST', { email, password });

  logout = () => this.request('/auth/logout', 'POST');
  refreshToken = () => this.request('/auth/refresh', 'POST');
  getProfile = () => this.request('/auth/profile');

  // User endpoints
  getUsers = () => this.request('/users');
  getUser = (id: number) => this.request(`/users/${id}`);
  updateUser = (id: number, updates: any) => this.request(`/users/${id}`, 'PATCH', updates);
  deleteUser = (id: number) => this.request(`/users/${id}`, 'DELETE');
  getMe = () => this.request('/users/profile/me');

  // User Stats and Progress endpoints
  getUserStats = (userId: number) => this.request(`/users/${userId}/stats`);
  getUserAchievements = (userId: number) => this.request(`/users/${userId}/achievements`);
  updateUserAchievements = (userId: number) => this.request(`/users/${userId}/achievements/update`, 'POST');
  getWeeklyProgress = (userId: number) => this.request(`/users/${userId}/progress/weekly`);

  // Quiz Analytics endpoints
  getQuizAnalytics = (structureId: number, quizId: number) => this.request(`/data-structures/${structureId}/quizzes/${quizId}/analytics`);
  getQuizResults = (structureId: number, quizId: number) => this.request(`/data-structures/${structureId}/quizzes/${quizId}/results`);
  getUnlockedQuizzes = (structureId: number, userId: number) => this.request(`/data-structures/${structureId}/quizzes/${userId}/unlocked`);

  // Content History endpoints
  getContentHistory = (structureId: number, contentId: number) => this.request(`/data-structures/${structureId}/content/${contentId}/history`);

  // Data Structures endpoints
  getDataStructures = () => this.request('/data-structures');
  getDataStructure = (id: number) => this.request(`/data-structures/${id}`);
  createDataStructure = (data: any) => this.request('/data-structures', 'POST', data);
  updateDataStructure = (id: number, data: any) => this.request(`/data-structures/${id}`, 'PATCH', data);
  deleteDataStructure = (id: number) => this.request(`/data-structures/${id}`, 'DELETE');
  getMyDataStructures = () => this.request('/data-structures/me');

  // Quiz endpoints
  getQuizzes = (dataStructureId: number) => this.request(`/data-structures/${dataStructureId}/quizzes`);
  getQuiz = (structureId: number, quizId: number) => this.request(`/data-structures/${structureId}/quizzes/${quizId}`);
  createQuiz = (dataStructureId: number, quizData: any) => this.request(`/data-structures/${dataStructureId}/quizzes`, 'POST', quizData);
  submitQuiz = (structureId: number, quizId: number, answers: any[]) => this.request(`/data-structures/${structureId}/quizzes/${quizId}/attempt`, 'POST', { answers });
  deleteQuiz = (structureId: number, quizId: number) => this.request(`/data-structures/${structureId}/quizzes/${quizId}`, 'DELETE');
  updateQuiz = (structureId: number, quizId: number, data: any) => this.request(`/data-structures/${structureId}/quizzes/${quizId}`, 'PATCH', data);

  // Content endpoints
  getDataStructureContent = (id: number) => this.request(`/data-structures/${id}/content`);
  createContent = (dataStructureId: number, data: any) => this.request(`/data-structures/${dataStructureId}/content`, 'POST', data);
  updateContent = (dataStructureId: number, contentId: number, data: any) => this.request(`/data-structures/${dataStructureId}/content/${contentId}`, 'PATCH', data);
  deleteContent = (dataStructureId: number, contentId: number) => this.request(`/data-structures/${dataStructureId}/content/${contentId}`, 'DELETE');

  // Slug endpoints
  getDataStructureBySlug = (slug: string) => this.request(`/data-structures/slug/${slug}`);
  getQuizzesBySlug = (slug: string) => this.request(`/data-structures/slug/${slug}/quizzes`);
}

export const apiClient = new ApiClient(API_BASE_URL);