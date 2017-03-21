from __future__ import unicode_literals

from django.db import models


class Artist(models.Model):
    id = models.IntegerField(db_column='ArtistId', primary_key=True)
    name = models.CharField(db_column='Name', max_length=256)

    class Meta:
        managed = False
        db_table = 'Artist'


class Album(models.Model):
    id = models.IntegerField(db_column='AlbumId', primary_key=True)
    name = models.CharField(db_column='Title', max_length=256)
    artist = models.ForeignKey(Artist, db_column='ArtistId')

    class Meta:
        managed = False
        db_table = 'Album'


class Genre(models.Model):
    id = models.IntegerField(db_column='GenreId', primary_key=True)
    name = models.CharField(db_column='Name', max_length=256)

    class Meta:
        managed = False
        db_table = 'Genre'


class Track(models.Model):
    id = models.IntegerField(db_column='TrackId', primary_key=True)
    name = models.CharField(db_column='Name', max_length=256)
    album = models.ForeignKey(Album, db_column='AlbumId')
    genre = models.ForeignKey(Genre, db_column='GenreId')
    duration = models.IntegerField(db_column='Milliseconds')

    class Meta:
        managed = False
        db_table = 'Track'
