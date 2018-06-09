from oauth2_provider.contrib.rest_framework import OAuth2Authentication
from rest_framework import status
from rest_framework.generics import (
    UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ces.custom_permission import IsEmailVerified
from user_auth.models import User
from user_profile.models import (
    UserProfile
)
from user_profile.serializers import (
    UserProfileSerializer
)
from ces import error_conf


##############################################################################
# Update UserProfile API.
##############################################################################
class UpdateUserProfileView(APIView):
    """
    Creating API for Updating user profile which takes input
    details(birthday, gender, role, profile_picture
    pref_industries, address, full_name) as input validates the user details
    and creates a user account.
    Note:- Works only on PATCH request.
    """
    queryset = UserProfile.objects.all()
    model = UserProfile
    serializer_class = UserProfileSerializer
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def patch(self, request, format=None):
        """
        """
        data = request.data
        user_profile = request.user.userprofile

        if data.get("new_password") and data.get("old_password"):
            if len(data.get("new_password")) < 8:
                return Response(error_conf.INSUFFICIENT_PASSWORD_LENGTH,
                                status=status.HTTP_412_PRECONDITION_FAILED)
            else:
                valid = request.user.check_password(data.get("old_password"))
                if vald:
                    request.user.set_password(data.get("new_password"))
                else:
                    return Response(error_conf.INVALID_PASSWORD,
                        status=status.HTTP_412_PRECONDITION_FAILED)

        if data.get('user'):
            user = request.user
            user.first_name = data.get('user', {}).get('first_name')
            user.save()
            del data['user']

        serializer = UserProfileSerializer(user_profile,
                                                 data=data,
                                                 partial=True)
        if serializer.is_valid():
            serializer.save()
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data,
                            status=status.HTTP_200_OK)
        return Response(serializer.errors,
                        status=status.HTTP_400_BAD_REQUEST)


##############################################################################
# Update UserProfile API.
##############################################################################
class GetUserProfileView(APIView):
    """
    Creating API for Updating user profile which takes input
    details(birthday, gender, role, profile_picture
    pref_industries, address, full_name) as input validates the user details
    and creates a user account.
    Note:- Works only on PATCH request.
    """
    queryset = UserProfile.objects.all()
    model = UserProfile
    serializer_class = UserProfileSerializer
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get(self, request, format=None):
        """
        """
        data = request.data
        user_profile = request.user.userprofile

        serializer = UserProfileSerializer(user_profile)
        return Response(serializer.data,
                        status=status.HTTP_200_OK)
