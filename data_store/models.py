import datetime

from mongoengine import *

connect("ces", host='localhost', port=27017)


class Measurements(Document):
    """
    Class For storing Param Information
    """
    param1LifeTime = StringField()
    param2Instantaneous = StringField()
    param3Site = StringField()
    eventDate = DateTimeField(default=datetime.datetime.now)


class InervalMeasurements(Document):
    """
    Class For storing Param Information
    """
    param1LifeTime = StringField()
    param2DifferentialInterval = StringField()
    param3Site = StringField()
    eventDate = DateTimeField(default=datetime.datetime.now)
