import addressService from "../services/address.service";

describe("Address Service - Zip Code", () => {
    it("should return city name for a valid zip code", async () => {
        const zipcode = "14623";

        const response = await addressService.getCityByZip(zipcode);

        expect(response).toBeDefined();
        expect(typeof response).toBe("string");
        expect(response).toBe("ROCHESTER"); // Replace with the expected city for the zip code
    }, 60000); // 60 seconds timeout

    it("should throw an error for missing zip code", async () => {
        const zipcode = "";

        await expect(addressService.getCityByZip(zipcode)).rejects.toThrow("Invalid zip code provided.");
    }, 60000); // 60 seconds timeout

    it("should throw an error for invalid zip code", async () => {
        const zipcode = "00000";

        await expect(addressService.getCityByZip(zipcode)).rejects.toThrow("No city found for the provided zip code.");
    }, 60000); // 60 seconds timeout

    it("should throw an error if zip code is not a string", async () => {
        const zipcode = 12345 as unknown as string; // Simulate invalid type

        await expect(addressService.getCityByZip(zipcode)).rejects.toThrow("Invalid zip code provided.");
    }, 60000); // 60 seconds timeout
});