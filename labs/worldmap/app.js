        function accessor(d) {
            return function(e) { return 0; };
            return function(e) { return e.p[d]; };
        }

        function decLabel(d) {
            var s = 0;
            if(d == "00") {
                s = 2000;
            } else {
                s = parseInt("19" + d);
            }
            return s + "-" + (s + 9);
        }



        function update(wjson, cjson_data, decade) {

            svg.select("text.title")
                .text("Test world map");

            var ad   = accessor(decade),
                vmax = d3.max($.map(wjson.features, function(d, i) {
                        return ad(d);
                    })),
                cscale = d3.scale.linear().domain([0, vmax])
                    .range(["#000", "#dfff6d"]);

            world.selectAll("path.world")
                .transition().duration(500)
                .attr("fill", function(d) {
                        return cscale(ad(d));
                    });

            worldo.selectAll("original-title")
                .text(function(d) {
                        return d.p.n;

                        var v = " emails sent"; // + (ad(d) == 1 ? "" : "s");
                        return d.p.n + ": " + ad(d) + v;
                    });
            
            var cmax = d3.max($.map(cjson_data, function(d, i) {
                        return ad(d);
                    })),
                wscale = d3.scale.linear().domain([0, cmax])
                    .range([0.2, 5]);

            // Set transition effect for lines
            cables.selectAll("path.cable")
                .transition().duration(500)
                .attr("stroke-width", function(d) {
                    
                        return 2;
                        return wscale(ad(d));
                    })
                .attr("stroke-opacity", function(d) {
                        return 0.5;

                        if(ad(d) > 0) {
                            return 0.5;
                        } else {
                            return 0;
                        }
                    });
            /*
            cables.selectAll("circle.origin")
                .transition().duration(500)
                .attr("r", function(d) {
                        if(ad(d) > 0) {
                            return 2;
                        }
                    })
                .attr("cx", function(d) {
                        return proj(d.geometry.coordinates)[0];
                    })
                .attr("cy", function(d) {
                        return proj(d.geometry.coordinates)[1];
                    })
                .select("original-title").text(function(d) {
                        var u = " cable" + (ad(d) == 1 ? "" : "s");
                        return d.p.n + ": " + ad(d) + u;
                    });*/
        }

        function create_cables(cables, wjson, cjson_data) {

            // var cjson_data = cjson.features;
            // window.rz = cables;

            // Use b-spline (curve) interpolation
            var l = d3.svg.line().interpolate("bundle");
            var c = d3.select('svg')
                            .append('svg:g')
                            .classed('line', true)
                            .attr('transform', window.temp_translate);

            var paths = c
                .selectAll('path.cable-1')
                .data(cjson_data)
                .enter()
                .append("svg:path")
                .classed("cable", true)

                // Create cables/lines
                .attr("d", function(d) {

                    // use projection to convert lat/lng coordinates to pixels
                    var start = proj(d.coordinates),
                        end   = proj(dc),
                        dx    = end[0] - start[0],
                        dy    = end[1] - start[1],
                        mid   = [start[0] + dx / 2,
                                 start[1] + dy / 2],
                        dist  = Math.sqrt(
                                   Math.pow(dx, 2) +
                                   Math.pow(dy, 2)
                                ),
                        diff  = dist / 5,
                        middx = dy * diff / dist,
                        ddx   = middx + ((Math.random()-0.5) * middx/3),
                        middy = dx * diff / dist,
                        ddy   = middy + ((Math.random()-0.5) * middy/3),
                        midp  = [end[0] > start[0] ? mid[0] + ddx : mid[0] - ddx,
                                 end[1] > start[1] ? mid[1] + ddy : mid[1] - ddy];

                    return l([start, midp, end]);
                })
                .attr("stroke-dasharray", function(d) {
                        var l = Math.round(this.getTotalLength());
                        return l + " " + l;
                    })
                .attr("stroke-dashoffset", function(d) {
                        return 0;
                    })

                paths.each(function() {

                    var path = d3.select(this);

                    var totalLength = path.node().getTotalLength();

                    path.text(function(d) {

                        var t = document.createElementNS("http://www.w3.org/2000/svg", "text"),
                            b = this.getBBox(),
                            p = this.getPointAtLength(0);

                        // t.setAttribute("transform", "translate(" + (b.x + b.width/2) + " " + (b.y + b.height/2) + ")");
                        t.setAttribute("transform", "translate(" + (p.x) + " " + (p.y - 10) + ")");
                        t.textContent = d.p['00'] + ' emails sent from ' + d.country;
                        t.setAttribute("fill", "red");
                        t.setAttribute("font-size", "8");
                        t.setAttribute('opacity', 0)
                        this.parentNode.insertBefore(t, this.nextSibling);

                        d3.select(t)
                          .transition()
                          .duration(2000)
                          .style('opacity', 1);
                    });

                    path
                      .attr("stroke-dasharray", totalLength + " " + totalLength)
                      .attr("stroke-dashoffset", totalLength)
                      .transition()
                        .duration(2000)
                        .ease("quad-out")
                        .attr("stroke-dashoffset", 0)
                        .attr("stroke-width", function(d) {
                                return 1;
                        })
                        .attr("stroke-opacity", function(d) {
                                return 0.7;
                        });
                });

                worldo = c.append("svg:g");
                worldo.selectAll("path.worldoverlay")
                    .data(wjson.features)
                    .enter().append("svg:path")
                    .classed("worldoverlay", true)
                    .attr("d", path)
                    .append("original-title").text(function(d) {
                        //if(d.p.n != "United States") {
                            if(proj(d.geometry.coordinates[0][0][0])[0] > width/2) {
                                $(this).parent().tipsy({gravity:'se'});
                            } else {
                                $(this).parent().tipsy({gravity:'sw'});
                            }
                        //}
                    });

                var ad = accessor(decades[dix]);
                c.append("svg:g")
                    .selectAll("circle.origin")
                    .data(cjson_data)
                    .enter()
                    .append("svg:circle")
                    .classed("origin", true)
                    .attr("r", function(d) {

                        var v   = d.p['00'], 
                            max = 7;

                        if (v < 50) {
                            return 2;
                        }
                        else {
                            return v > 300 ? max : v/300 * max;
                        }

                        if(ad(d) > 0) {
                            return 2;
                        }
                    })
                    .attr("cx", function(d) {
                        return proj(d.coordinates)[0];
                    })
                    .attr("cy", function(d) {
                        return proj(d.coordinates)[1];
                    })
                    .append("original-title").text(function(d) {
                        if(proj(d.coordinates)[0] > width/2) {
                            $(this).parent().tipsy({gravity:'se'});
                        } else {
                            $(this).parent().tipsy({gravity:'sw'});
                        }
                    });

                update(wjson, cjson_data, decades[dix]);
        }

        function remove_cables() {

            var paths = d3.select('.line')
                        .transition()
                        .duration(2000)
                        .style('opacity', 0)
                        .remove();
        }

        // Start program
        // Create equirectangular projection
        var proj = d3.geo.equirectangular().scale(1).translate([0,0]),
            path = d3.geo.path().projection(proj),
            margin = 25,
            width = window.innerWidth - margin,
            height = window.innerHeight - margin,
            // dc = [ -77.036, 38.895 ],
            dc = [12.5687, 55.6750],
            svg = d3.select("body")
                .append("svg:svg")
                .attr("height", height)
                .attr("width", width),
            cables = svg.append("svg:g"),
            world = cables.append("svg:g"), worldo,
            selector = svg.append("svg:g"),
            decades = [ "00", "90", "80", "70" ],
            dix = 0;

            cables.classed('cables', true);
        
        d3.json("world-dec.geojson", function(wjson) {
            var bounds0 = d3.geo.bounds(wjson),
                bounds = bounds0.map(proj),
                xscale = width/Math.abs(bounds[1][0] - bounds[0][0]),
                yscale = height/Math.abs(bounds[1][1] - bounds[0][1]),
                scale = Math.min(xscale, yscale);
            proj.scale(scale);
            proj.translate(proj([-bounds0[0][0], -bounds0[1][1]]));

            if(xscale > yscale) {
                // center horizontally
                var d = xscale * Math.abs(bounds[1][0] - bounds[0][0]) -
                    yscale * Math.abs(bounds[1][0] - bounds[0][0]);

                window.temp_translate = "translate(" + d/2 + ", 0)";
                cables.attr("transform", "translate(" + d/2 + ", 0)");
            } else {
                // center vertically
                var d = yscale * Math.abs(bounds[1][1] - bounds[0][1]) -
                    xscale * Math.abs(bounds[1][1] - bounds[0][1]);
                window.temp_translate = "translate(0, " + d/2 + ")";
                cables.attr("transform", "translate(0, " + d/2 + ")");
            }
/*
            svg.append("svg:text")
                .classed("title", true)
                .attr("text-anchor", "start")
                .attr("x", margin)
                .attr("y", 2*margin);
            svg.append("svg:text")
                .attr("text-anchor", "start")
                .attr("y", height-margin/2)
                .text("Visits by the president or secretary of state or by a foreign dignitary to the US. Data taken from http://www.state.gov. Cable data courtesy of WikiLeaks.");
            svg.append("svg:text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height-margin/2)
                .text("Lars Kotthoff 2011");
*/
            d3.json("customers.json", function(cjson) {
                // cjson = [{coordinates: [-35.00000000, 30.00000000]}];
                // cjson = [{coordinates: [7.1, 50.733333]}];
/*
                $.each(decades, function(i, d) {
                    selector.append("svg:text")
                        .attr("text-anchor", "start")
                        .attr("x", margin)
                        .attr("y", height-((i+3)*margin))
                        .attr("class", function(e) {
                                return i == dix ? "active" : "inactive";
                            })
                        .on("click", function(e) {
                                selector.select("text.active")
                                    .attr("class", "inactive");
                                d3.select(this).attr("class", "active");
                                dix = i;
                                update(wjson, cjson, decades[dix]);
                            })
                        .text(decLabel(d));
                });
        */
                world.selectAll("path.world")
                    .data(wjson.features)
                    .enter().append("svg:path")
                    .classed("world", true)
                    .attr("d", path)
                    .append("svg:animate")
                    .attr("attributeName", "fill-opacity")
                    .attr("dur", "2s")
                    .attr("from", 0)
                    .attr("to", 1);

                var cjson_data = [],
                    temp_data  = [];

                cjson_data.push.apply(cjson_data, cjson.splice(0, 2));
                create_cables(cables, wjson, cjson_data);

                var timer = setInterval(function(){

                    var cjson_data = [];
                    if (!cjson.length) {
                        cjson = temp_data;
                    }

                    cjson_data.push.apply(cjson_data, cjson.splice(0, 2));
                    temp_data.push.apply(temp_data, cjson_data);

                    // remove old lines
                    if (d3.selectAll('.line')[0].length > 2) {
                        var tmp   = d3.selectAll('.line')[0].slice(0, 2),
                            nodes = d3.selectAll(tmp);

                        if (d3.selectAll('.line')[0].length > 10) {
                            nodes = d3.selectAll('.line');
                        }

                        nodes
                            .transition()
                            .duration(1500)
                            .style('opacity', 0)
                            .remove();
                    }

                    create_cables(cables, wjson, cjson_data);

                }, 2000);

                /*
                setInterval(function() {
                    remove_cables();
                }, 2200);
                */
            });

        });
