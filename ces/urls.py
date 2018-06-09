"""ces URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from django.conf import settings
admin.site.site_header = settings.ADMIN_SITE_HEADER

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    url(r'^api/', include('user_auth.urls', namespace='user_auth')),
    url(r'^api/', include('user_profile.urls', namespace='user_profile')),
    url(r'^api/', include('sites.urls', namespace='sites')),
    url(r'^', include('web.urls', namespace='web')),
]
