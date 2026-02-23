/**
 * Result type for type-safe error handling
 * Inspired by Rust's Result<T, E> pattern
 */

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Creates a successful result
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Creates a failed result
 */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Unwraps a result, throwing if it's an error
 * Use with caution - prefer pattern matching
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.success) {
    return result.data;
  }
  throw result.error;
}

/**
 * Unwraps a result, returning a default value if it's an error
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.success) {
    return result.data;
  }
  return defaultValue;
}
