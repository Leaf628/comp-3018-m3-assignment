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
});