from django import template

from common.utils.dominant_color import image_to_dominant_color_create

register = template.Library()


@register.filter
def logo_to_dominant_color(file_):
    return image_to_dominant_color_create(file_)
