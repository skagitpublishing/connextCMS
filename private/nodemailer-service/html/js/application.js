$(function() {
  $("#start_date2").datepicker({
      minDate: "+3D",
      beforeShow: function() {
        setTimeout(function() {
          $(".ui-datepicker").css('z-index', 999999);
        }, 0);
      }
  });
  $("#end_date2").datepicker({
      minDate: "+3D",
      beforeShow: function() {
        setTimeout(function() {
          $(".ui-datepicker").css('z-index', 999999);
        }, 0);
      }
  });
  $("#geographic_target_btn").click(function () {
    debugger;
    var locale_id = $("#geographic_target").val();
    $.getJSON("/postal-code", { locale_id: locale_id }, function(data) {
      $.each(data, function(index, value) {
        addPostalCode(value);
      });
    });
    return false;
  });
  $("#geographic_target_add_postal_code_btn").click(function () {
    addPostalCode($("#geographic_target_add_postal_code_input").val());
    $("#geographic_target_add_postal_code_input").val("");
    return false;
  });
  $("#mobile_targets_hyperlocal").click(function () {
    $("#hyperlocal_target_coordinates").slideToggle();
  });
  if(!$('#mobile_targets_hyperlocal').is(':checked')) {
    $("#hyperlocal_target_coordinates").hide();
  }
  $("#hyperlocal_target_coordinates_0").hide();
  $("#hyperlocal_target_coordinates_btn").click(function () {
    var address = $("#hyperlocal_target_coordinates_input").val();
    addHyperLocal(address);
    $("#hyperlocal_target_coordinates_input").val("");
    return false;
  });
  $('#creatives_input').fileupload({
    dataType: 'json',
    done: function (e, data) {
      $.each(data.result.files, function (index, file) {
        $("#creatives > div.row").prepend("<div class=\"col-sm-3\"><a class=\"thumbnail\" href=\""+file.url+"\" data-lightbox=\"default\"><img src=\""+file.thumbnailUrl+"\" class=\"img-responsive\" alt=\""+file.name+"\"></a><input type=\"hidden\" name=\"creatives[]\" value=\""+file.url+"\"><input type=\"hidden\" name=\"creative_thumbnails[]\" value=\""+file.thumbnailUrl+"\"></div>");
      });
      lightbox.enable();
    }
  });
});

function addPostalCode(zipcode) {
  $("#postal_codes").prepend("<span class=\"label label-primary\"><input type=\"hidden\" name=\"postal_codes[]\" value=\"" + zipcode +"\">" + zipcode + " <button type=\"button\" class=\"dismiss\">&times;</button></span>\n");
  $("#postal_codes > span > button").click(function () {
    $(this).parent().remove();
  });
}

function addHyperLocal(address) {
  $.getJSON(
    "http://maps.googleapis.com/maps/api/geocode/json",
    { address: address },
    function(data) {
      var lat = data['results'][0]['geometry']['location']['lat'].toFixed(4);
      var lng = data['results'][0]['geometry']['location']['lng'].toFixed(4);
      var address = $("#hyperlocal_target_coordinates_0").clone();
      address.prop("id", "hyperlocal_target_coorinates_" + $("#hyperlocal_target_coordinates_row > div").length);
      address.find("img").prop("src", "https://maps.googleapis.com/maps/api/staticmap?key=AIzaSyBrHv35zMZKyoTzbTiQz_sONtVOkEYuDo4&zoom=14&size=200x200&center=" + lat + "," + lng + "&markers=color:red|" + lat + "," + lng);
      $.each(data['results'][0]['address_components'], function(key, value) {
        if(value['types'][0] == 'subpremise') {
          value['short_name'] = "#" + value['short_name'];
        }
        address.find("address > span." + value['types'][0]).text(value['short_name']);
      });
      address.find("address > span.lat").text(lat);
      address.find("address > span.lng").text(lng);
      address.find("button").click(function () {
        var address = $(this).parent().parent().parent();
        address.fadeOut();
        address.remove();
      });
      address.find("input").val(lat + "," + lng);
      address.find("input").prop("name", "hyperlocal_target_coordinates[]");
      address.appendTo("#hyperlocal_target_coordinates_row");
      address.fadeIn();
    }
  );
}
