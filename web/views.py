import requests
import logging

from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View

from rest_framework.views import APIView
from rest_framework.response import Response


class AgentLogin(View):
    template = 'WebApp/app/index.html'

    def get(self, request):
        return render(request, self.template)
