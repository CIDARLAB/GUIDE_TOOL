// hide and display when we want them to do that
var flag_after_clean=0;
var isHide = [false,false, true, true, true, true];
var s = "step";
var step = 1;
var mode_num = 0, flag_points_clean = 1;
var flag_inlet = 0, flag_outlet = 0;
var close_ports=[];
var flag_check = 0;
var solenoid_set = [];
function hide(){
	var content=document.getElementById(s+step);
	console.log(s+step);
	if (isHide[step]) {
		content.style.display='';
	}else{
		content.style.display='none';
	}
	isHide[step]=!isHide[step];
}
// dynamicly analyse what is newly removed or added from/to open sets
function port_merge_split(a, b){
	var d=[];
	var b_left = [], a_left=[],keep_open=[],keep_close=[];

	for (let element of a){
		if (b.indexOf(element)<0) a_left[a_left.length] = element;
		else keep_open[keep_open.length] = element;
	}
	for (let element of b){
		if (keep_open.indexOf(element)<0) b_left[b_left.length] = element;
	}
	d[d.length] = keep_open;
	d[d.length] = b_left;
	d[d.length] = a_left;
	
	return d;
}
function union_merge(a){
	var c=[];
	var k =0;
	var la = a.length;
	while(k<la){
		if (k==0) {
			d = port_merge_split(a[0],a[1]);
			console.log(d.slice(0));
			var i =0;
			while (i < d.length){
				if ( d[i].length>0 && c.indexOf(d[i]) < 0) c.push(d[i])
				i++;
			}
			k++;
		}
		else{
			
			var lc =c.length;
			var a_left = a[k];
			console.log(c.slice(0));
			// split a[k] using current c
			for (var j=0;j< lc;j++){
				if (a_left.length<=0) break;
				var d = [];
				if (k==3) console.log(c[j].slice(0));
				if (c[j].length>0){
					d = port_merge_split(a_left,c[j])
					a_left = d[d.length-1];
					c.splice(j,1);
					j--;
					lc--;
					var i = 0;
					// don't scan the a_left in d.
					while (i < d.length-1){
						if ( d[i].length>0 && c.indexOf(d[i]) < 0) c.push(d[i]);
						i++;
					}
				}
				if (k==3) console.log(j,d.slice(0));
			}
			if (a_left.length>0) c.push(a_left);
		}
		
		k++;
	}
	if (mode_a.indexOf(5)>=0) {
		var lc = c.length;
		for (var i =0; i<lc; i++){
			console.log(c[i]);
			if (c[i].indexOf(10)>=0){
				console.log(i,c[i]);
				var index = c[i].indexOf(10);
				c[i].splice(index,1);
				index = c[i].indexOf(11);
				c[i].splice(index,1);
				index = c[i].indexOf(12);
				c[i].splice(index,1);
				if (c[i].length == 0) c.splice(i,1);
				c.push([10],[11],[12]);
				break;
			}
		}
	}
	var i = 1;
	close_ports = [];
	while (i<=port_c.length) {
		var j = 0;
		var flag = 0;
		for (let ci of c){
			if (ci.indexOf(i)>=0){
				flag = 1;
				break;
			}
		}
		if (flag == 0) close_ports[close_ports.length] = i;
		i++;
	}
	c.push(close_ports);
	console.log(c);
	return c;
}

function on_off(c,port_choose){
	var switch_s = []
	for (var i=0; i<c.length; i++){
		if ( port_choose.indexOf(c[i][0]) >=0 ) switch_s[switch_s.length] = "on";
		else switch_s[switch_s.length] = "off";
	}
	console.log(switch_s);
	return switch_s;
}

