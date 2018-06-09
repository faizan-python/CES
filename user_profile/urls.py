from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

from user_profile import views


urlpatterns = [
    url(r'^user/profile/update/$', views.UpdateUserProfileView.as_view(),
        name='create_user'),
    url(r'^user/profile/$', views.GetUserProfileView.as_view(),
        name='get_user'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
