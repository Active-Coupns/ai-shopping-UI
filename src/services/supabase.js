import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "placeholder");

export const isSupabaseConfigured = isConfigured;

export const supabase = createClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
);

export const isMockAuthMode = () => {
  return !isConfigured;
};

const mockAuth = {
  signUp: async (email, password, fullName, country) => {
    const user = {
      id: "mock-user-id-" + Date.now(),
      email,
      user_metadata: {
        full_name: fullName,
        country
      }
    };
    const session = {
      access_token: "mock-jwt-token-jwt-" + btoa(JSON.stringify(user)),
      user
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_supabase_session", JSON.stringify(session));
    }
    return { data: { user, session }, error: null };
  },
  
  signIn: async (email, password) => {
    const user = {
      id: "mock-user-id-default",
      email,
      user_metadata: {
        full_name: email.split("@")[0].toUpperCase(),
        country: "IN"
      }
    };
    const session = {
      access_token: "mock-jwt-token-jwt-" + btoa(JSON.stringify(user)),
      user
    };
    if (typeof window !== "undefined") {
      localStorage.setItem("mock_supabase_session", JSON.stringify(session));
    }
    return { data: { user, session }, error: null };
  },

  signOut: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mock_supabase_session");
    }
    return { error: null };
  },

  getSession: async () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("mock_supabase_session");
      if (data) {
        return { data: { session: JSON.parse(data) }, error: null };
      }
    }
    return { data: { session: null }, error: null };
  },

  getUser: async () => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("mock_supabase_session");
      if (data) {
        const session = JSON.parse(data);
        return { data: { user: session.user }, error: null };
      }
    }
    return { data: { user: null }, error: null };
  }
};

export const auth = {
  signUp: async ({ email, password, options }) => {
    if (isMockAuthMode()) {
      const fullName = options?.data?.full_name || "";
      const country = options?.data?.country || "IN";
      return mockAuth.signUp(email, password, fullName, country);
    }
    return supabase.auth.signUp({ email, password, options });
  },

  signInWithPassword: async ({ email, password }) => {
    if (isMockAuthMode()) {
      return mockAuth.signIn(email, password);
    }
    return supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    if (isMockAuthMode()) {
      return mockAuth.signOut();
    }
    return supabase.auth.signOut();
  },

  getSession: async () => {
    if (isMockAuthMode()) {
      return mockAuth.getSession();
    }
    return supabase.auth.getSession();
  },

  getUser: async (token) => {
    if (isMockAuthMode() || (token && token.startsWith("mock-jwt-token-jwt-"))) {
      if (token && token.startsWith("mock-jwt-token-jwt-")) {
        try {
          const userJson = atob(token.replace("mock-jwt-token-jwt-", ""));
          return { data: { user: JSON.parse(userJson) }, error: null };
        } catch (e) {
          return { data: { user: null }, error: new Error("Invalid mock token") };
        }
      }
      return mockAuth.getUser();
    }
    
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      return { data: { user }, error };
    }
    return supabase.auth.getUser();
  }
};