function show_prepare(step){
	var content=document.getElementById("next");
	
	if (step>=5 && flag_check==1){
		content.style.display='none';
		for (var j=0;j<solenoids_each_mode.length;j++){
			var a = [];
			var i = 1;
			while (i<=elements_num[5]){
				if (solenoids_each_mode[j].indexOf(i)<0) a[a.length] = i;
				i++;
			}
			console.log(a);
			var new_tr = document.createElement("tr");
			new_tr.innerHTML = "<td> <h5 id='situation-"+j+"'>"+mode_a[j]+"</h5> </td>  <td> <h5 id='open-"+j+"'> "+solenoids_each_mode[j]+
			"</h5> </td> <td> <h5 id='close-"+j+"'> "+a+"</h5> </td>"
			document.getElementById("tb5").appendChild(new_tr);
		}
		// c is the sets of solenoids sets
		console.log(solenoids_each_mode);
		var c = union_merge(solenoids_each_mode.slice(0));
		solenoid_set = c.slice(0);
		var switch_s = on_off(c,solenoids_each_mode[solenoids_each_mode.length-1]);
		for (var i=1; i<=c.length; i++){
			var new_tr = document.createElement("tr");
			new_tr.innerHTML = "<td> <h5 id='solenoid-id-"+i+"'>"+"solenoid"+i+"</h5> </td> <td> <h4 id='port5-2-"+i+"'> "+c[i-1]+ "</h4> </td>"
			document.getElementById("tb5-2").appendChild(new_tr);
		}
		for (var i=1; i<=c.length; i++){
			var new_tr = document.createElement("tr");
			new_tr.innerHTML = "<td> <h5 id='solenoid-sample-"+i+"'>"+"solenoid"+i+"</h5> </td> <td> <h4 id='port5-3-"+i+"'> "+switch_s[i-1]+ "</h4> </td>"
			document.getElementById("tb5-3").appendChild(new_tr);
		}
		flag_check=0;
	}else{
		content.style.display='';
	}
	if (step==2){
		
		document.getElementById("num1").innerHTML = elements_num[0];
		document.getElementById("num2").innerHTML = elements_num[1];
		document.getElementById("num3").innerHTML = elements_num[2];
		document.getElementById("num4").innerHTML = elements_num[3];
		document.getElementById("num5").innerHTML = elements_num[4];
		document.getElementById("num6").innerHTML = elements_num[5];
		document.getElementById("num7").innerHTML = elements_num[6];
		document.getElementById("num8").innerHTML = elements_num[7];
	}
	if (step ==3){
		refresh();
	}
}

function next_show(){
	step++;
	show_prepare(step);
	if (step ==4){
		refresh();
		color_points(1);
	}
	hide();
}
function show(i){
	step = i;
	show_prepare(step);
	if (step==4){
		if (flag_inlet==0 || flag_outlet==0){
			refresh();
			color_points(1);
		}
	}
	hide();
}

function color_points(i){
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	draw_bk(ctx, flow_info,1,"white","white");
	draw_bk(ctx, ctrl_info,2,"white","white");
	switch(i){
		case 1: draw_bk(ctx,port,1,"blue","red"); break;
		case 2: draw_bk(ctx,pump,1,"blue","red"); break;
		case 3: draw_bk(ctx,valve,1,"blue","red"); break;
		case 4: draw_bk(ctx,via,1,"blue","red"); break;
		case 5: draw_bk(ctx,chamber,1,"blue","red"); break;
		case 6: draw_bk(ctx,port_c,2,"blue","red"); break;
		case 7: draw_bk(ctx,pump_c,2,"blue","red"); break;
		case 8: draw_bk(ctx,valve_c,2,"blue","red"); break;
	}
}
function refresh(f=1){
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	draw_bk(ctx, flow_info,1,"white","white");
	draw_bk(ctx, ctrl_info,2,"white","white");
	flag_points_clean = 1;
	if (f==1) {
		point_path = [];
		var obj = document.getElementById("tb4-1");
		obj.innerHTML = "";
	}
	mode_color_3(8);
	if (step==4) color_points(1);
}

function add_row(){
	console.log(point_new);
	if (point_new == 0) return;
	var l =point_path.length;
	var obj = document.createElement("tr");
	obj.id = point_path[l-1];
	obj.innerHTML = "<td> <h4 id='num_id'"+l+">"+point_path[l-1]+"</h4> </td> <td> <input type='text' class='input' id='media'"+l+"> </td> <td> <button class='mode' id='remove4-"+l+
	"' onclick='remove_point_tr(this)'>Del</button> </td>";
	document.getElementById("tb4-1").appendChild(obj);
}

function check_lets(f =0){
	
	flag_check = 1;
	if (f==1){
		var i = 0;
		while (i<mode_new.length){
			mode_num = mode_new[i];
			var k = check_let(mode_num);
			if (k==1) {
				mode_new = [];
				mode_a = [];
				break;
			}
			i++;
		}
		flag_inlet = 0;
		flag_outlet = 0;
	}else check_let(mode_num);
	if (f==2 && flag_inlet==1 && flag_outlet==1 ) newCanvas(mode_num);
}

function check_let(mode_num){
	if (mode_num==5 || mode_num==4 || mode_num==2 || mode_num==7) {
		flag_inlet = 1;
		flag_outlet = 1;
		return;
	}
	if (point_path.length!=0){
		for (let i of point_path){
			if (i<=17) flag_inlet = 1;
			else flag_outlet =1;
		}
		if (flag_inlet == 0) {
			alert("no inlet");
			refresh(0);
			return 1;
		}
		else if (flag_outlet == 0){
			alert("no outlet");
			refresh(0);
			return 1;
		}
	}
	else {
		alert("no point chosen");
		refresh(0);
		return 1;
	}
	return 0;
}
