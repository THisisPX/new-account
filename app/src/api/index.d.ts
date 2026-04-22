declare module '@/api' {
  export const adminApi: {
    login: (username: string, password: string) => Promise<{ token: string }>;
    logout: () => Promise<void>;
    getMe: () => Promise<any>;
  };

  export const rentAccountApi: {
    getAll: () => Promise<any[]>;
    getAllAdmin: () => Promise<any[]>;
    getById: (id: string) => Promise<any>;
    create: (account: any) => Promise<any>;
    update: (id: string, account: any) => Promise<any>;
    delete: (id: string) => Promise<boolean>;
  };

  export const sellAccountApi: {
    getAll: () => Promise<any[]>;
    getById: (id: string) => Promise<any>;
    create: (account: any) => Promise<any>;
    approve: (id: string) => Promise<any>;
    reject: (id: string) => Promise<any>;
    complete: (id: string) => Promise<any>;
    update: (id: string, account: any) => Promise<any>;
    delete: (id: string) => Promise<boolean>;
  };
}