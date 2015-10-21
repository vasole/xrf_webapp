$(function() {
    /*
      for the periodic table of elements
    */
    $('li[class^="type-"]').mouseover(function() {
        var currentClass = $(this).attr('class').split(' ')[0];
        if (currentClass != 'empty') {
            $('.main > li').addClass('deactivate');
            $('.' + currentClass).removeClass('deactivate');
        }
    });

    $('li[class^="cat-"]').mouseover(function() {
        var currentClass = $(this).attr('class').split(' ')[0];
        $('.main > li').addClass('deactivate');
        $('.' + currentClass).removeClass('deactivate');
    });

    $('.main > li').mouseout(function() {
        var currentClass = $(this).attr('class').split(' ')[0];
        $('.main > li').removeClass('deactivate');
    });


    $('.main > li').click(function() {
        var element = $.trim($(this).clone().children().remove().end().text());
        var new_peaks_table_row = $($("#peaks_table tr")[1]).clone();
        new_peaks_table_row.removeClass("hidden");
        $("#peaks_table tbody").append(new_peaks_table_row);
        $(new_peaks_table_row.find("input")[0]).val(element);
    });

    /*
       required to initialize tooltips
    */
    $('[data-toggle="tooltip"]').tooltip();

    /*
      add material when clicking 'ok' in modal dialog
    */
    $("#material_modal_ok").click(function() {
        add_material($("#material_modal_name").val());
    });

    /*
      TODO: add default materials
    */
    add_material('Air', ['C', 'N', 'O', 'Ar', 'Kr'], [0.000124, 0.75527, 0.23178, 0.012827, 3.2e-6], 0.0012048, 1);
    add_material('Beryllium', ['Be'], [1.0], 1.848, 1);
    add_material('Germanium', ['Ge'], [1.0], 5.323, 1);
    add_material('Gold', ['Au'], [1.0], 19.37, 1);
    add_material('Kapton', ['C', 'N', 'O'], [0.628772, 0.066659, 0.304569], 1.42, 1);
    add_material('Mylar', ['H', 'C', 'O'], [0.0419590, 0.625017, 0.333025], 1.40, 1);
    add_material('Silicon', ['Si'], [1.0], 2.33, 1);
    add_material('Teflon', ['C', 'F'], [0.240183, 0.759817], 2.2, 1);
    /* add_material('Water', ['H2O1'], [1.0], 1.0, 1); */
});

function add_material(name, compounds_list, mass_list, default_density, default_thickness) {
    if (compounds_list == undefined) {
        compounds_list = [];
    };
    if (mass_list == undefined) {
        mass_list = [];
    };
    if (default_density == undefined) {
        default_density = 1;
    };
    if (default_thickness == undefined) {
        default_thickness = 1;
    };

    material_panels = $("#materials .panel");
    var new_material = $(material_panels[material_panels.length - 1]).clone();
    if ($(material_panels[0]).hasClass("placeholder")) {
        $(material_panels[0]).remove();
        new_material.removeClass("placeholder");
    }
    $("#materials").append(new_material);
    var a = new_material.find(".panel-title").find("a")
    a.text(name);
    var new_id = "material_" + name;
    a.attr("href", "#" + new_id);
    new_material.find(".panel-collapse").attr("id", new_id);
    var material_table = new_material.find("tbody");
    var new_row = $(material_table.children()[0]).clone()
    material_table.empty();
    if (compounds_list.length > 0) {
        for (var i = 0; i < compounds_list.length; i++) {
            var inputs = new_row.find("input");
            $(inputs[0]).val(compounds_list[i]);
            $(inputs[1]).val(mass_list[i]);
            material_table.append(new_row);
            new_row = new_row.clone();
        }
    } else {
        var inputs = new_row.find("input");
        $(inputs[0]).val($(inputs[0]).attr("placeholder"));
        $(inputs[1]).val($(inputs[0]).attr("placeholder"));
        material_table.append(new_row);
    }
    var material_form = new_material.find("fieldset");
    var inputs = material_form.find("input");
    $(inputs[0]).val(default_density);
    $(inputs[1]).val(default_thickness);

    update_materials_in_tables();
};

