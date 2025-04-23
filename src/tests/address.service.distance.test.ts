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