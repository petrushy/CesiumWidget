# -*- coding: utf-8 -*-

# -*- coding: utf-8 -*-

from ipywidgets import DOMWidget
from traitlets import Int, Unicode, Bool, CaselessStrEnum, Enum, List, Float

class CesiumWidget(DOMWidget):
    # the name of the Backbone.View subclass to be used
    _view_name = Unicode('CesiumView', sync=True)
    _view_module = Unicode('nbextensions/CesiumWidget/cesium_widget', sync=True)

    czml = Unicode(sync=True)
    kml_url = Unicode(sync=True)
    geojson = Unicode(sync=True)
    _zoomto = List(sync=True, trait=Float)
    _flyto = List(sync=True, trait=Float)
    _zoomtoregion = List(sync=True, trait=Float, allow_none=True)
    pick = Unicode(sync=True)
    billboard = Unicode(sync=True)
    
    animation = Bool(True, sync=True)
    base_layer_picker = Bool(True, sync=True)
    geocoder = Bool(True, sync=True)
    home_button = Bool(True, sync=True)
    infobox = Bool(True, sync=True)
    scene_mode_picker = Bool(True, sync=True)
    selection_indicator = Bool(True, sync=True)
    timeline = Bool(True, sync=True)
    navigation_help_button = Bool(True, sync=True)
    navigation_instructions_initially_visible = Bool(False, sync=True)
    scene_3D_only = Bool(False, sync=True)
    scene_mode = CaselessStrEnum(['COLUMBUS_VIEW', 'SCENE2D', 'SCENE3D'], default_value='SCENE3D',
                                 allow_none=False, sync=True)
    enable_lighting = Bool(False, sync=True)
    
    def zoom_to(self, lon, lat, alt, heading=0, pitch=-90, roll=0):
        self._zoomto = [lon, lat, alt, heading, pitch, roll]

    def fly_to(self, lon, lat, alt, heading=0, pitch=-90, roll=0):
        self._flyto = [lon, lat, alt, heading, pitch, roll]

    def zoom_to_region(self, lon1, lat1, lon2, lat2):
        self._zoomtoregion = [lon1, lat2, lon2, lat2]



