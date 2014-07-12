/*******************清空上一次内容******************/
$('body')[0].innerHTML='';
if (timer) window.clearInterval(timer);

/*******************添加canvas**********************/
var width=document.documentElement.clientWidth;
var height=document.documentElement.clientHeight;
$('body').prepend('<canvas id="canv" style="position:absolute;left:0px;top:0px;" width='+width+'px height='+height+'px>请换个浏览器。。</canvas>');
var cv=$('#canv')[0].getContext('2d');

/*******************隐藏鼠标************************/
$('html').css({cursor:'none'});

/*******************全局变量&常量声明***************/
var mx=-20,my=-20;//鼠标位置
var items={};
var bg=cv.createLinearGradient(0,0,0,height);bg.addColorStop(0,'#cbebdb');bg.addColorStop(1,'#55a5c5');//背景渐变色
var pl={x:-20,y:-20,vx:0,vy:0,ax:0,ay:0,arc:0};
var plSize=16;//飞机大小
var cursorSize=6;//指针大小
var u1=5,u2=90;//控制飞机运动的两个阻尼参数
var fps=100;

/*******************各个绘图函数********************/
function drawBG()//画背景
{
	cv.save();
	cv.fillStyle=bg;
	cv.fillRect(0,0,width,height);
	cv.restore();
}

function drawCursor()//画鼠标十字
{
	cv.save();
	cv.beginPath();
	cv.lineWidth=1;
	cv.strokeStyle='#000';
	cv.shadowOffsetX = 2;
	cv.shadowOffsetY = 2;
	cv.shadowBlur = 2;
	cv.shadowColor='#888';
	var u=cursorSize;
	cv.moveTo(mx-u,my);
	cv.lineTo(mx+u,my);
	cv.moveTo(mx,my-u);
	cv.lineTo(mx,my+u);
	cv.stroke(); 
	cv.restore();
}

function drawPlane()//画操纵的飞机
{
	cv.save();
	cv.fillStyle='blue';
	cv.strokeStyle='blue';
	cv.beginPath();
	cv.lineWidth=1;
	var a=pl.arc;
	var x=pl.x;
	var y=pl.y;
	var r=plSize;
	var arc=pl.arc;
	var pp=[
		{x:x+r*Math.cos(arc),y:y+r*Math.sin(arc)},
		{x:x+r*Math.cos(arc+165/180*Math.PI),y:y+r*Math.sin(arc+165/180*Math.PI)},
		{x:x-r*Math.cos(arc)/2,y:y-r*Math.sin(arc)/2},
		{x:x+r*Math.cos(arc+195/180*Math.PI),y:y+r*Math.sin(arc+195/180*Math.PI)},
		{x:x+r*Math.cos(arc),y:y+r*Math.sin(arc)}
	];
	for (var i=0;i<4;i++)
	{
		cv.moveTo(pp[i].x,pp[i].y);
		cv.lineTo(pp[i+1].x,pp[i+1].y);
	}
	cv.closePath();
	cv.stroke();
	cv.fill();
	cv.restore();
}

function drawOneBall(x,y,r,fillStyle)//画个球!
{
	cv.save();
	cv.beginPath();
    cv.fillStyle = fillStyle;
    cv.arc(x, y, r, 0, Math.PI*2, true); 
    cv.closePath();
    cv.fill();
    cv.restore();
}

/*********************位置变化计算**************************/
function dis2(x1,y1,x2,y2)
{
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

function planeMove()
{
	var dd=dis2(mx,my,pl.x,pl.y);
	pl.ax=(mx-(pl.x+plSize*Math.cos(pl.arc)))-pl.vx/u1;
	pl.ay=(my-(pl.y+plSize*Math.sin(pl.arc)))-pl.vy/u1;
	var vv=dis2(pl.vx,pl.vy,0,0);
	if (dd>plSize*plSize){
		pl.x+=pl.vx/u2;
		pl.y+=pl.vy/u2;
	}
	pl.vx+=pl.ax;
	pl.vy+=pl.ay;
	//        下面这个复杂的语句用于判断是否适合调整角度
	//细节: 当鼠标距离飞机中心不超过一倍半径时，飞机位置不改变
	//                        不超过二倍半径时，飞机机头方向为中心指向鼠标方向
	//                        超过二倍半径时，机头方向为速度方向
	//      这样做可以使机头稳定不乱晃
	var arc1=Math.atan2(pl.vx,-pl.vy)-Math.PI/2;
	pl.arc=(vv>10&&Math.abs(arc1-pl.arc)<dd/plSize/plSize)?arc1:pl.arc;
	if (dd<2*plSize*plSize) pl.arc=Math.atan2((mx-pl.x),-(my-pl.y))-Math.PI/2;
}

/*********************设置绘图时钟周期**********************/
var timer=setInterval(function() {
    drawBG();
    drawCursor();
    planeMove();
    drawPlane();
    cv.fillText('x:'+Math.round(pl.x)+' y:'+Math.round(pl.y)+' vx:'+Math.round(pl.vx)+' vy:'+Math.round(pl.vy)+' ax:'+Math.round(pl.ax)+' ay:'+Math.round(pl.ay)+' arc:'+Math.round(pl.arc*180/Math.PI),100,100);
}, 1000/fps);//100fps

/*********************获取鼠标位置**************************/
document.addEventListener('mousemove',function(e)
{
	mx=e.x;
	my=e.y;
}
);


/*
function ballMove(pos,r,fillStyle,period)
{
	var i=0;
	var timer0=setInterval(function()
	{
		drawBG();
		ball(pos(i).x,pos(i).y,r,fillStyle);
	},10);
}
*/
/*
    for (i=0;i<1000;i++)
    {
    	if (pos[i]==undefined)
    		pos.push({
    			x:0,//width/2,
    			y:0,//height/2,
    			size:2+4*Math.random(),
    			color:'#'+(Math.random()>0.5?'f':'e')+(Math.random()>0.5?'f':'e')+(Math.random()>0.5?'f':'f')
    		});//*Math.random(),y:height*Math.random()});
    	pos[i].x+=(8-pos[i].size)*Math.random()-(8-pos[i].size)/2;
    	pos[i].y+=(8-pos[i].size)*Math.random()-(8-pos[i].size)/2;
    	ball(posX+pos[i].x,posY+pos[i].y,pos[i].size,pos[i].color);
	}*/
