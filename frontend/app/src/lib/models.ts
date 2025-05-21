export interface Child {
    id: number
    first_name: string
    family_name: string
    required_qualification: string
    street: string
    street_number: string
    city: string
    zip_code: string
    requested_hours: number
}

export type TChildImport = {
    dataCols?: string[]
    dataRows: Child[]
}
