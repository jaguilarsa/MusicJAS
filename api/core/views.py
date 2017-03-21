from django.db.models import Avg
from django_filters import FilterSet, NumberFilter, CharFilter
from django_filters.rest_framework import DjangoFilterBackend
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


class TrackFilter(FilterSet):
    min_duration = NumberFilter(name="duration", lookup_expr='gte')
    max_duration = NumberFilter(name="duration", lookup_expr='lte')
    genre = NumberFilter(name='genre')
    artist = NumberFilter(name='album__artist__1d')
    album = NumberFilter(name='album__id')
    artist__name = CharFilter(name='album__artist__name')

    class Meta:
        model = Track
        fields = ['genre', 'artist', 'artist__name', 'album', 'min_duration', 'max_duration']


class TrackView(generics.ListAPIView):
    """
    API endpoint that allows users to be view with filter, pagination and ordering.
    """
    serializer_class = TrackSerializer
    filter_backends = (DjangoFilterBackend,)
    filter_class = TrackFilter

    def get_queryset(self):
        queryset = Track.objects.all()
        ordering = self.request.query_params.get('ordering', None)
        if ordering in ['album', 'album__artist', 'genre']:
            queryset = queryset.order_by(ordering)
        return queryset


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
                        .values('album__artist__name', 'duration__avg')
                        .order_by('album__artist__name'))
