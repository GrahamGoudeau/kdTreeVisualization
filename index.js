var point_set = [],
    point_width = 10,
    do_horizontal = true,
    x_start,
    x_end,
    y_start,
    y_end;

function reset() {
    point_set = [];
    do_horizontal = true;
    x_start = 0,
    x_end = width - 1,
    y_start = 0,
    y_end = height - 1;
    setup();
}

function setup() {
    var canvas = createCanvas(windowWidth / 2, 3 * windowHeight / 4);

    canvas.parent('canvas');
    frameRate(30);
    background(255);

    // draw a border around the canvas
    line(0, 0, 0, height);
    line(width - 1, 0, width - 1, height - 1);
    line(0, 0, width - 1, 0);
    line(0, height - 1, width - 1, height - 1);
    fill(0);

    // set global variables
    x_start = 0,
    x_end = width - 1,
    y_start = 0,
    y_end = height - 1;
}

// x_or_y_val must be either 'x' or 'y'
function median(values, x_or_y_val) {

    if (values.length === 0) {
        return NaN;
    }

    values.sort( function(a,b) {return a[x_or_y_val] - b[x_or_y_val];} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half][x_or_y_val];
    else
        return (values[half-1][x_or_y_val] + values[half][x_or_y_val]) / 2.0;
}

function build_kd_tree(x_start, y_start, x_end, y_end, points) {
    kd_tree_helper(x_start, y_start, x_end, y_end, points, do_horizontal);
}

function kd_tree_helper(x_start, y_start, x_end, y_end, points, horizontal) {
    var points_median,
        points_in_range = [],
        axis;

    points.map(function (point) {
        if (point.x > x_start && point.x < x_end &&
                point.y > y_start && point.y < y_end) {
            points_in_range.push(point);
        }
    });

    if (points_in_range.length > 0) {
        if (horizontal) {
            axis = 'y';
            points_median = median(points_in_range, axis);
            if (points_in_range.length === 1) return;
            line(x_start, points_median, x_end, points_median);
            kd_tree_helper(x_start, y_start, x_end, points_median, points, !horizontal);
            kd_tree_helper(x_start, points_median, x_end, y_end, points, !horizontal);
        }
        else {
            axis = 'x';
            points_median = median(points_in_range, axis);
            if (points_in_range.length === 1) return;
            line(points_median, y_start, points_median, y_end);
            kd_tree_helper(x_start, y_start, points_median, y_end, points, !horizontal);
            kd_tree_helper(points_median, y_start, x_end, y_end, points, !horizontal);
        }
    }
}

function drawEllipses(ellipses) {
    ellipses.map(function (point) {
        ellipse(point.x, point.y, point_width, point_width);
    });
}

function mouseClicked() {
    var new_point;
    if (mouseX < width && mouseY < height) {
        setup();
        new_point = {
            x: mouseX,
            y: mouseY
        }
        point_set.push(new_point);
        drawEllipses(point_set);
        //build_kd_tree(width / 2, 0, width - 1, height - 1, point_set);
        build_kd_tree(0, 0, width - 1, height - 1, point_set);
    }
}

function draw() {
}
