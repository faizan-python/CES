from ces.non_null_serializer import BaseSerializer
from user_profile.models import UserProfile
from user_auth.serializers import UserDisplaySerializer


##############################################################################
# UserProfile Serializer
##############################################################################
class UserProfileSerializer(BaseSerializer):
    """
    Serializer for Updating User profile.
    This class excepts users profile details validates
    them and updates the profile.
    """

    user = UserDisplaySerializer()

    class Meta:
        model = UserProfile
        fields = '__all__'
