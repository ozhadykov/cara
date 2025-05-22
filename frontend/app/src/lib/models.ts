interface Person {
    id: number
    first_name: string
    family_name: string
    street: string
    street_number: string
    city: string
    zip_code: string,
    time_start: string,
    time_end: string
}

export interface Child extends Person {
    required_qualification: string
    requested_hours: number
}

export type TChildImport = {
    dataCols?: string[]
    dataRows: Child[]
}

export interface Assistant extends Person {
    qualification: string,
    capacity: number,
}

