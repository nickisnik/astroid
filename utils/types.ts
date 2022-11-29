type Asteroid = {
    links : {
        self: string
    },
    id: string,
    name: string,
    estimated_diameter: {
        kilometers: {
            estimated_diameter_max: number,
            estimated_diameter_min: number
        }
    },
    is_potentially_hazardous_asteroid : boolean,
    is_sentry_object: boolean,
    close_approach_data: ApproachData[]
}
type ApproachData = {
    close_approach_date: string
}
type Response = {
    element_count : number,
    near_earth_objects: Date[]
}
export interface Date {
    [key: string] : Asteroid[]
}
export type {Asteroid, Response}