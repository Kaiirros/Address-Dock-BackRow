import addressService from "../services/address.service";

describe("Address Service - Distance", () => {
  it("Return distance in Kilometers", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
        },
        location2: {
          state: "AK",
        },
        unit: "KM" as const,
      },
    };

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty("distance", expect.any(Number));
  });

  it("Return distance in Miles", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
        },
        location2: {
          state: "AK",
        },
        unit: "Mi" as const,
      },
    };

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty("distance", expect.any(Number));
  });

  it("Expecting the distance to be 56.2786811179502 Mi", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
          city: "Rochester",
        },
        location2: {
          state: "NY",
          city: "Buffalo",
        },
        unit: "Mi" as const,
      },
    };

    const expectedDistance = 56.2786811179502;

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty("distance", expectedDistance);
  });

  it("Expecting the distance to be 90.57178580582325 Mi", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
          city: "Rochester",
        },
        location2: {
          state: "NY",
          city: "Buffalo",
        },
        unit: "KM" as const,
      },
    };

    const expectedDistance = 90.57178580582325;

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty("distance", expectedDistance);
  });

  it("Throw exception if unit is blank", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
          city: "Rochester",
        },
        location2: {
          state: "NY",
          city: "Buffalo",
        },
        unit: undefined,
      },
    };

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty(
      "error",
      "Invalid unit. Please use 'KM' or 'Mi'."
    );
  });

  it("Throw exception if location 2 is missing", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
          city: "Rochester",
        },
        unit: "Mi" as const,
      },
    };

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty("error", "Please provide both locations.");
  });

  it("Throw exception if locations are not valid objects", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
          city: "Rochester",
        },
        location2: {} as Record<string, unknown>,
      },
    };

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty(
      "error",
      "Invalid locations. Please ensure both locations have at least one required property. Required properties: zipcode, number, street, street2, city, state, country"
    );
  });

  it("Throw exception if a required property is missing in location1", async () => {
    const addressRequest = {
      body: {
        location1: {
          bagel: "Rochester",
        } as Record<string, unknown>,
        location2: {
          state: "NY",
          city: "Buffalo",
        },
        unit: "Mi" as const,
      },
    };

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty(
      "error",
      "Invalid locations. Please ensure both locations have at least one required property. Required properties: zipcode, number, street, street2, city, state, country"
    );
  });

  it("Throw exception if a city does not exist", async () => {
    const addressRequest = {
      body: {
        location1: {
          state: "NY",
          city: "NonExistentCity",
        },
        location2: {
          state: "NY",
          city: "Buffalo",
        },
        unit: "Mi" as const,
      },
    };

    const response = await addressService.distance(addressRequest);
    expect(response).toHaveProperty(
      "error",
      "Invalid locations. Please ensure both locations are valid."
    );
  });
});
