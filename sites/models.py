from enum import Enum

from user_auth.models import User
from django.db import models


class Site(models.Model):

    """
    UserProfile model
    """

    class Status(Enum):

        """
        This class creates enum for Status.
        """

        ACTIVE = 'Active'
        PROPOSED = 'Proposed'
        INACTIVE = 'Inactive'

        @classmethod
        def as_tuple(cls):
            return ((item.value, item.name.replace('_', ' ')) for item in cls)

    name = models.CharField(blank=True, null=True, max_length=50)
    web_address = models.CharField(blank=True, null=True, max_length=50)
    email = models.CharField(blank=True, null=True, max_length=50)
    hosted_platform = models.CharField(blank=True, null=True, max_length=50)
    site_type = models.CharField(blank=True, null=True, max_length=50)
    description = models.TextField(blank=True, null=True)
    state = models.CharField(blank=True, null=True, max_length=50)
    city = models.CharField(blank=True, null=True, max_length=120)
    status = models.CharField(blank=True, null=True,  max_length=20,
                              choices=Status.as_tuple(),
                              default=Status.PROPOSED.value)
    address = models.TextField(blank=True, null=True)
    contact_number = models.CharField(blank=True, null=True, max_length=50)
    is_active = models.BooleanField(default=True)
    pin_code = models.CharField(blank=True, null=True, max_length=120)
    reported_by = models.ForeignKey(User)
    reported_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    hosted_date = models.DateTimeField(blank=True, null=True)

    def __unicode__(self):
        return self.name


###############################################################################
# User Site Access
###############################################################################
class UserSites(models.Model):
    user = models.OneToOneField(User, blank=True)
    site = models.ManyToManyField(Site, blank=True)

    def __unicode__(self):
        return self.user.first_name
