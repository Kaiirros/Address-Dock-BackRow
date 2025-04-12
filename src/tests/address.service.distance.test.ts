import addressService from "../services/address.service";

describe("Address Service", () => {
    it("Return distance in Kilometers", async () => {
        const addressRequest = {
            body: {
                lat1: 40.7128,
                lon1: -74.0060,
                lat2: 34.0522,
                lon2: -118.2437,
                unit: "KM"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expect.any(Number));
    });

    it("Return distance in Miles", async () => {
        const addressRequest = {
            body: {
                lat1: 40.7128,
                lon1: -74.0060,
                lat2: 34.0522,
                lon2: -118.2437,
                unit: "Mi"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expect.any(Number));
    });

    it("Expecting the distance to be 107.5173 KM", async () => {
        const addressRequest = {
            body: {
                lat1: 43.1566,
                lon1: 77.6088,
                lat2: 42.8869,
                lon2: 78.8789,
                unit: "KM"
            }
        };

        const expectedDistance = 107.5173; 

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expectedDistance);
    });

    it("Expecting the distance to be 66.8081 Mi", async () => {
        const addressRequest = {
            body: {
                lat1: 43.1566,
                lon1: 77.6088,
                lat2: 42.8869,
                lon2: 78.8789,
                unit: "Mi"
            }
        };

        const expectedDistance = 66.8081; 

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("distance", expectedDistance);
    });

    it("Throw exception if unit is blank", async () => {
        const addressRequest = {
            body: {
                lat1: 40.7128,
                lon1: -74.0060,
                lat2: 34.0522,
                lon2: -118.2437,
                unit: ""
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Invalid unit");
    });

    it("Throw exception if latitude is missing", async () => {
        const addressRequest = {
            body: {
                lon1: -74.0060,
                lat2: 34.0522,
                lon2: -118.2437,
                unit: ""
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Missing required coordinates");
    });

    it("Throw exception if coordinates are not valid numbers", async () => {
        const addressRequest = {
            body: {
                lat1: "invalid",
                lon1: -74.0060,
                lat2: 34.0522,
                lon2: "invalid",
                unit: "KM"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Coordinates must be valid numbers");
    });

    it("Throw exception if coordinates are NaN", async () => {
        const addressRequest = {
            body: {
                lat1: NaN,
                lon1: -74.0060,
                lat2: 34.0522,
                lon2: NaN,
                unit: "KM"
            }
        };

        const response = await addressService.distance(addressRequest);
        expect(response).toHaveProperty("error", "Missing required coordinates");
    });
});
