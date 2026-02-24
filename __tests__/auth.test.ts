import { signUp, signIn, signOut } from "@/lib/actions/auth";
import { createClient as createSupabaseClient } from "@/lib/utils/supabase/server";

jest.mock("@/lib/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

const mockSignUp = jest.fn();
const mockSignInWithPassword = jest.fn();
const mockSignOut = jest.fn();

function setupSupabaseMock() {
  const mockSupabase = {
    auth: {
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
    },
  };

  (createSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase);
}

describe("authentication actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupSupabaseMock();
  });

  describe("signUp", () => {
    test("successfully signs up a new user", async () => {
      const email = "test@example.com";
      const password = "password123";

      mockSignUp.mockResolvedValue({
        data: {
          user: {
            id: "user-123",
            email: email,
          },
        },
        error: null,
      });

      const result = await signUp(email, password);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.user.id).toBe("user-123");
        expect(result.data.user.email).toBe(email);
      }
      expect(mockSignUp).toHaveBeenCalledWith({
        email,
        password,
      });
    });

    test("fails with invalid email", async () => {
      const result = await signUp("invalid-email", "password123");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Valid email is required");
      }
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    test("fails with email missing @ symbol", async () => {
      const result = await signUp("notanemail.com", "password123");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Valid email is required");
      }
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    test("fails with password too short", async () => {
      const result = await signUp("test@example.com", "short");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("at least 6 characters");
      }
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    test("fails with empty password", async () => {
      const result = await signUp("test@example.com", "");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("at least 6 characters");
      }
      expect(mockSignUp).not.toHaveBeenCalled();
    });

    test("fails when Supabase returns an error", async () => {
      const email = "test@example.com";
      const password = "password123";

      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: { message: "User already exists" },
      });

      const result = await signUp(email, password);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("User already exists");
      }
    });

    test("fails when user is null after signup", async () => {
      const email = "test@example.com";
      const password = "password123";

      mockSignUp.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await signUp(email, password);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Failed to create user");
      }
    });

    test("handles user email being null and uses provided email", async () => {
      const email = "test@example.com";
      const password = "password123";

      mockSignUp.mockResolvedValue({
        data: {
          user: {
            id: "user-123",
            email: null,
          },
        },
        error: null,
      });

      const result = await signUp(email, password);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.user.email).toBe(email);
      }
    });
  });

  describe("signIn", () => {
    test("successfully signs in a user", async () => {
      const email = "test@example.com";
      const password = "password123";

      mockSignInWithPassword.mockResolvedValue({
        data: {
          user: {
            id: "user-123",
            email: email,
          },
        },
        error: null,
      });

      const result = await signIn(email, password);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.user.id).toBe("user-123");
        expect(result.data.user.email).toBe(email);
      }
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      });
    });

    test("fails with invalid email", async () => {
      const result = await signIn("invalid-email", "password123");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Valid email is required");
      }
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    test("fails with empty password", async () => {
      const result = await signIn("test@example.com", "");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Password is required");
      }
      expect(mockSignInWithPassword).not.toHaveBeenCalled();
    });

    test("fails with wrong password", async () => {
      const email = "test@example.com";
      const password = "wrongpassword";

      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: "Invalid login credentials" },
      });

      const result = await signIn(email, password);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Invalid login credentials");
      }
    });

    test("fails when user is null after signin", async () => {
      const email = "test@example.com";
      const password = "password123";

      mockSignInWithPassword.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await signIn(email, password);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Failed to sign in");
      }
    });

    test("handles user email being null and uses provided email", async () => {
      const email = "test@example.com";
      const password = "password123";

      mockSignInWithPassword.mockResolvedValue({
        data: {
          user: {
            id: "user-123",
            email: null,
          },
        },
        error: null,
      });

      const result = await signIn(email, password);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.user.email).toBe(email);
      }
    });
  });

  describe("signOut", () => {
    test("successfully signs out a user", async () => {
      mockSignOut.mockResolvedValue({ error: null });

      const result = await signOut();

      expect(result.success).toBe(true);
      expect(mockSignOut).toHaveBeenCalled();
    });

    test("fails when Supabase returns an error", async () => {
      mockSignOut.mockResolvedValue({
        error: { message: "Sign out failed" },
      });

      const result = await signOut();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("Sign out failed");
      }
    });
  });
});
