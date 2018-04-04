$(document).ready(function(){

  function getDiners(){
    $.get("/api/diners", function(data){
      optArray = [];
      data.forEach(function(item){
        optArray.push(createDinerList(item));
      });
      $("#sel-user").empty();
      $("#sel-user").append(optArray);
      $("#sel-user").val("");
    })
  };

  function createDinerList(data){
    var selItem = $("<option>");
    selItem.attr("value", data.id);
    selItem.text(data.name);
    return selItem;
  };

  function getAllBurgers(){
    $.get("/api/burgers", function(data){
      var rowArray = [];
      data.forEach(function(item){
        rowArray.push(createBurgerList("all", item));
      });
      $("#burger-list").empty();
      $("#burger-list").append(rowArray);
    });
  };

  function getEatenBurgers(user){
    $.get("/api/bv/links/" + user, function(data){
      var eatenArray = [];
      if (data.length === 0){
        var listItem = $("<li>");
        listItem.append("Not Eaten Here Before!");
        eatenArray.push(listItem);
      } else {
        data.forEach(function(item){
          eatenArray.push(createBurgerList("eaten", item));
        });
      };
      $("#burger-eaten").empty();
      $("#burger-eaten").append(eatenArray);
    });
  };

  function createBurgerList(filter, data){
    var listItem = $("<li>");
    var newBttn = $("<button>");
    newBttn.attr("class", "btn btn-default");
    var burger = "";
    if (filter === "eaten"){
      burger = data.Burger.burger_name;
      newBttn.text(data.quantity);
    } else {
      burger = data.burger_name
      newBttn.attr("data-id", data.id);
      newBttn.addClass("eat");
      newBttn.text("Eat-a-Burger");
    };
    listItem.append(burger, newBttn);
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
      lblText = "Enter the Name of the Burger to Add:";
      inpId = "new-burger";
      inp = "<input>";
      invText = "Please provide a Burger Name.";
      $("#modal-label").text("Add-a-Burger!");
      $("#execute").text("Add");
      $("#execute").attr("data-type", "add");
    } else {
      formId = "del";
      lblText = "Select the Burger to Delete:";
      inpId = "rem-burger";
      inp = "<select>";
      invText = "Please select a Burger to remove.";
      $("#modal-label").text("Delete-a-Burger!")
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

  function addDeleteBurger(method, data){
    var divId = "";
    if (method === "POST"){
      divId = "#new-burger";
    } else {
      divId = "#rem-burger";
    };
    $.ajax({
      method: method,
      url: "/api/burgers",
      data: data
    }).done(function(result){
      $(divId).val("");
      getAllBurgers();
      var userSel = $("#sel-user").val();
      if (userSel != "" || userSel != null){
        getEatenBurgers(userSel);
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
    var userSel = $("#sel-user").val();
    if (userSel === "" || userSel == null){
      $("#sel-user").addClass("is-invalid");
    } else {
      getEatenBurgers(userSel);
    };
  });

  $(document).on("click", ".eat", function(event){
    var burgerId = parseInt($(this).attr("data-id"));
    var userSel = $("#sel-user").val();

    if (userSel === "" || userSel == null){
      $("#sel-user").addClass("is-invalid");
    } else {
      var eatenStatus = {
        BurgerId: burgerId,
        UserId: userSel
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
            getEatenBurgers(userSel);
          });
        } else {
          getEatenBurgers(userSel);
        };
      });
    };
  });

  $("#add-burger").on("click", function(){
    $("#modal-data").empty();
    modalBody("add");
    $("#add-del-modal").modal("show");
  });

  $("#del-burger").on("click", function(){
    $("#modal-data").empty();
    modalBody("del");
    $("#add-del-modal").modal("show");
    $.get("/api/burgers", function(data){
      var selOption;
      data.forEach(function(item){
        selOption = $("<option>");
        selOption.attr("value", item.id);
        selOption.text(item.burger_name);
        $("#rem-burger").append(selOption);
      });
      $("#rem-burger").val("");
    });
  });

  $(document).on("click", "#execute", function(event){
    event.preventDefault();
    if ($(this).attr("data-type") === "add"){
      var add = $("#new-burger").val().trim();
      if (add === "" || add == null){
        $("#new-burger").addClass("is-invalid");
      } else {
        var newBurger = {
          name: add
        };
        addDeleteBurger("POST", newBurger);
      };
    } else {
      var del = $("#rem-burger").val();
      if (del === "" || del == null){
        $("#rem-burger").addClass("is-invalid");
      } else {
        var delBurger = {
          id: del
        };
        addDeleteBurger("DELETE", delBurger);
      };
    };
  });

  $("#new-burger").focus(function(){
    $("#new-burger").removeClass("is-invalid");
  });

  $("#rem-burger").focus(function(){
    $("#rem-burger").removeClass("is-invalid");
  });

  $("#sel-user").focus(function(){
    $("#sel-user").removeClass("is-invalid");
    $("#burger-eaten").empty();
  });

  getDiners();
  getAllBurgers();

});