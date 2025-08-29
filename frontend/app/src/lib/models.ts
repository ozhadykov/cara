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
    required_qualification_value?: number
    required_qualification_text?: string
    requested_hours: number
}

export interface Assistant extends Person {
    qualification: number
    qualification_value?: number
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

export type PairInfo = {
    id: number

    // Child info
    c_id: number
    c_first_name: string
    c_family_name: string
    c_required_qualification: number
    c_required_qualification_text: string
    c_street: string
    c_street_number: string
    c_requested_hours: number
    c_city: string
    c_zip_code: string

    // Assistant info
    a_id: number
    a_first_name: string
    a_family_name: string
    a_qualification: number
    a_qualification_text: string
    a_has_car: boolean
    a_min_capacity: number
    a_max_capacity: number
    a_street: string
    a_street_number: string
    a_city: string
    a_zip_code: string
}
