import json

from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import TemplateView

from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from ces.custom_permission import IsEmailVerified
from rest_framework.permissions import IsAuthenticated
from oauth2_provider.contrib.rest_framework import OAuth2Authentication
from ces import error_conf
from user_auth import system_error
from user_auth import utils
from user_auth.models import User
from user_auth.serializers import (
    UserSerializer,
    UserDisplaySerializer
)
import requests
from django.template import loader, Context
from django.shortcuts import render_to_response


class CreateUserView(CreateAPIView):
    """
    Creating API for User creation which takes user
    details(email, password, confirm_password, first_name
    last_name, phone_number) as input validates the user details and
    creates a user account.
    """
    model = User
    serializer_class = UserSerializer

    def post(self, request):

        user_data = request.data

        error_checks = system_error.check_for_registration_input_error(user_data)
        if error_checks:
            return Response(error_checks,
                            status=status.HTTP_412_PRECONDITION_FAILED)

        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            user = serializer.save()

            userprofile = user.userprofile
            userprofile.phone_number =  user_data.get("number", "")
            userprofile.save()
            token = utils.generate_oauth_token(
                self, user.email,
                user_data.get('confirm_password'))

            if token.status_code != 200:
                return Response({'msg': 'Username or password is incorrect'},
                                status=status.HTTP_412_PRECONDITION_FAILED)

            return Response({
                'success': True,
                'msg': 'Registration Successfully',
                'token': json.loads(token._content)})

        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    Creating API for User Authentication
    Based On roles and UserName and Passwords

    Note:-
    Checks whether the request is from audetemi user
    by checking the provider name in UserSocialDetails
    Table and if that entry is primary.
    """

    def post(self, request, format=None):
        """
        Return a Valid token if username and password
        is valid for a given client
        """

        if request.data:
            data = request.data
            # error_checks = system_error.check_for_login_input_error(data)

            # if (error_checks and error_checks.get('error_code') != 7):
            #     return Response(error_checks,
            #                     status=status.HTTP_412_PRECONDITION_FAILED)

            email = data.get('email')
            password = data.get('password')

            user = User.objects.get(email=email)

            login_success_data = utils.generate_oauth_token(self, email, password)
            if login_success_data.status_code != 200:
                return Response(error_conf.INVALID_PASSWORD,
                                status=status.HTTP_412_PRECONDITION_FAILED)

            responce_dict = json.loads(login_success_data._content)

            responce_dict['is_email_verified'] = True

            serilizer = UserDisplaySerializer(user)
            return HttpResponse(json.dumps({'user_details': serilizer.data,
                                 'token_details': responce_dict}),
                                content_type='application/json')
        return HttpResponse(status=status.HTTP_412_PRECONDITION_FAILED)


def login(request):
    data = request.POST.dict()
    headers = {
        'content-type': 'application/json'
    }
    login_status = requests.post("http://" + request.get_host() + "/api/user/login/",
        data=json.dumps(data),
        headers=headers)

    if login_status.status_code == 200:

        return render_to_response('index.html', {
            'foo': 'bar',
            })

    return render_to_response('loginfailure.html')


class UserUpdatePassword(APIView):
    """
    API Used For Updating User Password:
    @i/p user_id, current password, new_password
    @o/p success or failure messgaes
    """
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def post(self, request, format=None):

        error_checks = system_error.check_for_update_password_input_error(request)
        if error_checks:
            return Response(error_checks,
                            status=status.HTTP_412_PRECONDITION_FAILED)

        data = request.data
        new_password = data.get('new_password')

        user_obj = request.user
        user_obj.set_password(new_password)
        user_obj.save()

        # This try block as for test cases we will
        # not be having access token attach to request

        try:
            revoke_msg = helper.revoke_current_token(request)
        except:
            pass

        token = helper.generate_oauth_token(
            self, user_obj.username,
            new_password)

        if token.status_code != 200:
            return Response(error_conf.INVALID_PASSWORD,
                            status=status.HTTP_412_PRECONDITION_FAILED)
        return Response({
            'success': True,
            'msg': 'Password Updated Successfully',
            'token': json.loads(token._content)})


class UserLogout(APIView):
    def post(self, request, *args, **kwargs):
        client_id = settings.CLIENT_ID
        client_secret = settings.CLIENT_SECRET

        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        payload = {'token': request.META['HTTP_AUTHORIZATION'][7:],
                   'token_type_hint': 'access_token',
                   'client_id': client_id,
                   'client_secret': client_secret}

        host = self.request.get_host()
        return HttpResponse(requests.post(
                'http://localhost:80' + "/o/revoke_token/",
                data=payload,
                headers=headers))
