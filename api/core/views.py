from rest_framework import generics

from .models import Genre, Track
from .serializers import GenreSerializer, TrackSerializer


class GenreView(generics.ListAPIView):
    """
    API endpoint that allows users to be viewed.
    """
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer


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
        return queryset.order_by('album')
