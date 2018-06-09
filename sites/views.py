import datetime
import json

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ces.custom_permission import IsEmailVerified
from rest_framework.permissions import IsAuthenticated
from oauth2_provider.contrib.rest_framework import OAuth2Authentication
from user_auth.models import User
from sites.serializers import (
    SiteSerializer
)
from sites.models import (
    Site,
    UserSites
)
from data_store.models import (
    Measurements,
    InervalMeasurements
)


class SiteListView(APIView):
    """
    API for Site
    """
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def get(self, request, format=None):

        user_data = UserSites.objects.filter(user=request.user)
        active_site_data = []
        inactive_site_data = []
        proposed_site_data = []

        if user_data:
            user_data = user_data[0]
            active_site_data = Site.objects.filter(id__in=user_data.site.all().values_list('id', flat=True),
                status=Site.Status.ACTIVE.value)
            inactive_site_data = Site.objects.filter(id__in=user_data.site.all().values_list('id', flat=True),
                status=Site.Status.INACTIVE.value)
            proposed_site_data = Site.objects.filter(id__in=user_data.site.all().values_list('id', flat=True),
                status=Site.Status.PROPOSED.value)

            active_site_data = SiteSerializer(active_site_data, many=True).data
            inactive_site_data = SiteSerializer(inactive_site_data, many=True).data
            proposed_site_data = SiteSerializer(proposed_site_data, many=True).data

        response_data = {
            "active_data": active_site_data,
            "inactive_data": inactive_site_data,
            "proposed_data": proposed_site_data,
        }

        return Response(response_data,
                        status=status.HTTP_200_OK)


class SiteDataView(APIView):
    """
    API for Site
    """
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, IsEmailVerified]

    def post(self, request, format=None):

        site_id = str(request.data.get("id", ""))

        interval_event_list = []
        incremental_event_list = []

        data_object = Measurements.objects.filter(
        param3Site=site_id,
        eventDate__gte=datetime.datetime.now().date())

        event_list = data_object.values_list('eventDate')
        increment_time = data_object.values_list('param1LifeTime')
        increment_time = map(str, increment_time)

        for data in event_list:
            incremental_event_list.append(str(data.time().hour) + ":" + str(data.time().minute))

        data_object = InervalMeasurements.objects.filter(
        param3Site=site_id,
        eventDate__gte=datetime.datetime.now().date())

        event_list = data_object.values_list('eventDate')
        interval_time = data_object.values_list('param1LifeTime')
        interval_time = map(str, interval_time)

        for data in event_list:
            interval_event_list.append(str(data.time().hour) + ":" + str(data.time().minute))

        response_data = {
            "instantaneous_xaxis": incremental_event_list,
            "instantaneous_yaxis": increment_time,
            "interval_xaxis": interval_event_list,
            "interva_yaxis": interval_time
        }

        return Response(response_data,
                        status=status.HTTP_200_OK)
