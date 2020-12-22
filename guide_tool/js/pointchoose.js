var point_new = 0;
function choosepoint(){
    var objTop = getOffsetTop(document.getElementById("myCanvas"));
    var objLeft = getOffsetLeft(document.getElementById("myCanvas"));

    var mouseX = event.clientX+document.documentElement.scrollLeft;
    var mouseY = event.clientY+document.documentElement.scrollTop;

    var objX = mouseX-objLeft;
    var objY = mouseY-objTop;

    clickObjPosition = objX + "," + objY;
    // alert_word = "Position: " + clickObjPosition;
    // alert(alert_word);

    var min = 100000000;
    var min_id = 0;
    var min_position;
    var distance = 0;
    var min_type;
    for(var i=0; i<flow_info.length; i++){
        if (flow_info[i].type =="Port") {
            distance = Math.abs(objX - flow_info[i].position[0]/100) + Math.abs(objY - flow_info[i].position[1]/100);
            if (distance < min){
                min = distance;
                min_id = flow_info[i].id;
                min_position = flow_info[i].position;
                min_type = flow_info[i].type;
            }
        }
    }
    if (min_id!=0 && point_path.indexOf(min_id) <0){
		point_path[point_path.length] = min_id ;
		point_new = 1;
	} 
	else if (point_path.indexOf(min_id)>=0){
		point_new = 0;
		return;
	} 
    // document.getElementById("positionShow").innerHTML = "Position you chose: " + clickObjPosition + ";  Port Index: " +
    //     min_type + "_" + min_id + ";  Port Position: " + min_position[0]/100 + "," + min_position[1]/100 + ". <br><br>"+
    //     "Point indexes: " + point_path;
}

function getOffsetTop(obj){
    var tmp = obj.offsetTop;
    var val = obj.offsetParent;
    while(val != null){
        tmp += val.offsetTop;
        val = val.offsetParent;
    }
    return tmp;
}
function getOffsetLeft(obj){
    var tmp = obj.offsetLeft;
    var val = obj.offsetParent;
    while(val != null){
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;
}

function remove_point_tr(obj){
	var index = parseInt(obj.parentNode.parentNode.id);
	var i = point_path.indexOf(index);
	console.log(i,index, point_path,obj,obj.parentNode.parentNode);
	point_path.splice(i,1);
	obj.parentNode.parentNode.remove();
}