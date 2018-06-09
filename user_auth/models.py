from datetime import timedelta
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from django.db import models

from django.utils import timezone
from enum import Enum


class UserManager(BaseUserManager):
    """
    Creating UserManager class from BaseUserManager
    (overridding create_user and create_superuser)
    so that users can be created using email instead of
    user_name.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The given email address must be set')

        now = timezone.now()
        email = UserManager.normalize_email(email)
        user = self.model(email=email,
                          is_staff=False, is_active=True, is_superuser=False,
                          last_login=now, date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        superuser = self.create_user(email, password, **extra_fields)
        superuser.is_staff = True
        superuser.is_active = True
        superuser.is_superuser = True
        superuser.is_email_verified = True
        superuser.save(using=self._db)
        return superuser


class User(AbstractBaseUser, PermissionsMixin):
    """
    Creating custom user models using AbstractBaseUser.
    Adding custom fields (phone number) to the base user model.
    Implementing Validation on phone number.
    """

    class UserTypes(Enum):
        ADMIN = 'Admin'
        DEVELOPER = 'Developer'
        REVIEWER = 'Reviewer'

        @classmethod
        def as_tuple(cls):
            return ((item.value, item.name.replace('_', ' ')) for item in cls)

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=80, blank=True, null=True)
    last_name = models.CharField(max_length=80, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    username = models.CharField(max_length=50, blank=True, null=True)
    date_joined = models.DateTimeField(
        auto_now_add=True,
        null=False,
        editable=True,
    )

    role = models.CharField(
        null=True, max_length=50,
        choices=UserTypes.as_tuple(),
        default=UserTypes.DEVELOPER.value
    )

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def __unicode__(self):
        return self.email

    # Returns full name of user
    def get_full_name(self):
        return self.first_name + self.last_name

    def get_short_name(self):
        return self.first_name
