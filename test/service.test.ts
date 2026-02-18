import * as eventService from "../src/api/v1/services/eventService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { mock } from "node:test";
import { date } from "joi";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

describe("Event Services", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Mock test of creating an event
    describe("Event Service - CreateEvent", () => {
        // test case # 1
        it("should create a new event successfully", async () => {
            // Arrange
            const mockInput = {
                name: "test-event-1",
                date: "2026-06-01",
                capacity: 200,
            };

            (firestoreRepository.createDocument as jest.Mock).mockResolvedValue({});
        
            // Act
            const result = await eventService.createEvent(mockInput);
        
            // Assert
            expect(firestoreRepository.createDocument).toHaveBeenCalledWith("events",
                expect.objectContaining({
                    id: expect.any(String),
                    name: "test-event-1",
                    date: expect.any(Date),
                    capacity: 200,
                    registrationCount: 0,
                    status: "active",
                    category: "general",
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date),
                })
            );

            // Return result of validation
            expect(result).toEqual(
                {
                    id: expect.any(String),
                    name: "test-event-1",
                    date: expect.any(Date),
                    capacity: 200,
                    registrationCount: 0,
                    status: "active",
                    category: "general",
                    createdAt: expect.any(Date),
                    updatedAt: expect.any(Date)
                }
            );
        });
    });


    // test case # 2 - getAllEvents
    describe("Event Service - GetAllEvents", () => {

        it("should retrieve the list of events successfully", async () => {
            // Arrange
            const mockEvents = [
                {id: "evt_test_1", name: "Event_test_1", date: "2026-06-01", capacity: 100},
                {id: "evt_test_2", name: "Event_test_2", date: "2026-06-02", capacity: 100}
            ];

            (firestoreRepository.getAllDocuments as jest.Mock).mockResolvedValue(mockEvents);

            // Act
            const result = await eventService.getAllEvents();

            // expected results should be an array matching with the mockRepositsoryResponse
            expect(firestoreRepository.getAllDocuments).toHaveBeenCalledWith("events");
            expect(result).toEqual({
                count: 2,
                events:mockEvents});
            });
        });

        it("should return empty array with count 0 when no events", async () => {
            // Arrange
            (firestoreRepository.getAllDocuments as jest.Mock).mockResolvedValue([]);

            // Act
            const result = await eventService.getAllEvents();

            // Assert
            expect(result).toEqual({
                count: 0, 
                events: []
            });
        });

    // test case # 3 - getEventById
    describe("getEventById", () => {
        it("should return event by id", async () => {
            const mockEvent = {
                id: "evt_001",
                name: "Test Event"
            };

            (firestoreRepository.getDocById as jest.Mock).mockResolvedValue(mockEvent);

            const result = await eventService.getEventById("evt_001");
        
            expect(firestoreRepository.getDocById).toHaveBeenCalledWith("events", "evt_001");
        
            expect(result).toEqual(mockEvent);
        });
    });

    // test case # 4 - update an event
    describe("updateEvent", () => {
        it("should update event successfully", async () => {
            // Arrange
            const existingEvent = {
                id: " evt_001",
                name: "old-name",
                date: new Date("2026-06-01"),
                capacity: 100,
                status: "active"
            };
        
        (firestoreRepository.getDocById as jest.Mock).mockResolvedValue(existingEvent);

        (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue({});

        const result = await eventService.updateEvent(
            "evt_001", 
            {name: "new-name", date: new Date("2026-06-01"), capacity: 100}
            );
            expect(firestoreRepository.updateDocument).toHaveBeenCalledWith(
                "events", 
                "evt_001",
            expect.objectContaining({
                name: "new-name", 
                updatedAt: expect.any(Date)
                })
            );
        });
    });

});