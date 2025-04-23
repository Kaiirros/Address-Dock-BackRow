import addressService from "../services/address.service";

describe("Address Service", () => {
    it("Should return all states with the given city", async () => {
        const addressRequest = {
            body: {
                "city": "Rochester"
            }
        };

        const response = await addressService.city_count(addressRequest);
        expect(response).toHaveProperty("states", expect.any(Array));
        expect(response.states.length).toBe(2);
    });

    it("Throw exception if city is not provided", async () => {
        const addressRequest = {
            body: {}
        };

        const response = await addressService.city_count(addressRequest);
        expect(response).toHaveProperty("error", expect.any(String));
        expect(response.error).toBe("Please provide a valid city.");
    })

    it("Should return an empty array if city is fake", async () => {
        const addressRequest = {
            body: {
                "city": "FakeCity"
            }
        };

        const response = await addressService.city_count(addressRequest);
        expect(response).toHaveProperty("states", expect.any(Array));
        expect(response.states.length).toBe(0);
    })
});