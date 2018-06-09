from django.conf.urls import url

from rest_framework.urlpatterns import format_suffix_patterns

from user_auth import views


urlpatterns = [
    url(r'^user/register/$', views.CreateUserView.as_view(),
        name='create_user'),
    url(r'^user/login/$', views.LoginView.as_view(),
        name='user_login'),
    url(r'^portal/login/$', views.login,
        name='login'),
    url(r'^user/update-pwd/$', views.UserUpdatePassword.as_view(),
        name='update_pwd'),
    url(r'^log-out/$', views.UserLogout.as_view(), name='logout'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
