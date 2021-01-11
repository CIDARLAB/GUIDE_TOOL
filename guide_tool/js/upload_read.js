function splite_json(){
	var components = info.components;
	var features = info.features;
	
	var a = read_data(features, 0, ["Port", "Via", "Valve3D", "DiamondReactionChamber", "Pump3D"],flow_info);
	var b = read_data(features, 1, ["Valve3D_control", "Port", "Pump3D_control"], ctrl_info);
	return a.concat(b);
}

function isEmptyObject(obj){
    for (var n in obj) {
        return false
    }
    return true; 
}
function read_data(a,k,l, positions){
	var index_port = 1;
	var index_via = 1;
	var index_channel = 1;
	var index_valve = 1;
	var index_chamber = 1;
	var index_pump = 1;
	for (let values of getObjectValues(a[k].features)){
		var dic = {};
		if (values.macro == "Port"){
			dic = {'id': index_port, 'type': values.macro, 'position': values.params.position};
			index_port += 1;
			if (k==0) port[port.length] = dic;
			else port_c[port_c.length] = dic;
		}	
		else if (values.macro == "Via"){
			dic = {'id': index_via, 'type': values.macro, 'position': values.params.position};
			index_via += 1;
			via[via.length] = dic;
		}
		else if (values.macro == "Valve3D_control"){
			dic = {'id': index_valve, 'type': values.macro, 'position': values.params.position, 'radius':values.params.valveRadius};
			// # 3Duf json file doesn't provide rotation for every valve here.
			// # 1 means vertical, 0 means horizontal
			// # if values['params']['rotation'] == 90: dic['direct'] = 1
			// # else: dic['direct'] = 0
			index_valve += 1;
			valve_c[valve_c.length] = dic;
		}
		else if (values.macro == "Valve3D"){
			dic = {'id': index_valve, 'type': values.macro, 'position': values.params.position, 'radius':values.params.valveRadius};
			// # if values['params']['rotation'] == 90: dic['direct'] = 1
			// # else: dic['direct'] = 0
			index_valve += 1;
			valve[valve.length] = dic;
		}
		else if (values.macro == "DiamondReactionChamber"){
			dic = {'id': index_chamber, 'type': values.macro, 'position': values.params.position, 'len': values.params.length, 'width': values.params.width};
			index_chamber += 1;
			chamber[chamber.length] = dic;
		}
		else if (values.macro == "Pump3D"){
			dic = {'id': index_pump, 'type': values.macro, 'position': values.params.position, 'len': values.params.spacing, 'radius':values.params.valveRadius};
			if (values.params.rotation == 90) dic['direct'] = 0;
			else dic['direct'] = 1;
			index_pump += 1;
			pump[pump.length] = dic;
		}
		else if (values.macro == "Pump3D_control"){
			dic = {'id': index_pump, 'type': values.macro, 'position': values.params.position, 'len': values.params.spacing, 'radius':values.params.valveRadius};
			if (values.params.rotation == 90) dic['direct'] = 0;
			else dic['direct'] = 1;
			index_pump += 1;
			pump_c[pump_c.length] = dic;
		}
		if (!isEmptyObject(dic)) positions[positions.length]=dic;
		
		if (values.macro == "RoundedChannel"){
			len_0 = values.params.start[0] - values.params.end[0]
			// # length in vertical
			len_1 = values.params.start[1] - values.params.end[1]
			// # length in horizontal
			// # confirm start is on the head and left of line segment
			if ((len_0 == 0 && len_1 > 0) || (len_1 == 0 && len_0 > 0))
				dic = {'id': index_channel, 'type': values['macro'], 'start':values['params']['end'], 'end': values['params']['start']}
			else dic = {'id': index_channel, 'type': values['macro'], 'start':values['params']['start'], 'end': values['params']['end']}
			if (len_1 == 0) dic['direct'] = 0
			else dic['direct'] = 1;
			index_channel += 1;
			positions[positions.length] = dic;
		}
	}
	
	return [index_port-1, index_pump-1, index_valve-1, index_via-1, index_chamber-1];
}
function getObjectKeys(object)
{
	var keys = [];
	for (var property in object)
		keys.push(property);
	return keys;
}

function getObjectValues(object)
{
	var values = [];
	for (var property in object)
		values.push(object[property]);
	return values;
}

// upload json
function read() {
	var f=document.getElementById('file').files[0];
	var r= new FileReader();
	point_path = [], ctrl_info = [], flow_info = [], last_outport = [], last_point = [], path_ctrl_info = [], index_ctrl_port = [],info=[], elements_num = [];
	valve_c=[], valve=[], pump=[], pump_c=[], port=[], port_c=[], via=[], chamber = [];
	r.onload=function() {
		info = JSON.parse(this.result);
		// elements in array: flow: index_port, index_pump, index_valve, index_via, index_chamber, repeat once for control.
		elements_num = splite_json();
		document.getElementById("size1").innerHTML = elements_num[0];
		document.getElementById("size2").innerHTML = elements_num[1];
		document.getElementById("size3").innerHTML = elements_num[2];
		document.getElementById("size4").innerHTML = elements_num[3];
		document.getElementById("size5").innerHTML = elements_num[4];
		document.getElementById("size6").innerHTML = elements_num[5];
		document.getElementById("size7").innerHTML = elements_num[6];
		document.getElementById("size8").innerHTML = elements_num[7];
		var a = [],b=[],c=[];
		var i =1;
		while (i <= elements_num[5]){
			a[a.length] = i;
			i++
		}
		i=1;
		while (i <= elements_num[0]){
			if (i<=17) b[b.length]=i;
			else c[c.length]=i;
			i++;
		}
		document.getElementById("inlet").innerHTML = "Inlets: "+ b;
		document.getElementById("outlet").innerHTML = "Outlets: "+ c;
		new_grapgh();
	};
	r.readAsText(f,"UTF-8");//"UTF-8"是读取文件的文件编码，也可以是"GB2312"。
}