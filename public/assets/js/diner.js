$(document).ready(function(){

  function getBurgers(){
    $.get("/api/burgers", function(data){
      optArray = [];
      data.forEach(function(item){
        optArray.push(createBurgerList(item));
      });
      $("#sel-burger").empty();
      $("#sel-burger").append(optArray);
      $("#sel-burger").val("");
    })
  };

  function createBurgerList(data){
    var selItem = $("<option>");
    selItem.attr("value", data.id);
    selItem.text(data.burger_name);
    return selItem;
  };

  function getAllDiners(){
    $.get("/api/diners", function(data){
      var rowArray = [];
      data.forEach(function(item){
        rowArray.push(createDinerList("all", item));
      });
      $("#diner-list").empty();
      $("#diner-list").append(rowArray);
    });
  };

  function getEatenBurgers(burger){
    console.log(burger);
    $.get("/api/dv/links/" + burger, function(data){
      var eatenArray = [];
      if (data.length === 0){
        var listItem = $("<li>");
        listItem.append("Burger Not Eaten Yet!");
        eatenArray.push(listItem);
      } else {
        data.forEach(function(item){
          eatenArray.push(createDinerList("eaten", item));
        });
      };
      $("#diner-eaten").empty();
      $("#diner-eaten").append(eatenArray);
    });
  };

  function createDinerList(filter, data){
    var listItem = $("<li>");
    var newBttn = $("<button>");
    newBttn.attr("class", "btn btn-default");
    var diner = "";
    if (filter === "eaten"){
      diner = data.Diner.name;
      newBttn.text(data.quantity);
    } else {
      diner = data.name
      newBttn.attr("data-id", data.id);
      newBttn.addClass("eat");
      newBttn.text("Eat-a-Burger");
    };
    listItem.append(diner, newBttn);
    return listItem;
  };

  function modalBody(func){
    var formId = "";
    var lblText = "";
    var inpId = "";
    var inp = "";
    var invText = ""
    if (func === "add"){
      formId = "add";
      lblText = "Enter the Name of the Diner to Add:";
      inpId = "new-diner";
      inp = "<input>";
      invText = "Please provide a Diner Name.";
      $("#modal-label").text("Add-a-Diner!");
      $("#execute").text("Add");
      $("#execute").attr("data-type", "add");
    } else {
      formId = "del";
      lblText = "Select the Diner to Delete:";
      inpId = "rem-diner";
      inp = "<select>";
      invText = "Please select a Diner to remove.";
      $("#modal-label").text("Delete-a-Diner!")
      $("#execute").text("Delete");
      $("#execute").attr("data-type", "delete");
    }
    var newForm = $("<form>");
    newForm.attr("id", formId);
    var groupDiv = $("<div>");
    groupDiv.attr("class", "form-group");
    var newLabel = $("<label>");
    newLabel.attr("for", inpId);
    newLabel.text(lblText);
    var newInput = $(inp);
    newInput.attr("type", "text");
    newInput.attr("id", inpId);
    newInput.attr("name", "name");
    newInput.attr("class", "form-control");
    var invalidDiv = $("<div>");
    invalidDiv.attr("class", "invalid-feedback");
    invalidDiv.text(invText);
    groupDiv.append(newLabel, newInput, invalidDiv);
    newForm.append(groupDiv);
    $("#modal-data").append(newForm);
  };

  function addDeleteDiner(method, data){
    var divId = "";
    if (method === "POST"){
      divId = "#new-diner";
    } else {
      divId = "#rem-diner";
    };
    $.ajax({
      method: method,
      url: "/api/diners",
      data: data
    }).done(function(result){
      $(divId).val("");
      getAllDiners();
      var burgerSel = $("#sel-burger").val();
      if (burgerSel != ""){
        getEatenBurgers(burgerSel);
      };
    }).fail(function(xhr, responseText, responseStatus){
      if (xhr){
        $(divId).addClass("is-invalid");
        console.log(xhr.responseText);
      };
    });
  };

  $("#sel").on("submit", function(event){
    event.preventDefault();
    var burgerSel = $("#sel-burger").val();
    if (burgerSel === "" || burgerSel == null){
      $("#sel-burger").addClass("is-invalid");
    } else {
      getEatenBurgers(burgerSel);
    };
  });

  $(document).on("click", ".eat", function(event){
    var dinerId = parseInt($(this).attr("data-id"));
    var burgerSel = $("#sel-burger").val();

    if (burgerSel === "" || burgerSel == null){
      $("#sel-burger").addClass("is-invalid");
    } else {
      var eatenStatus = {
        BurgerId: burgerSel,
        UserId: dinerId
      };

      $.ajax({
        method: "PUT",
        url: "/api/links",
        data: eatenStatus
      }).then(function(res){
        if (res[0] === 0){
          $.ajax({
            method: "POST",
            url: "/api/links",
            data: eatenStatus
          }).then(function(){
            getEatenBurgers(burgerSel);
          });
        } else {
          getEatenBurgers(burgerSel);
        };
      });
    };
  });

  $("#add-diner").on("click", function(){
    $("#modal-data").empty();
    modalBody("add");
    $("#add-del-modal").modal("show");
  });

  $("#del-diner").on("click", function(){
    $("#modal-data").empty();
    modalBody("del");
    $("#add-del-modal").modal("show");
    $.get("/api/diners", function(data){
      var selOption;
      data.forEach(function(item){
        selOption = $("<option>");
        selOption.attr("value", item.id);
        selOption.text(item.name);
        $("#rem-diner").append(selOption);
      });
      $("#rem-diner").val("");
    });
  });

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++
    $(document).on("click", "#execute", function(event){
    event.preventDefault();
    if ($(this).attr("data-type") === "add"){
      var add = $("#new-diner").val().trim();
      if (add === "" || add == null){
        $("#new-diner").addClass("is-invalid");
      } else {
        var newDiner = {
          name: add
        };
        addDeleteDiner("POST", newDiner);
      };
    } else {
      var del = $("#rem-diner").val();
      if (del === "" || del == null){
        $("#rem-diner").addClass("is-invalid");
      } else {
        var delDiner = {
          id: del
        };
        addDeleteDiner("DELETE", delDiner);
      };
    };
  });
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++

  $("#new-user").focus(function(){
    $("#new-user").removeClass("is-invalid");
  });

  $("#rem-user").focus(function(){
    $("#rem-user").removeClass("is-invalid");
  });

  $("#sel-burger").focus(function(){
    $("#sel-burger").removeClass("is-invalid");
  });

  getBurgers();
  getAllDiners();

});