function update_materials_in_tables() {
    $("#multilayer ul").empty();
    $("#attenuators ul").empty();
    $("#detector ul").empty();

    $("#materials .panel-title a").each(function() {
        var material_name = $(this).html();
        $("#multilayer ul").append($("<li><a href='#' onclick='material_selected(event)'>" + material_name + "</a></li>"));
        $("#multilayer button").each(function() {
            if ($.trim($(this).text()) == 'placeholder') {
                $(this).html($(this).html().replace("placeholder", material_name))
            };
        });
        $("#attenuators ul").append($("<li><a href='#' onclick='material_selected(event)'>" + $(this).html() + "</a></li>"));
        $("#attenuators button").each(function() {
            if ($.trim($(this).text()) == 'placeholder') {
                $(this).html($(this).html().replace("placeholder", material_name))
            };
        });
        $("#detector ul").append($("<li><a href='#' onclick='material_selected(event)'>" + $(this).html() + "</a></li>"));
        $("#detector button").each(function() {
            if ($.trim($(this).text()) == 'placeholder') {
                $(this).html($(this).html().replace("placeholder", material_name))
            };
        });
    });
};

function show_add_material(e) {
    $("#material_modal").modal("show");
};

function peak_selected(e) {
    var ref = e.target;
    var selected_peak = $(ref).html();
    var btn = $(ref).parent().parent().prev();
    var current_peak = $.trim($(btn).text());
    $(btn).html($(btn).html().replace(current_peak, selected_peak));
    e.preventDefault();
};

function material_selected(e) {
    var ref = e.target;
    var selected_material = $(ref).html();
    var btn = $(ref).parent().parent().prev();
    var current_material = $.trim($(btn).text());
    $(btn).html($(btn).html().replace(current_material, selected_material));

    var density = 1;
    var thickness;
    var materials = get_materials();
    for (var i=0; i<materials.length; i++) {
      if (materials[i].name == selected_material) {
        density = materials[i].density;
        if (density == "") { density = "1" };
        thickness = materials[i].thickness;
        if (thickness == "") { thickness = "1" };
        break;
      }
    }

    $($(btn).parent().parent().parent().find("input")[0]).val(density);
    var thickness_input = $($(btn).parent().parent().parent().find("input")[1]);
    var thickness_current_value = $.trim(thickness_input.val());
    if ((thickness_current_value == "") || (thickness_current_value=="1")) {
      thickness_input.val(thickness);
    }
    
    e.preventDefault();
};

function add_row(e) {
    var add_btn = e.target;
    var table_row = $(add_btn).parent().parent();
    var new_table_row = table_row.clone();
    new_table_row.removeClass("hidden");
    table_row.parent().append(new_table_row);
};

function del_row(e) {
    var btn = e.target;
    var table_row = $(btn).parent().parent();
    $(table_row).remove();
};

function del_layer_row(e) {
    var btn = e.target;
    var table_row = $(btn).parent().parent();
    if ($(table_row).parent().children().length > 1) {
        $(table_row).remove();
    }
};

function add_detector() {
  if  ($("#detector_table tbody tr").length == 1) {
  var new_row = $($("#detector_table tbody tr")[0]).clone();
  new_row.removeClass("hidden");
  $("#detector_table tbody").append(new_row);
  }
};

function add_layer(e) {
  var new_row = $($("#multilayer_table tbody tr")[0]).clone();
  new_row.removeClass("hidden");
  $("#multilayer_table tbody").append(new_row);
};

function add_beam_filter(e) {
  var new_row = $($("#beam_filters_table tbody tr")[0]).clone();
  new_row.removeClass("hidden");
  $("#beam_filters_table tbody").append(new_row);
};

function add_filter(e) {
  var new_row = $($("#filters_table tbody tr")[0]).clone();
  new_row.removeClass("hidden");
  $("#filters_table tbody").append(new_row);
};

