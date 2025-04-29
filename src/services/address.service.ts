import loggerService from "./logger.service";

interface AddressRequest {
  body?: {
    location1?: Location;
    location2?: Location;
    unit?: "KM" | "Mi";
    zipcode?: string;
    city?: string;
  };
}

interface Location {
  zipcode?: string;
  number?: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

class AddressService {
  private static fetchUrl = "https://ischool.gccis.rit.edu/addresses/";

  constructor() {}

  public async count(
    addressRequest?: AddressRequest
  ): Promise<{ count: number }> {
    const response = await this.request(addressRequest);
    return { count: response.length };
  }

  public async request(addressRequest?: AddressRequest): Promise<unknown[]> {
    try {
      const response = await fetch(AddressService.fetchUrl, {
        method: "POST",
        body: JSON.stringify(addressRequest?.body),
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      loggerService
        .error({
          path: "/address/request",
          message: `${(err as Error).message}`,
        })
        .flush();
      throw err;
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
      loggerService
        .error({
          path: "/address/getCityByZip",
          message: (err as Error).message,
        })
        .flush();
      throw err;
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
  ): Promise<{ distance?: number; error?: string }> {
    if (!addressRequest?.body) {
      return { error: "Invalid request body" };
    }

    try {
      const { location1, location2, unit } = addressRequest.body;

      if (!location1 || !location2) {
        const errMessage = "Please provide both locations.";
        loggerService
          .error({ path: "/address/distance", message: errMessage })
          .flush();
        return { error: errMessage };
      }

      const requiredProperties = [
        "zipcode",
        "number",
        "street",
        "street2",
        "city",
        "state",
        "country",
      ];

      const hasRequiredProperties = (location: Location): boolean =>
        requiredProperties.some((prop) => prop in location);

      if (
        typeof location1 !== "object" ||
        typeof location2 !== "object" ||
        !hasRequiredProperties(location1) ||
        !hasRequiredProperties(location2)
      ) {
        const errMessage =
          "Invalid locations. Please ensure both locations have at least one required property. Required properties: " +
          requiredProperties.join(", ");
        loggerService
          .error({ path: "/address/distance", message: errMessage })
          .flush();
        return { error: errMessage };
      }

      const [response1, response2] = await Promise.all([
        this.request({ body: location1 }),
        this.request({ body: location2 }),
      ]);

      if (response1.length === 0 || response2.length === 0) {
        const errMessage =
          "Invalid locations. Please ensure both locations are valid.";
        loggerService
          .error({ path: "/address/distance", message: errMessage })
          .flush();
        return { error: errMessage };
      }

      const [averageCoordinates1, averageCoordinates2] = await Promise.all([
        this.calculateAverageCoordinates(response1),
        this.calculateAverageCoordinates(response2),
      ]);

      if (!averageCoordinates1 || !averageCoordinates2) {
        const errMessage =
          "Invalid locations. Please ensure both locations are valid.";
        loggerService
          .error({ path: "/address/distance", message: errMessage })
          .flush();
        return { error: errMessage };
      }

      if (unit === "KM") {
        const distance = await this.getKilometerDistance(
          averageCoordinates1.latitude,
          averageCoordinates1.longitude,
          averageCoordinates2.latitude,
          averageCoordinates2.longitude
        );
        return { distance };
      } else if (unit === "Mi") {
        const distance = await this.getMilesDistance(
          averageCoordinates1.latitude,
          averageCoordinates1.longitude,
          averageCoordinates2.latitude,
          averageCoordinates2.longitude
        );
        return { distance };
      } else {
        const errMessage = "Invalid unit. Please use 'KM' or 'Mi'.";
        loggerService
          .error({ path: "/address/distance", message: errMessage })
          .flush();
        return { error: errMessage };
      }
    } catch (err) {
      loggerService
        .error({
          path: "/address/distance",
          message: `${(err as Error).message}`,
        })
        .flush();
      return { error: (err as Error).message };
    }
  }

  private getKilometerDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in KM

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
    const kilometers = this.getKilometerDistance(lat1, lon1, lat2, lon2);
    const milesPerKilometer = 0.621371;
    return kilometers * milesPerKilometer;
  }

  private async calculateAverageCoordinates(
    location: unknown[]
  ): Promise<Coordinates> {
    if (!location || !Array.isArray(location) || location.length === 0) {
      const errMessage =
        "Invalid location data. Please provide a valid array of locations.";
      loggerService
        .error({
          path: "/address/calculateAverageCoordinates",
          message: errMessage,
        })
        .flush();
      throw new Error(errMessage);
    }

    const totalCoordinates = location.reduce<{
      latitude: number;
      longitude: number;
    }>(
      (totals, loc) => {
        const location = loc as { latitude: string; longitude: string };
        const latitude = parseFloat(location.latitude);
        const longitude = parseFloat(location.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          const errMessage = "Invalid latitude or longitude in location data.";
          loggerService
            .error({
              path: "/address/calculateAverageCoordinates",
              message: errMessage,
            })
            .flush();
          throw new Error(errMessage);
        }

        totals.latitude += latitude;
        totals.longitude += longitude;
        return totals;
      },
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: totalCoordinates.latitude / location.length,
      longitude: totalCoordinates.longitude / location.length,
    };
  }

  public async city_count(
    addressRequest?: AddressRequest
  ): Promise<{ states?: string[]; error?: string }> {
    if (!addressRequest?.body?.city) {
      return { error: "Please provide a valid city." };
    }

    try {
      const { city } = addressRequest.body;
      const response = await this.request({ body: { city } });

      if (response.length === 0) {
        return { error: `No states found for the city: ${city}.` };
      }

      const states = [
        ...new Set(
          response.map(
            (address: unknown) => (address as { state: string }).state
          )
        ),
      ];

      return { states };
    } catch (err) {
      loggerService
        .error({
          path: "/address/city-count",
          message: `${(err as Error).message}`,
        })
        .flush();
      return { error: (err as Error).message };
    }
  }
}

export default new AddressService();
