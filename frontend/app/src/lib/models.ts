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
    required_qualification_value: number
    required_qualification_text?: string
    requested_hours: number
}

export interface Assistant extends Person {
    qualification: number
    qualification_value: number
    qualification_text?: string
    min_capacity: number
    max_capacity: number
    has_car: boolean
}

export interface Pair {
    id: number
    child_id: number
    assistant_id: number
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