function filter_selected(e) {
    material_selected(e);
};

function get_materials() {
    var materials = [];

    $("#materials .panel").each(function() {
        var material = {};
        material.name = $($(this).find(".panel-title a")[0]).text();
        material.compounds = [];
        material.mass = [];
        var i = 0;
        $(this).find("tbody input").each(function() {
            if (i % 2 == 0) {
                material.compounds.push($.trim($(this).val()));
            } else {
                material.mass.push($.trim($(this).val()));
            }
            i++;
        });
        var inputs = $(this).find("fieldset input");
        material.density = $.trim($(inputs[0]).val());
        material.thickness = $.trim($(inputs[1]).val());
        materials.push(material);
    });

    return materials;
};

function get_multilayer() {
    var multilayer = [];

    $("#multilayer_table tbody tr").each(function() {
        if (! $(this).hasClass("hidden")) {
        var layer = {};
        var input_cols = $(this).find("input");
        layer.density = $(input_cols[0]).val();
        layer.thickness = $(input_cols[1]).val();
        layer.material = $.trim($($(this).find("button")[0]).text());
        multilayer.push(layer);
        }
    });

    return multilayer;
};

function get_attenuators() {
    var attenuators = [];

    $("#beam_filters_table tbody tr").each(function() {
        if (! $(this).hasClass("hidden")) {
        var att = {};
        var input_cols = $(this).find("input");
        var btns = $(this).find("button");
        att.type = "Beam Filter"; //$.trim($(btns[0]).text());
        att.density = $(input_cols[0]).val();
        att.thickness = $(input_cols[1]).val();
        att.funny = $(input_cols[2]).val();
        att.material = $.trim($(btns[0]).text());
        attenuators.push(att);
        }
    });
 
     $("#filters_table tbody tr").each(function() {
        if (! $(this).hasClass("hidden")) {
        var att = {};
        var input_cols = $(this).find("input");
        var btns = $(this).find("button");
        att.type = "Filter"; //$.trim($(btns[0]).text());
        att.density = $(input_cols[0]).val();
        att.thickness = $(input_cols[1]).val();
        att.funny = $(input_cols[2]).val();
        att.material = $.trim($(btns[0]).text());
        attenuators.push(att);
        }
    }); 


    return attenuators;
};

function get_detector() {
    var detector = {};

    $("#detector_table tbody tr").each(function() {
        if (! $(this).hasClass("hidden")) {
        var input_cols = $(this).find("input");
        var btns = $(this).find("button");
        detector.material = $.trim($(btns[0]).text());
        detector.density = $(input_cols[0]).val();
        detector.thickness = $(input_cols[1]).val();
        detector.area = $(input_cols[2]).val();
        detector.distance = $(input_cols[3]).val();
        }
    });

    return detector;
};

function get_peaks() {
    var peaks = [];

    $("#peaks_table tbody tr").each(function() {
        if (! $(this).hasClass("hidden")) {
        var peak = {};
        var input_cols = $(this).find("input");
        var btns = $(this).find("button");
        peak.element = $(input_cols[0]).val();
        peak.family = $.trim($(btns[0]).text());
        peak.layer = $(input_cols[1]).val();
        peaks.push(peak);
        }
    });

    return peaks;
};

function submit() {
    user_input = {
        "materials": get_materials(),
        "attenuators": get_attenuators(),
        "detector": get_detector(),
        "multilayer": get_multilayer(),
        "peaks": get_peaks(),
        "beam_energy": $("#beam_energy").val(),
        "incoming_angle": $("#incoming_angle").val(),
        "outgoing_angle": $("#outgoing_angle").val()
    };

    $.ajax({
        url: "calculate",
        data: JSON.stringify(user_input),
        dataType: "json",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function(returned_data) {
            /*
                TODO: better handle result: are there errors? etc
            */
            $("#result").text(returned_data.text);
        }
    });
};
