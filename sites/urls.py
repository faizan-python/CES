from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

from sites import views


urlpatterns = [
    url(r'^site/list/$', views.SiteListView.as_view(),
        name='site_list'),
    url(r'^site/data/$', views.SiteDataView.as_view(),
        name='site_data'),
]
urlpatterns = format_suffix_patterns(urlpatterns)
