from HTMLParser import HTMLParser
from htmlentitydefs import name2codepoint

from django.template.loader import get_template
from django.template import Context
from django import template

from photologue.models import Gallery
from bs4 import BeautifulSoup

register = template.Library()


class GalleryHTMLParser(HTMLParser):
    gallery_objects = list()

    def handle_starttag(self, tag, attrs):
        if tag == 'a' and ('class', 'specialGallery') in attrs:
            style_gallery = pk = text = None
            for style, value in attrs:
                if style == 'data-text':
                    text = value
                if style == 'data-pk':
                    pk = value
                if style == 'data-type':
                    style_gallery = value
            if style_gallery and pk:
                self.gallery_objects.append({
                    'style': style_gallery,
                    'pk': pk,
                    'text': text,
                    'raw_content': self.get_starttag_text(),
                })

    def get_gallery_data(self):
        return self.gallery_objects


def check_gallery_tag(tag):
    try:
        pk = tag['data-pk']
        type_gallery = tag['data-type']
    except KeyError:
        return False
    return True


@register.filter
def gallery_filter(content):
    soup = BeautifulSoup(content)
    html_other = None
    have_gallery_small_or_circle = False

    for tag in soup.find_all('a'):
        try:
            if 'specialGallery' in tag['class'] and check_gallery_tag(tag):
                try:
                    gallery = Gallery.objects.get(id=tag['data-pk'])
                except Gallery.DoesNotExist:
                    pass
                else:
                    is_one_photo = False
                    if gallery.public().count() <= 1:
                        is_one_photo = True
                    template_gallery = get_template(
                        'gallery/gallery_detail.html'
                    )
                    context = Context({
                        'gallery': gallery,
                        'is_one_photo': is_one_photo,
                        'type': tag['data-type'],
                        'text': tag['data-text'],
                    })
                    html_gallery = template_gallery.render(context)

                    if tag['data-type'] == 'small' or tag['data-type'] == 'circle':
                        have_gallery_small_or_circle = True
                        template_other = get_template('gallery/other.html')
                        html_other = template_other.render(context)

                    gallery_soup = BeautifulSoup(html_gallery)
                    tag.replace_with(gallery_soup)
        except KeyError:
            pass

    result_content = soup.decode()
    if have_gallery_small_or_circle and html_other:
        result_content = "%s %s" % (html_other, result_content)
    result_content = result_content.replace("[gallery]", '')
    result_content = result_content.replace("[/gallery]", '')

    return result_content