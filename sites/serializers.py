from ces.non_null_serializer import BaseSerializer
from rest_framework import serializers

from sites.models import Site


class SiteSerializer(BaseSerializer):
    """
    Serializer for SIte.
    """
    class Meta:
        model = Site
        fields = '__all__'
