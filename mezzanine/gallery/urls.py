# -*- coding: utf-8 -*-

from django.conf.urls import *
from django.contrib import admin
from django.views import generic as generic_views


urlpatterns = patterns(
    'gallery.views',
    url(r'^get_all_gallery/$', 'ajax_get_list_gallery', name='ajax_get_list_gallery'),
    url(r'^ajax/get_gallery/(?P<gallery_id>\d+)$', 'ajax_get_gallery', name='ajax_get_gallery'),
)
