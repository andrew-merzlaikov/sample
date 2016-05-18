import random
from PIL import Image, ImageEnhance

from django.conf import settings as django_settings

from common.models import CircleFileCache


def reduce_opacity(im, opacity):
    """
    Reduce opacity
    :param im: Image object
    :param opacity: Need opacity
    :return: Image object
    """
    if im.mode != 'RGBA':
        im = im.convert('RGBA')
    else:
        im = im.copy()
    alpha = im.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    im.putalpha(alpha)
    return im


def watermark(im, mark, position, opacity=1):
    """
    In general image set mark
    :param im: general image
    :param mark: mark image
    :param position: where is set
    :param opacity: opacity
    :return: general image with mark
    """
    if opacity < 1:
        mark = reduce_opacity(mark, opacity)
    if im.mode != 'RGBA':
        im = im.convert('RGBA')

    ratio = min(float(1000) / im.size[0], float(1000) / im.size[1])
    w = int(im.size[0] * ratio)
    h = int(im.size[1] * ratio)
    im = im.resize((w, h))

    layer = Image.new('RGBA', im.size, (0, 0, 0, 0))

    if position == 'tile':
        for y in range(0, im.size[1], mark.size[1]):
            for x in range(0, im.size[0], mark.size[0]):
                layer.paste(mark, (x, y))
    elif position == 'scale':
        ratio = min(float(im.size[0]) / mark.size[0], float(im.size[1]) / mark.size[1])
        w = int(mark.size[0] * ratio)
        h = int(mark.size[1] * ratio)
        mark = mark.resize((w, h))
        layer.paste(mark, ((im.size[0] - w) / 2, (im.size[1] - h) / 2))
    elif position == 'bottom':
        layer.paste(mark, (im.size[0] - mark.size[0] - 20, im.size[1] - mark.size[1] - 20))
    else:
        layer.paste(mark, position)
    return Image.composite(layer, im, layer)


def create_cube_dominant_color(infile, outfile, numcolors=1):
    """
    Create cube image with fill in dominant color
    :param infile: input file
    :param outfile: output file
    :param numcolors: Controls the number of colors used for the palette
    when palette is ADAPTIVE
    :return: Save result in output file
    """
    image = Image.open(infile)
    size = image.size[1]
    if image.size[0] > image.size[1]:
        size = image.size[0]

    result = image.convert('P', palette=Image.ADAPTIVE, colors=numcolors)
    result.putalpha(0)
    colors = result.getcolors(size*size)
    count, color = colors[0]
    color_image = Image.new("RGB", (size, size), color)

    result = watermark(color_image, image, 'scale', 1)
    result.save(outfile, "PNG")
    del image
    del result


def image_to_dominant_color_create(file_):
    """
    Create image where background fill in dominant color
    :param file_: file
    :return: file fill dominant color
    """
    try:
        circle = CircleFileCache.objects.get(file=file_)
    except CircleFileCache.DoesNotExist:
        create_cube_dominant_color(
            django_settings.VAR_ROOT + file_, django_settings.VAR_ROOT + file_)

        circle = CircleFileCache()
        circle.file = file_
        circle.save()
    else:
        if CircleFileCache.objects.all().count() > 10000:
            CircleFileCache.objects.all().delete()
    return file_


def int_to_hex_color(v):
    r, g, b, a = v
    return '#%02x%02x%02x' % (r, g, b)


def get_dominant_color(file_):
    """
    Get dominant color in image
    :param file_: file image
    :return: HEX color #ffffff
    """
    image = Image.open(django_settings.MEDIA_ROOT + '/' + file_)
    size = image.size[1]
    if image.size[0] > image.size[1]:
        size = image.size[0]
    result = image.convert('P', palette=Image.ADAPTIVE, colors=1)
    result.putalpha(0)
    colors = result.getcolors(size*size)
    count, color = colors[0]
    return int_to_hex_color(color)
