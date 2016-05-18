# -*- coding: utf-8 -*-
import json

from django.http import Http404
from django.core.serializers.json import DjangoJSONEncoder
from django.shortcuts import (
    HttpResponse, redirect, render_to_response, RequestContext
)
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required

from sorl.thumbnail import get_thumbnail
from photologue.models import Gallery


@login_required
def ajax_get_list_gallery(request):
    json_data = dict(succes=False, gallery=[])
    for gallery in Gallery.objects.all():
        try:
            im = get_thumbnail(
                gallery.public()[0].image,
                '100x100', crop='center', quality=99
            )
            data = dict(
                title=gallery.title,
                id=gallery.id,
                tags=gallery.tags,
                created=gallery.date_added,
                cover=im.url
            )
        except (IndexError, AttributeError):
            pass
        else:
            json_data['gallery'].append(data)
            json_data['success'] = True

    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))


def ajax_get_gallery(request, gallery_id):
    json_data = {
        'success': False,
        "photos": [],
    }
    try:
        gallery = Gallery.objects.get(pk=gallery_id)
    except Gallery.DoesNotExist:
        raise Http404

    for photo in gallery.photos.all():
        im = get_thumbnail(photo.image, '1000', crop='center', quality=99)
        if photo.caption:
            json_data['photos'].append(
                {'image': im.url, 'caption': photo.caption}
            )
        else:
            json_data['photos'].append({'image': im.url})

    json_data['success'] = True
    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))
