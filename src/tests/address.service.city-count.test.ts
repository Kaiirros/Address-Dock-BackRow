import addressService from "../services/address.service";

describe("Address Service", () => {
    it("Should retrun all states with the given city", async () => {
        const addressRequest = {
            body: {
                "city": "Rochester"
            }
        };

        const response = await addressService.city_count(addressRequest);
        expect(response).toHaveProperty("states", expect.any(Array));
        expect(response.states.length).toBeGreaterThan(0);
        expect(response.states[0]).toHaveProperty("state", expect.any(String));
        expect(response.states).toContain("NY");
    });
});