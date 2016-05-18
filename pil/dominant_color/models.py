# -*- coding: utf-8 -*-
from django.db import models
from mezzanine.core.fields import FileField, RichTextField
from mezzanine.pages.models import Page, RichText, Displayable
from mezzanine.utils.models import AdminThumbMixin, upload_to

from colorfield.fields import ColorField
from common.utils.dominant_color import get_dominant_color


class Store(Displayable, AdminThumbMixin):
    logo = FileField(
        verbose_name=u"Logo",
        upload_to=upload_to("megastore.Store.logo", "store"),
        format="Image", max_length=255, null=True, blank=True
    )
    categories = models.ManyToManyField(
        "Category", verbose_name=u"Category", blank=True, null=True
    )

    class Meta:
        ordering = ["title", "-ordering"]
        verbose_name = u"Store"
        verbose_name_plural = u"Stores"


class Category(Page, RichText):
    ico = FileField(
        verbose_name=u"Icon",
        upload_to=upload_to("megastore.Category.ico", "category"),
        format="Image", max_length=255, null=True, blank=True
    )

    color = ColorField(verbose_name=u'Color', blank=True)
    stores = models.ManyToManyField(
        'Store', blank=True, null=True, through=Store.categories.through
    )

    class Meta:
        verbose_name = u'Category'
        verbose_name_plural = u'Categories'

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        self.color = (
            get_dominant_color(self.ico.path)
            if self.ico else "#ffffff"
        )
        super(Category, self).save(force_insert, force_update, using)
