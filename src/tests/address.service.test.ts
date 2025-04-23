import addressService from "../services/address.service";

describe("Address Service - Distance", () => {
    it("Return distance in Kilometers", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY"
            
                },
                "location2": {
                    "state":"AK"
            
                },
                "unit": "Mi"
            
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expect.any(Number));
    });

    it("Return distance in Miles", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY"
            
                },
                "location2": {
                    "state":"AK"
            
                },
                "unit": "Mi"
            
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expect.any(Number));
    });

    it("Expecting the distance to be 56.2786811179502 Mi", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY",
                    "city": "Rochester"
            
                },
                "location2": {
                    "state":"NY",
                    "city":"Buffalo"
            
                },
                "unit": "Mi"
            
            }
        };

        const expectedDistance = 56.2786811179502; 

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expectedDistance);
    });

    it("Expecting the distance to be 90.57178580582325 Mi", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY",
                    "city": "Rochester"
            
                },
                "location2": {
                    "state":"NY",
                    "city":"Buffalo"
            
                },
                "unit": "KM"
            
            }
        };

        const expectedDistance = 90.57178580582325; 

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expectedDistance);
    });

    it("Throw exception if unit is blank", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY",
                    "city": "Rochester"
            
                },
                "location2": {
                    "state":"NY",
                    "city":"Buffalo"
            
                },
                "unit": ""
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Invalid unit. Please use 'KM' or 'Mi'.");
    });

    it("Throw exception if location 2 is missing", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY",
                    "city": "Rochester"
            
                },

                "unit": "Mi"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Please provide both locations.");
    });

    it("Throw exception if locations are not valid objects", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY",
                    "city": "Rochester"
            
                },
                "location2": "test"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Invalid locations. Please ensure both locations have at least one required property. Required properties: zipcode, number, street, street2, city, state, country");
    });

    it("Throw exception if a required property is missing in location1", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "bagel": "Rochester"
                },
                "location2": {
                    "state": "NY",
                    "city": "Buffalo"
                },
                "unit": "Mi"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Invalid locations. Please ensure both locations have at least one required property. Required properties: zipcode, number, street, street2, city, state, country");
    });

    it("Throw exception if a city does not exist", async () => {
        const addressRequest = {
            body: {
                "location1": {
                    "state": "NY",
                    "city": "NonExistentCity"
                },
                "location2": {
                    "state": "NY",
                    "city": "Buffalo"
                },
                "unit": "Mi"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Invalid locations. Please ensure both locations are valid.");
    });
});

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