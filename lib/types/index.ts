/**
 * Central export point for all types
 * Import types from here for consistency
 */

// Database types
export type {
  Database,
  Event,
  EventInsert,
  EventUpdate,
  Venue,
  VenueInsert,
  VenueUpdate,
  EventVenue,
  EventVenueInsert,
  EventVenueUpdate,
} from "./database";

// API/Domain types
export type {
  EventWithVenues,
  EventFormData,
  SportType,
  EventFilters,
  PaginationParams,
  PaginatedResponse,
} from "./api";

export { SPORT_TYPES } from "./api";

// Error types
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
} from "./errors";
