function createObject(position, radiusInKm, density, velocity, color, name="") {
    var radiusInM = radiusInKm * 1000;
    var cubicR = radiusInM * radiusInM * radiusInM;
    var volume = 4 * Math.PI * cubicR / 3;
    var c = hexToRgb(color);
    var darkenedColor = [Math.round(c[0] * 0.8), Math.round(c[1] * 0.8), Math.round(c[1] * 0.8)];


    return {
        name: name,
        mass: density * volume,
        density: density,
        radius: radiusInKm,
        position: position,
        velocity: velocity,
        trail: [],
        render: renderCircleGenerator(color, radiusInKm),
        renderTrail: renderTrailGenerator(rgbToHex(darkenedColor)),
        color: c,
        markedForDeletion: false,
    }
}