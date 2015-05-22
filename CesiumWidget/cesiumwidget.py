# -*- coding: utf-8 -*-

from IPython.html.widgets import DOMWidget
from IPython.utils.traitlets import Int, Unicode, Bool, CaselessStrEnum, Enum


class CesiumWidget(DOMWidget):
    # the name of the Backbone.View subclass to be used
    _view_name = Unicode('CesiumView', sync=True)
    _view_module = Unicode('nbextensions/CesiumWidget/cesium_widget', sync=True)
    # _view_style = Unicode('nbextensions/CesiumWidget/css/custom', sync=True)

    #width = Int(600, sync=True)
    #height = Int(600, sync=True)
    czml = Unicode(sync=True)
    kml_url = Unicode(sync=True)
    
    animation = Bool(True, sync=True)
    baseLayerPicker = Bool(True, sync=True)
    geocoder = Bool(True, sync=True)
    homeButton = Bool(True, sync=True)
    infoBox = Bool(True, sync=True)
    sceneModePicker = Bool(True, sync=True)
    selectionIndicator = Bool(True, sync=True)
    timeline = Bool(True, sync=True)
    navigationHelpButton = Bool(True, sync=True)
    navigationInstructionsInitiallyVisible = Bool(True, sync=True)
    scene3DOnly = Bool(False, sync=True)
    sceneMode = CaselessStrEnum(['COLUMBUS_VIEW','SCENE2D','SCENE3D'], default_value='SCENE3D', allow_none=False)
 


