import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from "@/lib/actions/events";
import type { EventFormData } from "@/lib/types";
import { createClient as createSupabaseClient } from "@/lib/utils/supabase/server";

jest.mock("@/lib/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

// Create mock functions for each method in the chain
const mockFrom = jest.fn();
const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockOrder = jest.fn();
const mockSingle = jest.fn();
const mockIlike = jest.fn();
const mockGetUser = jest.fn();

// Helper to create a chainable query builder mock
function createQueryBuilder() {
  return {
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    order: mockOrder,
    single: mockSingle,
    ilike: mockIlike,
  };
}

function setupSupabaseMock() {
  const mockSupabase = {
    from: mockFrom,
    auth: {
      getUser: mockGetUser,
    },
  };
  
  (createSupabaseClient as jest.Mock).mockResolvedValue(mockSupabase);
  
  // Default: from() returns a query builder
  mockFrom.mockReturnValue(createQueryBuilder());
}

describe("events actions CRUD", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupSupabaseMock();
  });

  test("getEvents returns list of events", async () => {
    const mockData = [
      {
        id: "1",
        name: "Event 1",
        sport_type: "Soccer",
        date_time: new Date().toISOString(),
        description: "Test event 1",
        created_by: "user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        event_venues: [],
      },
    ];

    // Chain: from() -> select() -> order() -> returns promise
    mockSelect.mockReturnValue({
      order: mockOrder,
    });
    mockOrder.mockResolvedValue({ data: mockData, error: null });

    const result = await getEvents();

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Event 1");
      expect(result.data[0].venues).toEqual([]);
    }
  });

  test("getEvents with filters", async () => {
    const mockData = [
      {
        id: "1",
        name: "Soccer Match",
        sport_type: "Soccer",
        date_time: new Date().toISOString(),
        description: "Test event",
        created_by: "user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        event_venues: [],
      },
    ];

    // Chain: from() -> select() -> order() -> ilike() -> returns promise
    // The order() returns a query builder that has ilike()
    mockSelect.mockReturnValue({
      order: mockOrder,
    });
    // order() returns a query builder with ilike()
    mockOrder.mockReturnValue({
      ilike: mockIlike,
    });
    // ilike() returns a promise
    mockIlike.mockResolvedValue({ data: mockData, error: null });

    const result = await getEvents({ search: "Soccer" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(1);
    }
  });

  test("getEvent returns a single event", async () => {
    const mockEvent = {
      id: "1",
      name: "Event 1",
      sport_type: "Soccer",
      date_time: new Date().toISOString(),
      description: "Test event 1",
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      event_venues: [],
    };

    // Chain: from() -> select() -> eq() -> single() -> returns promise
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      single: mockSingle,
    });
    mockSingle.mockResolvedValue({ data: mockEvent, error: null });

    const result = await getEvent("1");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe("1");
      expect(result.data.name).toBe("Event 1");
      expect(result.data.venues).toEqual([]);
    }
  });

  test("createEvent creates an event", async () => {
    const eventData: EventFormData = {
      name: "New Event",
      sport_type: "Basketball",
      date_time: new Date().toISOString(),
      description: "New event description",
      venue_ids: [],
    };

    const createdEvent = {
      id: "1",
      name: "New Event",
      sport_type: "Basketball",
      date_time: eventData.date_time,
      description: "New event description",
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Mock auth.getUser for withAuth
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    // Chain for insert: from("events") -> insert() -> select() -> single() -> returns promise
    mockInsert.mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: createdEvent,
          error: null,
        }),
      }),
    });

    // Mock getEvent call (createEvent calls getEvent at the end)
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      single: mockSingle,
    });
    mockSingle.mockResolvedValue({
      data: { ...createdEvent, event_venues: [] },
      error: null,
    });

    const result = await createEvent(eventData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("New Event");
      expect(result.data.sport_type).toBe("Basketball");
    }
  });

  test("createEvent with venues", async () => {
    const eventData: EventFormData = {
      name: "New Event",
      sport_type: "Basketball",
      date_time: new Date().toISOString(),
      description: "New event description",
      venue_ids: ["venue-1", "venue-2"],
    };

    const createdEvent = {
      id: "1",
      name: "New Event",
      sport_type: "Basketball",
      date_time: eventData.date_time,
      description: "New event description",
      created_by: "user-1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    // Mock insert for events
    mockInsert.mockReturnValue({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: createdEvent,
          error: null,
        }),
      }),
    });

    // Mock insert for event_venues (called when venue_ids provided)
    let venueInsertCallCount = 0;
    mockFrom.mockImplementation((table: string) => {
      if (table === "event_venues") {
        venueInsertCallCount++;
        return {
          insert: jest.fn().mockResolvedValue({ error: null }),
        };
      }
      return createQueryBuilder();
    });

    // Mock getEvent call
    mockSelect.mockReturnValue({
      eq: mockEq,
    });
    mockEq.mockReturnValue({
      single: mockSingle,
    });
    mockSingle.mockResolvedValue({
      data: {
        ...createdEvent,
        event_venues: [
          { venue: { id: "venue-1", name: "Venue 1" } },
          { venue: { id: "venue-2", name: "Venue 2" } },
        ],
      },
      error: null,
    });

    const result = await createEvent(eventData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("New Event");
      expect(venueInsertCallCount).toBeGreaterThan(0);
    }
  });

  test("updateEvent updates an event", async () => {
    const eventData: EventFormData = {
      name: "Updated Event",
      sport_type: "Tennis",
      date_time: new Date().toISOString(),
      description: "Updated description",
      venue_ids: [],
    };

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    // First call: check ownership - from("events") -> select() -> eq() -> single()
    let callCount = 0;
    mockSelect.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        // First call: check ownership
        return {
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { created_by: "user-1" },
              error: null,
            }),
          }),
        };
      }
      // Subsequent calls for getEvent
      return {
        eq: mockEq,
      };
    });

    // Update call: from("events") -> update() -> eq() -> select() -> single()
    mockUpdate.mockReturnValue({
      eq: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              id: "1",
              ...eventData,
              created_by: "user-1",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            error: null,
          }),
        }),
      }),
    });

    // Delete event_venues call: from("event_venues") -> delete() -> eq()
    let deleteCallCount = 0;
    mockFrom.mockImplementation((table: string) => {
      if (table === "event_venues" && deleteCallCount === 0) {
        deleteCallCount++;
        return {
          delete: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ error: null }),
          }),
        };
      }
      return createQueryBuilder();
    });

    // Mock getEvent call at the end
    mockEq.mockReturnValue({
      single: mockSingle,
    });
    mockSingle.mockResolvedValue({
      data: {
        id: "1",
        ...eventData,
        created_by: "user-1",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        event_venues: [],
      },
      error: null,
    });

    const result = await updateEvent("1", eventData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Updated Event");
      expect(result.data.sport_type).toBe("Tennis");
    }
  });

  test("deleteEvent deletes an event", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    // First call: check ownership - from("events") -> select() -> eq() -> single()
    mockSelect.mockReturnValueOnce({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: { created_by: "user-1" },
          error: null,
        }),
      }),
    });

    // Delete call: from("events") -> delete() -> eq() -> returns promise
    mockDelete.mockReturnValue({
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    const result = await deleteEvent("1");

    expect(result.success).toBe(true);
  });

  test("deleteEvent fails if user doesn't own event", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });

    // Check ownership returns different user
    mockSelect.mockReturnValueOnce({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: { created_by: "user-2" },
          error: null,
        }),
      }),
    });

    const result = await deleteEvent("1");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.message).toContain("own events");
    }
  });
});
