from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.utils.db import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.user import UserOut, UserUpdate

router = APIRouter(prefix="/api/user", tags=["users"])


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/update", response_model=UserOut)
async def update_user(
        user_data: UserUpdate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    # Check if email is being updated and if it already exists
    if user_data.email and user_data.email != current_user.email:
        db_user = db.query(User).filter(User.email == user_data.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Update user fields
    if user_data.name:
        current_user.name = user_data.name
    if user_data.email:
        current_user.email = user_data.email
    if user_data.phone_number:
        current_user.phone_number = user_data.phone_number
    if user_data.address:
        current_user.address = user_data.address

    db.commit()
    db.refresh(current_user)

    return current_user