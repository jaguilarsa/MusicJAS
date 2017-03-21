from django.conf.urls import url

from . import views

app_name = 'core'
urlpatterns = [
    url(r'^genre/$', views.GenreView.as_view()),
    url(r'^track/$', views.TrackView.as_view()),
    url(r'^avg/$', views.AverageView.as_view())
]
