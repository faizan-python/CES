from django.contrib import admin

from sites.models import (
    Site,
    UserSites
)

admin.site.register(Site)
admin.site.register(UserSites)
