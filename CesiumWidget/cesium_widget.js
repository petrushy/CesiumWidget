/**
 * The browser-side counterpart to CesiumWidget
 *
 * @author Petrus Hyvonen
 * @copyright Petrus Hyvonen 2014
 * @version 0.1.0
 * @license Apache

TODO: not sure css loading works, add CSS loading to /nbextensions/CesiumWidget/cesium/Build/Cesium/Widgets/widgets.css

 */

var cesium_path = IPython.notebook.base_url + 'nbextensions/CesiumWidget/cesium/Build/Cesium/Cesium';
require.config({
    paths: {
        cesium: cesium_path
    },
    shim: {
        cesium: {
            exports: 'cesium'
        },
    }
});

define(
    ['jquery',
        'underscore',
        'widgets/js/widget',
        'widgets/js/manager',
        '/nbextensions/CesiumWidget/cesium/Build/Cesium/Cesium.js'], function ($, _, widget, manager, Cesium) {
        'use strict';
        console.log('Running function');

        var CesiumView = widget.DOMWidgetView.extend({
            
            render: function () {
                CesiumView.__super__.render.apply(this, arguments);
                console.log('Running Render');
                console.log(this);
                var WIDTH = this.model.get('width'),
                    HEIGHT = this.model.get('height');
                var model = this.model;
                this.$frame = $('<div/>').height(HEIGHT).width(WIDTH).uniqueId().appendTo(this.$el);

                this.cesiumId = this.$frame[0].id;
                this.has_drawn = false;

                // call an update once the node has been added to the DOM
                // TODO: Some problem here?

                //_.defer(_.bind(this.update, this));
                // Wait for element to be added to the DOM
                //this.once('displayed', this.myupdate, this);

                this.after_displayed(this.update, this);
                //return this;

            },


            // Do things that are updated every time `this.model` is changed...
            // on the front-end or backend.

            update: function () {
                console.log('Running Update');

                // Create Cesiumjs Viewer if not already there
                // Seems to need to be here to access the DIV id
                if (!this.has_drawn) {
                    this.has_drawn = true;
                    // Somehow Cesium isn't available here
                    this.viewer = new Cesium.Viewer(this.cesiumId);
                }

                // Add or update the CZML 
                var cz = new Cesium.CzmlDataSource();
                var data = $.parseJSON(this.model.get('czml'));
                cz.load(data, 'Python CZML');
                this.viewer.dataSources.removeAll(true);
                this.viewer.dataSources.add(cz);

                // call __super__.update to handle housekeeping
                //return CesiumView.__super__.update.apply(this, arguments);
            }

        }); 
        
        return {
            CesiumView: CesiumView }
    });

