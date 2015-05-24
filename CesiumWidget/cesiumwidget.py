# -*- coding: utf-8 -*-

from IPython.html.widgets import DOMWidget
from IPython.utils.traitlets import Int, Unicode, Bool, CaselessStrEnum, Enum


class CesiumWidget(DOMWidget):
    # the name of the Backbone.View subclass to be used
    _view_name = Unicode('CesiumView', sync=True)
    _view_module = Unicode('nbextensions/CesiumWidget/cesium_widget', sync=True)

    czml = Unicode(sync=True)
    kml_url = Unicode(sync=True)
    
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
    scene_mode = CaselessStrEnum(['COLUMBUS_VIEW','SCENE2D','SCENE3D'], default_value='SCENE3D', allow_none=False, sync=True)


