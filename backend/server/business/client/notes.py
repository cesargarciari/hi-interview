from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from server.business.client.schema import PNote
from server.data.models.note import Note


def list_notes(session: Session, client_id: str) -> list[PNote]:
    notes = session.execute(
        select(Note)
        .where(Note.client_id == client_id)
        .options(joinedload(Note.created_by))
        .order_by(Note.created_at.desc())
    ).scalars().all()
    return [PNote.model_validate(note) for note in notes]


def create_note(
    session: Session, client_id: str, content: str, created_by_id: str
) -> PNote:
    note = Note(client_id=client_id, content=content, created_by_id=created_by_id)
    session.add(note)
    session.commit()

    created = session.execute(
        select(Note)
        .where(Note.id == note.id)
        .options(joinedload(Note.created_by))
    ).scalar_one()
    return PNote.model_validate(created)
