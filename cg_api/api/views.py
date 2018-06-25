from django.shortcuts import render
from rest_framework import views, status
from rest_framework.response import Response
from .serializers import MessageSerializer, RegistrationSerializer, UserSerializer
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .renderers import UserJSONRenderer
import jwt
from django.conf import settings


class EchoView(views.APIView):
    def post(self, request, *args, **kwargs):
        serializer = MessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RegistrationAPIView(APIView):
    # Allow any user (authenticated or not) to hit this endpoint.
    permission_classes = (AllowAny,)
    renderer_classes = (UserJSONRenderer,)
    serializer_class = RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})

        # The create serializer, validate serializer, save serializer pattern
        # below is common and you will see it a lot throughout this course and
        # your own work later on. Get familiar with it.
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UserAPIView(APIView):
    # renderer_classes = (UserJSONRenderer,)
    serializer_class = UserSerializer

    def post(self, request):
        token = bytes(request.META.get('HTTP_AUTHORIZATION')[4:], 'utf-8')
        print(token)
        user = jwt.decode(token, settings.SECRET_KEY)

        # The create serializer, validate serializer, save serializer pattern
        # below is common and you will see it a lot throughout this course and
        # your own work later on. Get familiar with it.
        # serializer = self.serializer_class(data=user)
        # serializer.is_valid(raise_exception=True)
        # serializer.save()

        return Response(user, status=status.HTTP_201_CREATED)
