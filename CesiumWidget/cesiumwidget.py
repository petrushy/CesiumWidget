# -*- coding: utf-8 -*-

from IPython.html.widgets import DOMWidget
from IPython.utils.traitlets import Int, Unicode


class CesiumWidget(DOMWidget):
    # the name of the Backbone.View subclass to be used
    _view_name = Unicode('CesiumView', sync=True)
    _view_module = Unicode('/nbextensions/CesiumWidget/cesium_widget.js', sync=True)
    # _view_style = Unicode('nbextensions/CesiumWidget/css/custom', sync=True)

    width = Int(600, sync=True)
    height = Int(600, sync=True)
    czml = Unicode(sync=True)
