from enum import Enum

from user_auth.models import User
from django.db import models
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver


class UserProfile(models.Model):

    """
    UserProfile model
    """

    class Gender(Enum):

        """
        This class creates enum for gender field of UserProfile.
        """

        MALE = 'Male'
        FEMALE = 'Female'

        @classmethod
        def as_tuple(cls):
            return ((item.value, item.name.replace('_', ' ')) for item in cls)

    user = models.OneToOneField(User, primary_key=True)
    company = models.CharField(blank=True, null=True, max_length=50)
    state = models.CharField(blank=True, null=True, max_length=50)
    city = models.CharField(blank=True, null=True, max_length=120)
    address = models.TextField(blank=True, null=True)
    gender = models.CharField(blank=True, null=True,  max_length=20,
                              choices=Gender.as_tuple())
    address = models.TextField(blank=True, null=True)
    phone_number = models.CharField(blank=True, null=True, max_length=50)
    is_active = models.BooleanField(default=True)
    pin_code = models.CharField(blank=True, null=True, max_length=120)
    birth_date = models.DateTimeField(
        blank=True,
        null=True,
        editable=True,
    )

    def __unicode__(self):
        return self.user.email


@receiver(post_save, sender=User)
def create_profile_for_user(sender, instance=None,
                            created=False, **kwargs):
    """
    When a new user is created this fuctions creates a userprofile
    for that particular user.
    """
    if created:
        UserProfile.objects.create(user=instance)


@receiver(pre_delete, sender=User)
def delete_profile_for_user(sender, instance=None, **kwargs):
    """
    When a user is deleted this fuctions deletes the userprofile
    of that particular user.
    """
    if instance:
        user_profile = UserProfile.objects.get(user=instance)
        user_profile.delete()
