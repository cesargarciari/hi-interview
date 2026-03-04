from datetime import datetime

from server.shared.pydantic import BaseModel


class PClient(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    assigned_user_id: str | None
    created_at: datetime
    updated_at: datetime


class PNote(BaseModel):
    id: str
    content: str
    client_id: str
    created_by_id: str
    created_by_email: str
    created_at: datetime


class PCreateNoteRequest(BaseModel):
    content: str
