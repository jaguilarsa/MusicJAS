from django.db.models import Avg
from django.db.models import Max
from django.db.models import Min
from rest_framework import generics, views
from rest_framework.response import Response

from .models import Genre, Track
from .serializers import GenreSerializer, TrackSerializer


class GenreView(generics.ListAPIView):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    pagination_class = None


class TrackView(generics.ListAPIView):
    """
    API endpoint that allows users to be view with filter, pagination and sort.
    """
    queryset = Track.objects.all()
    serializer_class = TrackSerializer

    def get_queryset(self):
        queryset = Track.objects.all()
        genre = self.request.query_params.get('genre', None)
        if genre is not None:
            queryset = queryset.filter(genre=genre)
        return queryset.order_by('album__artist__name')


class AverageView(views.APIView):
    """
    API endpoint that allows users to be view artist track duration average by genre without pagination for make charts
    with it.
    """

    @staticmethod
    def get(request):
        queryset = Track.objects.all()
        genre = request.query_params.get('genre', None)
        if genre is not None:
            queryset = queryset.filter(genre=genre)

        return Response(queryset.values_list('album__artist__name')
                        .annotate(duration__avg=Avg('duration'))
                        .values('album__artist__name', 'duration__avg', 'duration__min', 'duration__max')
                        .order_by('album__artist__name'))
