/*
 * Copyright (C) 2011 McGill University
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
* BrainBrowser v1.3.8
* https://brainbrowser.cbrain.mcgill.ca/
*
* Author: Tarek Sherif  <tsherif@gmail.com> (http://tareksherif.ca/)
* Author: Nicolas Kassis
*/
$(function() {
	"use strict";
	function a() {
		e.show()
	}
	function b() {
		e.hide()
	}
	var time=1;

	var mark = $("[name='Type'][checked]").val();
	var c = 0,
	d = "",
	e = $("#loading");
	return BrainBrowser.utils.webglEnabled() ? (BrainBrowser.SurfaceViewer.start("brainbrowser",
	function(f) {
		var g = $('<select id="color-map-select"></select>').change(function() {
			f.loadColorMapFromURL($(this).val())
		});
		function runone() {
			time=1;
			if(mark=="Atlas"){
		    	  (function() {						
						f.loadIntensityDataFromURL("model/brainnetome_atlas.txt", {
							name: "brainnetome_atlas",
							min: 0,
							max: 40,
							complete: b
						})
					})();	    	  	      
			}
			else{
				e.hide()
			}
		};
		BrainBrowser.config.surface_viewer.color_maps.forEach(function(a) {
			g.append('<option value="' + a.url + '">' + a.name + "</option>")
		}),
		$("#color-map-box").append(g),
		f.clamped = !1,
		f.flip = !1,
		f.addEventListener("error", b),
		f.addEventListener("loadcolormap",
		function(a) {
			var b = a.createCanvasWithScale(0, 100, null),
			c = document.getElementById("color-bar");
			b.id = "spectrum-canvas",
			c ? $(c).html(b) : $('<div id="color-bar"></div>').html(b).appendTo("#data-range-box")
		}),
		f.addEventListener("displaymodel",
		function(a) {
			var b, c, d = a.children,
			e = $("#shapes").children().length;
			d.length - e > 0 && d.slice(e).forEach(function(a, d) {
				c = $('<div id="shape_' + d + '" class="shape">' + "<h4>Shape " + (d + 1 + e) + "</h4>" + "Name: " + a.name + "<br />" + "Opacity: " + "</div>"),
				b = $('<div class="opacity-slider slider" data-shape-name="' + a.name + '"></div>'),
				b.slider({
					value: 100,
					min: -1,
					max: 101,
					slide: function(a) {
						var b = a.target,
						c = $(b).attr("data-shape-name"),
						d = $(b).slider("value");
						d = Math.min(100, Math.max(0, d)) / 100,
						f.setTransparency(c, d)
					}
				}),
				b.appendTo(c),
				c.appendTo("#shapes")
			})
		}),
		f.addEventListener("clearscreen",
		function() {
			$("#shapes").html(""),
			$("#data-range-box").hide(),
			$("#color-map-box").hide()
		}),
		f.addEventListener("rangechange",
		function(a) {
			var b = f.color_map.createCanvasWithScale(a.rangeMin, a.rangeMax, null);
			b.id = "spectrum-canvas",
			$("#color-bar").html(b)
		}),
		f.addEventListener("loadintensitydata",
		function(a) {
			var b, c, d = $("#data-range"),
			e = '<div id="data-range-multiple"><ul>',
			g = "",
			h = Array.isArray(a) ? a: [a];
			for (d.html(""), b = 0, c = h.length; c > b; b++) e += '<li><a href="#data-file' + b + '">' + h[b].filename + "</a></li>",
			g += '<div id="data-file' + b + '" class="box range-controls">',
			g += 'Min: <input class="range-box" id="data-range-min" type="text" name="range_min" size="5" >',
			g += '<div id="range-slider' + b + '" data-blend-index="' + b + '" class="slider"></div>',
			g += 'Max: <input class="range-box" id="data-range-max" type="text" name="range_max" size="5">',
			g += '<input type="checkbox" class="button" id="fix_range"><label for="fix_range">Fix Range</label>',
			g += '<input type="checkbox" class="button" id="clamp_range"><label for="clamp_range">Clamp range</label>',
			g += '<input type="checkbox" class="button" id="flip_range"><label for="flip_range">Flip Colors</label>',
			g += "</div>";
			e += "</ul>",
			d.html(e + g + "</div>"),
			$("#data-range-box").show(),
			$("#color-map-box").show(),
			d.find("#data-range-multiple").tabs(),
			d.find(".range-controls").each(function(a, b) {
				function c() {
					var a = parseFloat(l.val()),
					b = parseFloat(m.val());
					n.slider("values", 0, a),
					n.slider("values", 1, b),
					f.rangeChange(a, b, d.find("#clamp_range").is(":checked"))
				}
				var d = $(b),
				e = h[a],
				g = BrainBrowser.utils.min(e.values),
				i = BrainBrowser.utils.max(e.values),
				j = e.rangeMin,
				k = e.rangeMax,
				l = d.find("#data-range-min"),
				m = d.find("#data-range-max"),
				n = d.find(".slider");
				n.slider({
					range: !0,
					min: 10,
					max: 90,
					values: [j, k],
					step: (k - j) / 100,
					slide: function(a, b) {
						var c = b.values[0],
						d = b.values[1];
						l.val(c),
						m.val(d),
						e.rangeMin = c,
						e.rangeMax = d,
						f.model_data.intensity_data = e,
						f.rangeChange(c, d, f.clamped)
					}
				}),
				n.slider("values", 0, parseFloat(j)),
				n.slider("values", 1, parseFloat(k)),
				l.val(g),
				m.val(i),
				$("#data-range-min").change(c),
				$("#data-range-max").change(c),
				$("#fix_range").click(function() {
					f.fixRange = $(this).is(":checked")
				}),
				$("#clamp_range").change(function(a) {
					var b = parseFloat(l.val()),
					c = parseFloat(m.val());
					$(a.target).is(":checked") ? f.rangeChange(b, c, !0) : f.rangeChange(b, c, !1)
				}),
				$("#flip_range").change(function() {
					f.flip = $(this).is(":checked"),
					f.updateColors(f.model_data.intensity_data, {
						min: j,
						max: k,
						color_map: f.color_map,
						flip: f.flip,
						clamped: f.clamped
					})
				}),
				f.triggerEvent("rangechange", e)
			})
		}),
		f.addEventListener("blendcolormaps",
		function() {
			var a = $("#blend-box");
			a.html("Blend Ratio: "),
			$('<span id="blend_value">0.5</span>').appendTo(a),
			$('<div class="blend_slider" id="blend_slider" width="100px" + height="10"></div>').slider({
				min: .1,
				max: .99,
				value: .5,
				step: .01,
				slide: function() {
					f.blend($(this).slider("value"))
				}
			}).appendTo(a)
		}),
		f.render(),
		f.loadColorMapFromURL(BrainBrowser.config.surface_viewer.color_maps[0].url),
		f.loadModelFromURL("model/surf_reg_model.obj", {format: "MNIObject",parse: {split: !0},before: a,
			complete: runone}),
			
		$("#clearshapes").click(function() {
			f.clearScreen(),
			c = 0,
			d = "",
			e.show(),
			f.loadModelFromURL("model/surf_reg_model.obj", {format: "MNIObject",parse: {split: !0},before: a,
				complete: runone})
		}),
		$("[name='Type']").change(function() {
		      // 这里需要更新
			if(time==1){
				time=2;
				f.clearScreen(),
				c = 0,
				d = "",
				e.show(),
				f.loadModelFromURL("model/surf_reg_model.obj", {format: "MNIObject",parse: {split: !0},before: a,
					complete: runone}),
			      mark = $(this).val();
			      if(mark=="FC"){
			    	  $("option[value='color_maps/jet.txt']").attr("selected",true);
			    	 ( function() {
			  			f.loadColorMapFromURL("color_maps/jet.txt")
			  			})()
			      }
			      else{
			    	  $("option[value='color_maps/spectral.txt']").attr("selected",true);
			    	  ( function() {
				  			f.loadColorMapFromURL("color_maps/spectral.txt")
				  			})()
			      }
			      
			}

		  }),
		$("#examples").click(function(a) {
			function g(a) {
				return function() {
					return a !== c
				}
			}
			c++;
			var duplicateshap=false;
			var h, i, j = $(a.target).attr("data-example-name");
			
			
			if(j<40)
				{
			if (d !== j) {
				d = j,
				e.show();
				//f.clearScreen();				
				
				if(mark=="Atlas"){
					var k = {};
					for(var i=0;i<40;i++)
					{
						if(i!=28){
							if(i!=0){
								(function(){
									var temp=i;
									k[i]=function() {						
										f.loadIntensityDataFromURL("model/"+temp+"_linear_2.txt", {
											name: temp+"_linear_2",
											min: 10,
											max: 90,
											complete: b,
											cancel: g(c)
										})
									}
								})()
							}
							else{
								(function(){
									var temp=i;
									k[i]=function() {						
										f.loadIntensityDataFromURL("model/brainnetome_atlas.txt", {
											name: "brainnetome_atlas",
											min: 0,
											max: 40,
											complete: b,
											cancel: g(c)
										})
									}
								})()
							}

						}
						

					}
					
				}
				else if(mark=="FC"){
					var k = {};
					for(var i=1;i<40;i++)
					{
						if(i!=28){
							(function(){
								var temp=i;
								k[i]=function() {						
									f.loadIntensityDataFromURL("model/FC/"+temp+".txt", {
										name: temp,
										min: -1,
										max: 1,
										complete: b,
										cancel: g(c)
									})
								}
							})()
						}						
					}
					
				}
				else if(mark=="Fiber"){
					var k = {};
					for(var i=1;i<40;i++){
						
							(function(){
								var temp=i;
								k[i]=function(){
									f.loadModelFromURL("model/fiber/f"+temp+".obj", {
										format: "MNIObject",
										parse: {split: !0},
										complete: b
										})
								}
							})()
						
					}
					
					var shapdiv=$("div.opacity-slider");
					shapdiv.each(
							function(){
								var shapname=$(this).attr("data-shape-name");
								var tempshapname="f"+j+".obj";
								if(shapname==tempshapname){
									b();
									duplicateshap=true;
									return false;
								}
								
							});


				}
				if(duplicateshap!=true){
					duplicateshap=false;
					return k.hasOwnProperty(j) && k[j](),
					!1
				}
				else{
					b();
					return 0;
				}
									

			}
		}
		}),
		$("#obj_file_format").change(function() {
			var a = $("#obj_file_format").closest("#obj_file_select").find("#obj_file_format option:selected").val();
			$("#format_hint").html(BrainBrowser.config.surface_viewer.filetypes[a].format_hint || "")
		}),
		$("#obj_file_submit").click(function() {
			var c = $("#obj_file_format").closest("#obj_file_select").find("#obj_file_format option:selected").val();
			return f.loadModelFromFile(document.getElementById("objfile"), {
				format: c,
				beforeLoad: a,
				complete: b
			}),
			!1
		}),
		$(".datafile").change(function() {
			var a = parseInt(this.id.slice( - 1), 10);
			f.loadIntensityDataFromFile(this, {
				blend_index: a - 1
			})
		}),
		$("#color-map").change(function() {
			f.loadColorMapFromFile(document.getElementById("color-map"))
		}),
		$("a.example[data-example-name=Brainnetome]").click()
	}), void 0) : ($("#brainbrowser").html(BrainBrowser.utils.webGLErrorMessage()), void 0)
});