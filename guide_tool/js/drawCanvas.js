function draw_pump(ctx, info, i, color)
{
    ctx.beginPath();
    ctx.strokeStyle=color;
	if (info[i].direct==0) {
		ctx.arc(info[i].position[0]/100-info[i].len/100, info[i].position[1]/100, 10, 0, 2*Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.arc(info[i].position[0]/100, info[i].position[1]/100, 10, 0, 2*Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.arc(info[i].position[0]/100+info[i].len/100, info[i].position[1]/100, 10, 0, 2*Math.PI);
		ctx.stroke();
	}
    else {
		ctx.arc(info[i].position[0]/100, info[i].position[1]/100-info[i].len/100, 10, 0, 2*Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.arc(info[i].position[0]/100, info[i].position[1]/100, 10, 0, 2*Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.strokeStyle=color;
		ctx.arc(info[i].position[0]/100, info[i].position[1]/100+info[i].len/100, 10, 0, 2*Math.PI);
		ctx.stroke();
	}
}

function text_fill(ctx, info, i, color)
{
    ctx.strokeStyle=color;
    ctx.font="bold 14px Arial";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillStyle="black";
    ctx.fillText( info[i].id,info[i].position[0]/100, info[i].position[1]/100);
}

function draw_bk(ctx, info, flag, color1, color2)
{
    if (flag ==1)
    {
        for(var i=0;i<info.length;i++){
            ctx.lineWidth=3;
            if (info[i].type == "RoundedChannel") {
                ctx.beginPath();
                ctx.strokeStyle=color1;
                ctx.moveTo(info[i].start[0]/100, info[i].start[1]/100);
                ctx.lineTo(info[i].end[0]/100, info[i].end[1]/100);
                ctx.stroke();
            } else if (info[i].type == "DiamondReactionChamber"){
                ctx.beginPath();
                ctx.fillStyle=color1;
                ctx.fillRect(info[i].position[0]/100-info[i].width/200, info[i].position[1]/100-info[i].len/200, info[i].width/100,info[i].len/100);
                ctx.stroke();
            } else if (info[i].type == "Valve3D"){
                ctx.beginPath();
                ctx.strokeStyle=color1;
                ctx.arc(info[i].position[0]/100, info[i].position[1]/100, 10, 0, 2*Math.PI);
                text_fill(ctx, info, i, color1);
                ctx.stroke();
            }else if (info[i].type == "Pump3D"){
                draw_pump(ctx, info, i, color1);
                text_fill(ctx, info, i, color1);
            }
            else{
                ctx.beginPath();
                text_fill(ctx, info, i, color1);
                ctx.arc(info[i].position[0]/100, info[i].position[1]/100, 10, 0, 2*Math.PI);
                ctx.stroke();
            }
        }
    }else{
        for(var i=0;i<info.length;i++){
            ctx.lineWidth=3;
            if (info[i].type == "RoundedChannel") {
                ctx.beginPath();
                ctx.strokeStyle=color2;
                ctx.moveTo(info[i].start[0]/100, info[i].start[1]/100);
                ctx.lineTo(info[i].end[0]/100, info[i].end[1]/100);
                ctx.stroke();
            } else if (info[i].type == "Pump3D_control"){
                draw_pump(ctx, info, i, color2)
            } else {
                ctx.beginPath();
                ctx.strokeStyle=color2;
                ctx.arc(info[i].position[0]/100, info[i].position[1]/100, 10, 0, 2*Math.PI);
                text_fill(ctx, info, i, color2);
                ctx.stroke();
            }
        }
    }
}

function new_grapgh()
{
    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
	c.height=c.height;
	// using the analysed arrays to draw graph
	if (ctrl_info.length == 0)	splite_json();
	draw_bk(ctx,flow_info,1,"blue","red");
	draw_bk(ctx, ctrl_info,2,"blue","red");
  //   $.getJSON("data/My-Device-V0-flow.json", function (data) {
  //       flow_info=data;
		// console.log(flow_info);
  //       draw_bk(ctx,flow_info,1,"blue","red");
  //   });
// 
//     $.getJSON("data/My-Device-V0-control.json", function (data) {
//         ctrl_info=data;
//         draw_bk(ctx, ctrl_info,2,"blue","red");
//     });
}

function newCanvas(mode_num=0,level=3){

    var c=document.getElementById("myCanvas");
    var ctx=c.getContext("2d");
    if (mode_num==0) {
		draw_bk(ctx,flow_info,1,"blue","red");
		draw_bk(ctx, ctrl_info,2,"blue","red");
		return;
	}
    console.log(mode_num);

    var port_flow = [];
    var channel_flow = [];
    var ctrl_channel = [];
    // pretreatment
    for(var j=0; j < flow_info.length; j++){
        if (flow_info[j].type == "Port") port_flow[port_flow.length] = flow_info[j];
        else {
			channel_flow[channel_flow.length] = flow_info[j];
		}
    }

    for(var j=0; j < ctrl_info.length; j++){
        ctrl_channel[ctrl_channel.length] = ctrl_info[j];
    }

    draw_bk(ctx, flow_info,1,"white","white");
    draw_bk(ctx, ctrl_info,2,"white","white");
    var path_info = [];
    var num_port = 0;
    // this array is used to block the valves we don't want it open, or the opposite
    var block_valve = [59,22,27,26,28,40,41,42,43,19,60,61,62,63,64,65,66];
    var outlet_port = [20,18,24,23,25,19,22,21];
    var via_valve = [2,7,6,8,1,4,3,5];
    var chamber_valve = [17,11,9,10];
    var mid_valve = [0,0,0,0,0];
    var pump_block = [1,2,4,3]; // if 0, means that pump should be open
	
	// fpc=0 means there is a exist path not for clean
	console.log(flag_points_clean,flag_after_clean);
	if (flag_points_clean == 0){
		// fac=0 means the last path is not for clean
		if (point_path.length==0 || (point_path.length==2 && point_path.indexOf(2)>=0 && point_path.indexOf(10)>=0) ) point_path = last_point.slice(0);
		if (mode_num == 5) {
		    point_path = last_outport.slice(0);
		}
	} else if (mode_num==5){
		var p =[];
		console.log(point_path.slice(0));
		for (let point of point_path){
			if (point>17) p[p.length] = point;
		}
		point_path = p.slice(0);
	}
	console.log(point_path.slice(0));
    if (mode_num == 2 || mode_num == 4 || mode_num == 7) {
		flag_after_clean = 1;
		point_path = [2, 10];
	}

    // pre-action
    if (flag_after_clean==0) last_point = point_path.slice(0);
    for (var i = 0; i < point_path.length; i++) {

        // p is the index of chosen point in outlet_port
        var p = outlet_port.indexOf(point_path[i]);
        if (p != -1) {
            via_valve[p] = 0;
            // p/2 is the index of MCM it will get into.
            if (mode_num != 5) chamber_valve[Math.floor(p / 2)] = 0;
        }
        else block_valve[point_path[i] - 1] = 0;
    }
	if (mode_num != 4 && mode_num != 2 && mode_num != 7){
		flag_after_clean = 0;
		flag_points_clean = 0;
	}
    // save the current outport, prepare for the cleaning process when the current operation is not cleaning
    if (mode_num != 4 && mode_num != 2 && mode_num != 7 && mode_num != 5){
		
        last_outport = [];
        for (var i = 0; i < point_path.length; i++) {
            if (outlet_port.indexOf(point_path[i]) != -1) {
                last_outport[last_outport.length] = point_path[i];
            }
        }
    }else if (mode_num == 5){
		last_outport = point_path.slice(0);
	}
	
    // find input and output and delete output port when mode_num is 3
    for (var j = 0; j < port_flow.length; j++) {
        for (var i = 0; i < point_path.length; i++) {
            if (mode_num == 3 || mode_num == 6) {
                var p = outlet_port.indexOf(point_path[i]);
                if (p != -1) {
                    point_path.splice(i, 1);
                    continue;
                }
            }
            if (port_flow[j].id == point_path[i]) {
                path_info[path_info.length] = port_flow[j];
                num_port++;
            }
        }
        if (num_port == point_path.length) break;
    }

    // do as different mode
    if (mode_num == 1) {
        mid_valve = [12, 13, 14, 15, 16];
        for (var i = 0; i < point_path.length; i++) {
            var p = outlet_port.indexOf(point_path[i]);
            if (p != -1) pump_block[Math.floor(p / 2)] = 0;
        }
    } else if (mode_num == 2) {
        for (var i = 0; i < last_outport.length; i++) {
            var index = outlet_port.indexOf(last_outport[i]);
            if (index != -1) {
                pump_block[Math.floor(index / 2)] = 0;
                chamber_valve[Math.floor(index / 2)] = 0;
            }
        }
    } else if (mode_num == 3) {
        mid_valve = [12, 13, 14, 15, 16];
    } else if (mode_num == 4) {
        mid_valve = [0, 0, 0, 0, 0]
    } else if (mode_num == 5) {
        mid_valve = [12, 13, 14, 15, 16];
    } else if (mode_num == 6) {
        mid_valve = [12, 13, 14, 15, 16];
    } else if (mode_num == 7) {
        block_valve = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        chamber_valve = [0, 0, 0, 0];
        pump_block = [0, 0, 0, 0];
    }
	
    num_port = 0;
    for (var j = 0; j < channel_flow.length; j++) {
		// find why here change type??????? after mode 2
        if (mode_num == 5 && (channel_flow[j].type == "Pump3D" || channel_flow[j].type == "Pump3D_control")) {

            for (var i = 0; i < point_path.length; i++) {
                var index = outlet_port.indexOf(point_path[i]);
                console.log(index, pump_block[Math.floor(index / 2)], channel_flow[j].id);

				// find the relative pump
                if (index != -1 && pump_block[Math.floor(index / 2)] == channel_flow[j].id) {
                    pump_block[Math.floor(index / 2)] = 0;
                    path_info[path_info.length] = channel_flow[j];
                    channel_flow[j] = [];
                }
            }
        }
        if (channel_flow[j].type == "RoundedChannel") {
            for (var i = 0; i < point_path.length; i++) {
                {
                    if (channel_flow[j].length == 0) continue;
                    if ((channel_flow[j].start[0] == path_info[i].position[0] && channel_flow[j].start[1] == path_info[i].position[1])
                        || (channel_flow[j].end[0] == path_info[i].position[0] && channel_flow[j].end[1] == path_info[i].position[1])) {
                        path_info[path_info.length] = channel_flow[j];
                        channel_flow[j] = [];
                        num_port++;
                    }
                }
            }
        }
        if (num_port == point_path.length) break;
    }
    // search flow path
    path_ctrl_info = searchPath(path_info,channel_flow,block_valve,via_valve,mid_valve,chamber_valve,pump_block,num_port, 1,mode_num);
    if (level == 1 || level ==3) {
        // find first paths
        draw_bk(ctx, path_info, 1, "blue", "red");
    }

    // search control path
    if (level == 2 || level ==3){

        path_ctrl_info = searchPath(path_ctrl_info,ctrl_channel,[],[],[],[],[],0,2,mode_num);
        draw_bk(ctx, path_ctrl_info, 2, "blue", "red");
        index_ctrl_port = [] // used to save index of control ports
        for (var i=0; i<path_ctrl_info.length;i++){
            if (path_ctrl_info[i].type == "Port") index_ctrl_port[index_ctrl_port.length] = path_ctrl_info[i].id;
        }
    }
	
}
