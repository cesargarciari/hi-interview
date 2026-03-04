from sqlalchemy.orm import Session

from server.business.client.schema import PClient
from server.data.models.client import Client


def create_client(
    session: Session,
    first_name: str,
    last_name: str,
    email: str,
    assigned_user_id: str,
) -> PClient:
    client = Client(
        first_name=first_name,
        last_name=last_name,
        email=email,
        assigned_user_id=assigned_user_id,
    )
    session.add(client)
    session.commit()
    session.refresh(client)
    return PClient.model_validate(client)
