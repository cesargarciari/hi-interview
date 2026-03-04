export interface Note {
    id: string;
    content: string;
    client_id: string;
    created_by_id: string;
    created_by_email: string;
    created_at: string;
}

export interface CreateNoteRequest {
    content: string;
}
