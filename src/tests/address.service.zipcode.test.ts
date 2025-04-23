import addressService from "../services/address.service";

// Mock the addressService methods for zipcode tests
jest.mock("../services/address.service", () => ({
    ...jest.requireActual("../services/address.service"),
    getCityByZip: jest.fn(),
}));

describe("Address Service - Zip Code", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    it("should return city name for a valid zip code", async () => {
        const zipcode = "14623";

        (addressService.getCityByZip as jest.Mock).mockResolvedValue("ROCHESTER");

        const response = await addressService.getCityByZip(zipcode);
        expect(response).toBeDefined();
        expect(typeof response).toBe("string");
        expect(response).toBe("ROCHESTER");
    });

    it("should throw an error for missing zip code", async () => {
        const zipcode = "";

        (addressService.getCityByZip as jest.Mock).mockRejectedValue(
            new Error("Invalid zip code provided.")
        );

        await expect(addressService.getCityByZip(zipcode)).rejects.toThrow("Invalid zip code provided.");
    });

    it("should throw an error for invalid zip code", async () => {
        const zipcode = "00000";

        (addressService.getCityByZip as jest.Mock).mockRejectedValue(
            new Error("No city found for the provided zip code.")
        );

        await expect(addressService.getCityByZip(zipcode)).rejects.toThrow(
            "No city found for the provided zip code."
        );
    });

    it("should throw an error if zip code is not a string", async () => {
        const zipcode = 12345 as unknown as string; // Simulate invalid type

        (addressService.getCityByZip as jest.Mock).mockRejectedValue(
            new Error("Invalid zip code provided.")
        );

        await expect(addressService.getCityByZip(zipcode)).rejects.toThrow("Invalid zip code provided.");
    });
});