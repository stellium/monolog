export interface MonologSchema {
    file_path?: string
    line_number?: number
    message?: string
    error?: any
    error_code?: string
    severity?: 'severe' | 'moderate' | 'light' | 'ignore'
    status?: 'created' | 'transported' | 'read' | 'resolved'
    created_at?: Date
}

export interface MonologLogObject {
    message: string
    code: string

    // Defaults to localhost if non-domain related
    hostname?: string
    error?: any
    severity?: 'severe' | 'moderate' | 'light' | 'ignore'
    created_at?: Date
    debounce?: number
}
