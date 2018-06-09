from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from web import views

urlpatterns = [

    url(r'^$',
        views.AgentLogin.as_view(), name='login'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
