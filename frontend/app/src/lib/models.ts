export interface Person {
    id: number
    first_name: string
    family_name: string
    street: string
    street_number: string
    city: string
    zip_code: string
}

export interface Child extends Person {
    required_qualification: number
    requested_hours: number
}

export interface Assistant extends Person {
    qualification: number
    min_capacity: number
    max_capacity: number
}

export type TPersonImport = {
    data: Child[] | Assistant[]
}

export type TChildImport = {
    children: Child[]
}

export type TAssistantImport = {
    assistants: Assistant[]
}
