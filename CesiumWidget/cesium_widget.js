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
    baseUrl: cesium_root,
    urlArgs: "",
    waitSeconds: 60,
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

        // Add cesium CSS link
        var cssref = $('<link/>')
            .attr('rel', 'stylesheet')
            .attr('type', 'text/css')
            .attr('href', IPython.notebook.base_url + 'nbextensions/CesiumWidget/cesium/Source/Widgets/widgets.css')
            .appendTo($('head'));

        var CesiumView = widget.DOMWidgetView.extend({

            render: function () {
                CesiumView.__super__.render.apply(this, arguments);
                //console.log('Running Render');

                var WIDTH = this.model.get('width'),
                    HEIGHT = this.model.get('height');

                this.$frame = $('<div/>').height(HEIGHT).width(WIDTH).uniqueId().appendTo(this.$el);
                this.cesiumId = this.$frame[0].id;
                this.has_drawn = false;

                // Wait for element to be added to the DOM
                //this.once('displayed', this.myupdate, this);

                this.after_displayed(this.init_viewer, this);
            },

            // Update: Do things that are updated every time `this.model` is changed...
            // on the front-end or backend.

            init_viewer: function () {
                console.log('Running Update');

                // Create Cesiumjs Viewer if not already there
                if (!this.has_drawn) {
                    this.has_drawn = true;

                    var timeline = this.model.get('timeline');
                    
                    this.viewer = new Cesium.Viewer(this.cesiumId,{
                        timeline: timeline
                    });

                    this.viewer.fullscreenButton.viewModel.fullscreenElement = this.viewer.container.childNodes[0];
                }

                this.update_czml();
                this.model.on('change:czml', this.update_czml, this);
                this.update_kml();
                this.model.on('change:kml', this.update_kml, this);

                // call __super__.update to handle housekeeping
                //return CesiumView.__super__.update.apply(this, arguments);
            },

            update_czml: function () {
                console.log('Update CZML!');
                // Add or update the CZML
                var czml_string = this.model.get('czml');
                if (!$.isEmptyObject(czml_string)) {
                    var data = $.parseJSON(czml_string);
                    var cz = new Cesium.CzmlDataSource();

                    cz.load(data, 'Python CZML');
                    if (!$.isEmptyObject(this.czml)) {
                        this.viewer.dataSources.remove(this.czml,true);
                    }
                    console.log(cz);
                    
                    this.viewer.dataSources.add(cz);
                    this.czml = cz;
                }
            },

                update_kml: function () {
                console.log('Update KML!');
                // Add or update the KML
                var kml_string = this.model.get('kml_url');
                if (!$.isEmptyObject(kml_string)) {
                    //var data = $.parseJSON(kml_string);
                    var kml = new Cesium.KmlDataSource();

                    kml.load(kml_string, 'Python KML');
                    if (!$.isEmptyObject(this.kml)) {
                        this.viewer.dataSources.remove(this.kml,true);
                    }
                    console.log(kml);
                    
                    this.viewer.dataSources.add(kml);
                    this.kml = kml;
                }
            }
        });

        return { CesiumView: CesiumView }
    });

