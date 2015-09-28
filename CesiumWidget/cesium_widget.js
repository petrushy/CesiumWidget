/**
 * The browser-side counterpart to CesiumWidget
 *
 * @author Petrus Hyvonen
 * @copyright Petrus Hyvonen 2014
 * @version 0.1.0
 * @license Apache
 */

var cesium_root = IPython.notebook.base_url + 'nbextensions/CesiumWidget/cesium/Source';
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
			
		var lat = 10
		var lon = 20
		//IPython.notebook.kernel.execute( "IPython.core.display.display('Lat: %s , Lon: %s - metadata saved' % (lat,lon), metadata={'ecoop_prov': 'jsonld'})");
		IPython.notebook.kernel.execute("cesium_picker = []");
        IPython.notebook.kernel.execute("python_var = '" + lat + "'");
		//IPython.notebook.kernel.execute("cesium_picker.append('" + lat + "')");	
		IPython.notebook.kernel.execute("IPython.core.display.display('show this text')");
		IPython.notebook.kernel.execute("cesium_picker.append('" + lat + "')");
		
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
                    var animation = this.model.get('animation');
                    var baseLayerPicker = this.model.get('base_layer_picker');
                    var geocoder = this.model.get('geocoder');
                    var homeButton = this.model.get('home_button');
                    var infoBox = this.model.get('infobox');
                    var sceneModePicker = this.model.get('scene_mode_picker');
                    var selectionIndicator = this.model.get('selection_indicator');
                    var navigationHelpButton = this.model.get('navigation_help_button');
                    var navigationInstructionsInitiallyVisible = this.model.get('navigation_instructions_initially_visible');
                    var scene3DOnly = this.model.get('scene_3D_only');
                    var sceneMode_name = this.model.get('scene_mode');

                    var sceneModes = {
                        'COLUMBUS_VIEW': Cesium.SceneMode.COLUMBUS_VIEW,
                        'SCENE2D': Cesium.SceneMode.SCENE2D,
                        'SCENE3D': Cesium.SceneMode.SCENE3D
                    };

                    if (sceneModes[sceneMode_name])
                        var sceneMode = sceneModes[sceneMode_name];
                    else {
                        var sceneMode = Cesium.SceneMode.SCENE3D;
                        console.log('Illegal scene_mode received')
                        }

                    this.viewer = new Cesium.Viewer(this.cesiumId,{
                        timeline: timeline,
                        animation: animation,
                        baseLayerPicker: baseLayerPicker,
                        geocoder: geocoder,
                        homeButton: homeButton,
                        infoBox: infoBox,
                        sceneModePicker: sceneModePicker,
                        selectionIndicator: selectionIndicator,
                        navigationHelpButton: navigationHelpButton,
                        navigationInstructionsInitiallyVisible: navigationInstructionsInitiallyVisible,
                        scene3DOnly: scene3DOnly,
                        sceneMode: sceneMode
                    });


                    this.viewer.fullscreenButton.viewModel.fullscreenElement = this.viewer.container.childNodes[0];
					// try to add event actions 
					// this dosn't give error!
					// var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
                }

                this.update_lightning();
                this.model.on('change:enable_lightning', this.update_lightning, this);

                this.update_czml();
                this.model.on('change:czml', this.update_czml, this);
                this.update_kml();
                this.model.on('change:kml', this.update_kml, this);
                this.update_geojson();
                this.model.on('change:geojson', this.update_geojson, this);
				
                this.update_billboard();
                this.model.on('change:billboard', this.update_billboard, this);


                this.fly_to();
                this.model.on('change:_flyto', this.fly_to, this);
                this.zoom_to();
                this.model.on('change:_zoomto', this.zoom_to, this);
                this.zoom_to_region();
                this.model.on('change:_zoomtoregion', this.zoom_to_region, this);
				
                this.update_picked_position();
                this.model.on('change:pick', this.update_picked_position, this);
				


                // call __super__.update to handle housekeeping
                return CesiumView.__super__.update.apply(this, arguments);
            },

            update_lightning: function() {
                var enableLighting = this.model.get('enable_lighting');
                this.viewer.scene.globe.enableLighting = enableLighting;
            },

            update_picked_position: function (){
            	var pick_string = this.model.get('pick');
				IPython.notebook.kernel.execute("python_var = '" + pick_string + "'");
            },



            update_billboard: function () {
                console.log('Update billboard!');
				// testing adding billboard
				var bill_string = this.model.get('billboard');
				var bill = bill_string.split(",");
				var image = bill[0];
				var lon = Number(bill[1]);
				var lat = Number(bill[2]);
				var entity = this.viewer.entities.add({
				        position : Cesium.Cartesian3.fromDegrees(lon, lat),
				        billboard : {
				            image : image
				        }
				    });
                    console.log(entity);
                    this.entity = entity;
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

            update_geojson: function () {
                console.log('Update geojson!');
                // Add or update the CZML
                var geojson_string = this.model.get('geojson');
                if (!$.isEmptyObject(geojson_string)) {
                    var data = $.parseJSON(geojson_string);
                    var gjson = new Cesium.GeoJsonDataSource();

                    gjson.load(data, 'Python geojson');
                    if (!$.isEmptyObject(this.geojson)) {
                        this.viewer.dataSources.remove(this.geojson,true);
                    }
                    console.log(gjson);
                    this.viewer.dataSources.add(gjson);
                    this.geojson = gjson;
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
            },

            fly_to: function () {
            	console.log('fly to location!');
				// move the camera to a location
				var flyto = this.model.get('_flyto');
				if (!$.isEmptyObject(flyto)) {
					var pos = flyto //.split(",");
					this.viewer.camera.flyTo({
					        destination : Cesium.Cartesian3.fromDegrees(Number(pos[0]), Number(pos[1]), Number(pos[2])),
					        orientation : {
					            heading : Cesium.Math.toRadians(Number(pos[3])),
					            pitch : Cesium.Math.toRadians(Number(pos[4])),
					            roll : Cesium.Math.toRadians(Number(pos[5]))
					        }
					    });
				}
				console.log(pos);
            },


            zoom_to: function () {
            	console.log('zoom to a location!');
				// move the camera to a location
				var zoomto = this.model.get('_zoomto');
				if (!$.isEmptyObject(zoomto)) {
					var pos = zoomto // .split(",");
					this.viewer.camera.setView({
					        position : Cesium.Cartesian3.fromDegrees(Number(pos[0]), Number(pos[1]), Number(pos[2])),
					        heading : Cesium.Math.toRadians(Number(pos[3])),
					        pitch : Cesium.Math.toRadians(Number(pos[4])),
					        roll : Cesium.Math.toRadians(Number(pos[5]))
					    });
				}
				console.log(pos);
            },
			
			
			
            zoom_to_region: function () {
            	console.log('view region!');
				// move the camera to a location
				var region = this.model.get('_zoomtoregion');
				if (!$.isEmptyObject(region)) {
					var pos = region // .split(",");
					var rectangle = Cesium.Rectangle.fromDegrees(Number(pos[0]), Number(pos[1]), Number(pos[2]), Number(pos[3]));
					this.viewer.camera.viewRectangle(rectangle);
					this.model.set('_zoomtoregion', null);
					this.touch();
				}
				console.log(region);
            }

        });


        return { CesiumView: CesiumView }
    });

