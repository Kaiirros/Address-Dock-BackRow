import loggerService from "./logger.service";

interface AddressRequest {
  body?: {
    [key: string]: unknown;
  };
}

interface AddressResponse {
  [key: string]: unknown;
  length?: number;
}

interface Location {
  [key: string]: unknown;
}

class AddressService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  constructor() {}

  public async count(
    addressRequest?: AddressRequest
  ): Promise<{ count: number }> {
    const response = await this.request(addressRequest);
    return { count: response.length ?? 0 };
  }

  public async request(
    addressRequest?: AddressRequest
  ): Promise<AddressResponse> {
    try {
      const response = await fetch(AddressService.fetchUrl, {
        method: "POST",
        body: JSON.stringify(addressRequest?.body),
      });
      return (await response.json()) as AddressResponse;
    } catch (err) {
      const error = err as Error;
      loggerService
        .error({ path: "/address/request", message: error.message })
        .flush();
      throw error;
    }
  }

  /**
   * Get the city name by zip code.
   * @param zipcode - The zip code to look up.
   * @returns The city name associated with the provided zip code.
   */
  public async getCityByZip(zipcode: string): Promise<string> {
    if (!zipcode || typeof zipcode !== "string") {
      throw new Error("Invalid zip code provided.");
    }

    try {
      const response = await fetch(AddressService.fetchUrl, {
        method: "POST",
        body: JSON.stringify({ zipcode }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch city for the provided zip code.");
      }

      const data = (await response.json()) as { city: string }[];
      if (data.length === 0) {
        throw new Error("No city found for the provided zip code.");
      }

      return data[0].city;
    } catch (err) {
      const error = err as Error;
      loggerService
        .error({ path: "/address/getCityByZip", message: error.message })
        .flush();
      throw error;
    }
  }

  /**
   * Calculate the distance between two locations.
   * @param addressRequest - The request object containing location1 and location2.
   *
   * The body request should contain:
   * - location1: The first location object. (Can mix and match any of the following properties)
   * > - zipcode: The zipcode of the location.
   * > - number: The number of the location.
   * > - street: The street of the location.
   * > - street2: The second street of the location.
   * > - city: The city of the location.
   * > - state: The state of the location.
   * > - country: The country of the location.
   * - location2: The second location object.
   * > - Same properties as location1
   * - unit: The unit of measurement for the distance (KM or Mi).
   *
   * @returns The distance between the two locations in the specified unit (KM or Mi).
   *
   */
  public async distance(
    addressRequest?: AddressRequest
  ): Promise<{ distance: number }> {
    try {
      const response = await this.request(addressRequest);
      const locations = response as unknown as Location[];

      if (!locations || !Array.isArray(locations) || locations.length < 2) {
        throw new Error(
          "At least two locations are required to calculate distance."
        );
      }

      const requiredProperties = ["latitude", "longitude"];
      const hasRequiredProperties = (location: Location): boolean =>
        requiredProperties.every((prop) =>
          Object.prototype.hasOwnProperty.call(location, prop)
        );

      if (!locations.every(hasRequiredProperties)) {
        throw new Error(
          "Each location must have latitude and longitude properties."
        );
      }

      const averageCoordinates1 = await this.calculateAverageCoordinates(
        locations[0]
      );
      const averageCoordinates2 = await this.calculateAverageCoordinates(
        locations[1]
      );

      const distanceInKm = await this.getKilometerDistance(
        averageCoordinates1.latitude,
        averageCoordinates1.longitude,
        averageCoordinates2.latitude,
        averageCoordinates2.longitude
      );

      return { distance: distanceInKm };
    } catch (err) {
      const error = err as Error;
      loggerService
        .error({ path: "/address/distance", message: error.message })
        .flush();
      throw error;
    }
  }

  private async getKilometerDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<number> {
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private async getMilesDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): Promise<number> {
    const kmDistance = await this.getKilometerDistance(lat1, lon1, lat2, lon2);
    return kmDistance * 0.621371;
  }

  private async calculateAverageCoordinates(
    location: Location
  ): Promise<{ latitude: number; longitude: number }> {
    if (!location || typeof location !== "object") {
      throw new Error("Invalid location object provided.");
    }

    const latitude = Number(location.latitude);
    const longitude = Number(location.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error("Invalid latitude or longitude values.");
    }

    return { latitude, longitude };
  }
}

export default new AddressService();
