interface Person {
    id: number
    first_name: string
    family_name: string
    street: string
    street_number: string
    city: string
    zip_code: string,
}

export interface Child extends Person {
    required_qualification: string
    requested_hours: number
}

export type TChildImport = {
    children: Child[]
}

export interface Assistant extends Person {
    qualification: string,
    capacity: number,
}

