#!/usr/bin/env python

from models import *
from sites.models import Site
import random


def dump_interval_data(obj_id, number):
    measurement_object = InervalMeasurements(param1LifeTime=number,
                           param2DifferentialInterval="15",
                           param3Site=obj_id)
    measurement_object.save()
    return measurement_object


def generate_dump_for_sites():
    number = random.randint(0,99)
    site_obj = Site.objects.all()
    for obj in site_obj:
        dump_interval_data(str(obj.id), str(number))
    return True


if __name__ == '__main__':
    generate_dump_for_sites()
