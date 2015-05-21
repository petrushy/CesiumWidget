/**
 * The browser-side counterpart to CesiumWidget
 *
 * @author Petrus Hyvonen
 * @copyright Petrus Hyvonen 2014
 * @version 0.1.0
 * @license Apache


 */
var cesium_root = IPython.notebook.base_url + 'nbextensions/CesiumWidget/cesium/Source'
var cesium_path = cesium_root + '/Cesium';

require.config({
    baseUrl : cesium_root,
        waitSeconds : 60,
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
        'cesium'], function ($, _, widget, manager, Cesium) {
        
        'use strict';

        var cssref = $('<link/>')
        .attr('rel', 'stylesheet')
        .attr('type', 'text/css')
        .attr('href', IPython.notebook.base_url + 'nbextensions/CesiumWidget/cesium/Source/Widgets/widgets.css')
        .appendTo($('head'));
        //console.log('Running function');

        var CesiumView = widget.DOMWidgetView.extend({
            
            render: function () {
                CesiumView.__super__.render.apply(this, arguments);
                console.log('Running Render');
                //onsole.log(this);
                //console.log(Cesium);

                var WIDTH = this.model.get('width'),
                    HEIGHT = this.model.get('height');

                this.$frame = $('<div/>').height(HEIGHT).width(WIDTH).uniqueId().appendTo(this.$el);
                this.cesiumId = this.$frame[0].id;
                this.has_drawn = false;


                // call an update once the node has been added to the DOM
                // TODO: Some problem here?

                //_.defer(_.bind(this.update, this));
                // Wait for element to be added to the DOM
                //this.once('displayed', this.myupdate, this);
                var that = this;
                this.after_displayed(that.myupdate, that);
                //return this;

                this.model.on('change:czml', this.myupdate, this);

            },


            // Do things that are updated every time `this.model` is changed...
            // on the front-end or backend.

            myupdate: function () {
                console.log('Running Update');

                // Create Cesiumjs Viewer if not already there
                if (!this.has_drawn) {
                    this.has_drawn = true;
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

