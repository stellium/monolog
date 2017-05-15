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
