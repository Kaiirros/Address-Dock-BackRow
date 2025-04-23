import { get } from "http";
import loggerService from "./logger.service";

class AddressService {
    private static fetchUrl = 'https://ischool.gccis.rit.edu/addresses/';

    constructor() { }

    public async count(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            this.request(addressRequest)
                .then((response) => {
                    resolve({
                        "count": response.length
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    public async request(addressRequest?: any): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            fetch(AddressService.fetchUrl, {
                method: "POST",
                body: JSON.stringify(addressRequest.body)
            })
                .then(async (response) => {
                    resolve(await response.json());
                })
                .catch((err) => {
                    loggerService.error({ path: "/address/request", message: `${(err as Error).message}` }).flush();
                    reject(err);
                });
        });
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
    public async distance(addressRequest?: any): Promise<any> {

        if (addressRequest.body) {
            try {
                let location1 = addressRequest.body.location1;
                let location2 = addressRequest.body.location2;

                // Check if both locations are provided
                if (!location1 || !location2) {
                    const errMessage = "Please provide both locations.";
                    loggerService.error({ path: "/address/distance", message: errMessage }).flush();
                    return { error: errMessage };
                }

                // Check if the locations are valid
                const requiredProperties = [
                    "zipcode", "number", "street", "street2", 
                    "city", "state", "country"
                ];

                const hasRequiredProperties = (location: any) => 
                    requiredProperties.some(prop => location.hasOwnProperty(prop));

                if (
                    typeof location1 !== "object" || 
                    typeof location2 !== "object" || 
                    !hasRequiredProperties(location1) || 
                    !hasRequiredProperties(location2)
                ) {
                    const errMessage = "Invalid locations. Please ensure both locations have at least one required property. Required properties: " + requiredProperties.join(", ");
                    loggerService.error({ path: "/address/distance", message: errMessage }).flush();
                    return { error: errMessage };
                }

                location1 = await this.request({ body:  location1  });
                location2 = await this.request({ body:  location2  });

                // Check if the locations are valid
                if (location1.length == 0 || location2.length == 0) {
                    const errMessage = "Invalid locations. Please ensure both locations are valid.";
                    loggerService.error({ path: "/address/distance", message: errMessage }).flush();
                    return { error: errMessage };
                }
                
                let averageCoordinates1 = await this.calculateAverageCoordinates(location1);
                let averageCoordinates2 = await this.calculateAverageCoordinates(location2);
                

                if (!averageCoordinates1 || !averageCoordinates2) {
                    const errMessage = "Invalid locations. Please ensure both locations are valid."
                    loggerService.error({ path: "/address/distance", message: errMessage }).flush();
                    return { error: errMessage };
                }

                if (addressRequest.body.unit === "KM") {
                    
                    const distance = await this.getKilometerDistance(averageCoordinates1.latitude, averageCoordinates1.longitude, averageCoordinates2.latitude, averageCoordinates2.longitude);
                    return { distance: distance };

                } else if (addressRequest.body.unit === "Mi") {
                    const distance = await this.getMilesDistance(averageCoordinates1.latitude, averageCoordinates1.longitude, averageCoordinates2.latitude, averageCoordinates2.longitude);
                    return { distance: distance };

                } else {
                    const errMessage = "Invalid unit. Please use 'KM' or 'Mi'."
                    loggerService.error({ path: "/address/distance", message: errMessage }).flush();
                    return { error: errMessage };
                }


            } catch (err) {
                loggerService.error({ path: "/address/distance", message: `${(err as Error).message}` }).flush();
                return { error: (err as Error).message };
            }
        }

        try {



        } catch (err) {
            const errorMessage = (err as Error).message;
            loggerService.error({ path: "/address/distance", message: errorMessage }).flush();
            return { error: errorMessage };
        }
    }

    private async getKilometerDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        // Defining this function inside of this private method means it's
        // not accessible outside of it, which is perfect for encapsulation.
        const toRadians = (degrees: number) => {
            return degrees * (Math.PI / 180);
        }

        // Radius of the Earth in KM
        const R = 6371;

        // Convert Lat and Longs to Radians
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        // Haversine Formula to calculate the distance between two locations
        // on a sphere.
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
             // convert and return distance in KM
            return (R * c);
    }

    private async getMilesDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const kilometers = await this.getKilometerDistance(lat1, lon1, lat2, lon2);
        const milesPerKilometer = 0.621371;
        return (kilometers * milesPerKilometer);
    }

    private async calculateAverageCoordinates(location: any) {
        if (!location || !Array.isArray(location) || location.length === 0) {
            const errMessage = "Invalid location data. Please provide a valid array of locations.";
            loggerService.error({ path: "/address/calculateAverageCoordinates", message: errMessage }).flush();
            throw new Error(errMessage);
        }

        const totalCoordinates = location.reduce(
            (totals, loc) => {
            const latitude = parseFloat(loc.latitude);
            const longitude = parseFloat(loc.longitude);

            if (isNaN(latitude) || isNaN(longitude)) {
                const errMessage = "Invalid latitude or longitude in location data.";
                loggerService.error({ path: "/address/calculateAverageCoordinates", message: errMessage }).flush();
                throw new Error(errMessage);
            }

            totals.latitude += latitude;
            totals.longitude += longitude;
            return totals;
            },
            { latitude: 0, longitude: 0 }
        );

        const averageCoordinates = {
            latitude: totalCoordinates.latitude / location.length,
            longitude: totalCoordinates.longitude / location.length
        };

        return averageCoordinates;
    }

    public async city_count(addressRequest?: any): Promise<any> {
        if(addressRequest.body) {
            try {
                const { city } = addressRequest.body;

                // validate input
                if (!city) {
                    const errMessage = "Please provide a valid city.";
                    loggerService.error({ path: "/address/city-count", message: errMessage }).flush();
                    return { error: errMessage };
                }
    
                //fetch all addresses with this city name
                const res = await this.request({ body: { city } });
                // if (res.length === 0) {
                //     const errMessage = `No states found for the city: ${city}.`;
                //     loggerService.error({ path: "/address/city-count", message: errMessage }).flush();
                //     return { error: errMessage };
                // }
    
                // extract uniqie states / provinces
                const states = [...new Set(res.map((address: any) => address.state))];
                
                //return list of states
                return { states };
            } catch (err) {
                loggerService.error({ path: "/address/city-count", message: `${(err as Error).message}` }).flush();
                return { error: (err as Error).message };
            }
        } 
    }

}

export default new AddressService();