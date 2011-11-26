/* Helpful little function for onload actions and working on all browsers */
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

function showAllEntries(){
    $$("div.entry-container").each(function(value, index) {
        value.show;
        });
    }

function select_user() {
    Element.toggle('current-user');
    Element.toggle('select-user');
}

/* Expanding Clients on the Reports Page */
function expandClient(clientId) {             
  Element.toggle("expanded-head_" + clientId);
  Element.toggle("expanded-foot_" + clientId);
  if (Element.hasClassName("client-" + clientId, "expanded")) {
    Element.removeClassName("client-" + clientId, "expanded");
  }
  else {
    Element.addClassName("client-" + clientId, "expanded"); 
  }
  var hidden = $$("tbody#container_client-" + clientId + " tr.expanded-inner").collect(function(value, index) { return value.toggle(); });
}

/* Expanding Clients and Users on the Reports Page */
function expandReportContainer(id) {             
  Element.toggle("expanded-foot_" + id);
  $$("tbody#container_" + id + " tr.expanded-head").map(Element.toggle);
  $$("tbody#container_" + id + " tr.expanded-inner").map(Element.toggle);

  if (Element.hasClassName("container_header_" + id, "expanded")) {
    Element.removeClassName("container_header_" + id, "expanded");
  }
  else {
    Element.addClassName("container_header_" + id, "expanded"); 
  }
}


var taskBudgetUpdater = function(){
  var buffer = 10000;
  var total = 0.0;
  $$('#sortable_tasks .task-budget').each(function(element, value) {
    value = Math.round(parseFloat(element.value)*buffer)
    if(value)
      total += value;
  });
  $("task-budget-remaining-number").innerHTML = (($F("project_budget")*buffer) - total) / buffer;
}

// This function will blind up one tab and then blind down another
function rollTab(show_tab, hide_tab){
    if (!$(show_tab).visible()){
        // We only want this function to operate if the tab is not visible already
        Effect.BlindUp(hide_tab, {duration:0.15})
        Effect.BlindDown(show_tab, {duration:0.15, delay: 0.15})
        // Optionally it can set a show_tab-nav class to current
        if ($(show_tab+'-nav')) $(show_tab+'-nav').addClassName('current')
        if ($(hide_tab+'-nav')) $(hide_tab+'-nav').removeClassName('current')
        // Optionally it can set a show_tab-active value to 1
        if ($(show_tab+'-active')) $(show_tab+'-active').value="1"
        if ($(hide_tab+'-active')) $(hide_tab+'-active').value=""
    }
}

// This function will display or hide the working icon
// The hide_id and working_id are both optional
function toggleWorking(hide_id, working_id){
    if (hide_id !== undefined) $(hide_id).toggle();

    if (working_id !== undefined){
        $(working_id).toggle();
    }
    else {
        $('working').toggle();
    }
}

/** Returns the value of the selected radio button in the radio group
 * 
 * @param {radio Object} or {radio id} el
 * OR
 * @param {form Object} or {form id} el
 * @param {radio group name} radioGroup */
function $RF(radioId) {


    if($(radioId).type == 'radio') {
        var form = $(radioId).form;
        var radioGroup = $(radioId).name;
    } else {
        return false;
    }
    return $F(form.getInputs('radio', radioGroup).find(
        function(re) {return re.checked;}
    ));
}