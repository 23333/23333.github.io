/*******************清空上一次内容******************/
$('body')[0].innerHTML='';
if (timer) window.clearInterval(timer);//如果有的话
	
/*******************添加canvas**********************/
var width=document.documentElement.clientWidth;//屏幕宽度高度
var height=document.documentElement.clientHeight;
$('body').prepend('<canvas id="canv" tabindex="0" style="position:absolute;left:0px;top:0px;" width='+width+'px height='+height+'px>请更换浏览器</canvas>');//添加canvas
var cv=$('#canv')[0].getContext('2d');//画笔

/*******************数学计算函数********************/
var cos=Math.cos, 
	sin=Math.sin, 
	random=Math.random, 
	PI=Math.PI,
	abs=Math.abs, 
	atan2=Math.atan2, 
	round=Math.round, 
	floor=Math.floor, 
	sqrt=Math.sqrt;

function cube(x)//平方
{
	return x*x;
}

function rad(d)//角度-->弧度
{
	return d/180*PI;
}

function xy(u)//转极坐标为直角坐标
{
	return {x:u.r*cos(u.t), y:u.r*sin(u.t)};
}

function dis2(x1,y1,x2,y2)//距离的平方
{
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
}

function ran(a,b)//生成[a, b)的随机实数
{
	return a+(b-a)*random();
}

function ranInt(a,b)//生成[a, b]的随机整数
{
	return floor(a+(b-a+1)*random());
}

function min(a,b)
{
	return a>b?b:a;
}

function max(a,b)
{
	return a>b?a:b;
}

function hsvToRgb(h,s,v)//hsv转rgb
{
	var hi = floor(h/60);
	var f = h/60-hi;
	var u = floor(255*v);
	var p = floor(255*v*(1-s));
	var q = floor(255*v*(1-f*s));
	var t = floor(255*v*(1-(1-f)*s));
	var res=[
		{r:u,g:t,b:p},
		{r:q,g:u,b:p},
		{r:p,g:u,b:t},
		{r:p,g:q,b:u},
		{r:t,g:p,b:u},
		{r:u,g:p,b:q}
	];
	return res[hi];
}
	
/*********************全局变量***********************/

var timer=null;
var fps=60;//帧数
var n=25;//每个边的方块数
var areaSizeRatio=0.85;//画图区域大小系数
var areaSize=height*areaSizeRatio;//画图区域大小
var bgColorTimer=0;//用于周期改变背景色
var clock=0;
var startBgColor=ranInt(0,359);//同上
var bg;//背景色
var nMax=n;//n曾经达到的最大值
var speed=15;//切换速度

var mx=-1,my=-1;//刚刚改变的方块的坐标
var mouseDowned=false;//鼠标当前是否按下

var backgroundColor=cv.createLinearGradient(0,0,width,height);
backgroundColor.addColorStop(0,"#ff0");
backgroundColor.addColorStop(1,"#f00");//设置背景渐变色

var rects=[];//方块们(0表示没有细胞，1表示有)
function oneRowOfRect(){ var r=[]; for (var i=0;i<n;i++) r.push(0); return r;}
for (i=0;i<n;i++) rects.push(oneRowOfRect());//初始化rects数组，使之全部为0;
var rectsOld=[];
for (i=0;i<n;i++) rectsOld.push(oneRowOfRect());

rects=[//Life Game
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var pausing=true;

/*********************绘图函数***********************/

function drawBG()//画背景
{
	if (bgColorTimer%5==0)//变色
	{
		var b=hsvToRgb((startBgColor+bgColorTimer/5)%360,0.14,0.92);//上方低饱和度颜色
		var c=hsvToRgb((startBgColor+bgColorTimer/5)%360,0.57,0.77);//下方高饱和度颜色
		bg=cv.createLinearGradient(0,0,width,height);
		bg.addColorStop(0,'rgb('+b.r+','+b.g+','+b.b+')');
		bg.addColorStop(1,'rgb('+c.r+','+c.g+','+c.b+')');
	}
	cv.save();
	cv.fillStyle=bg;
	cv.fillRect(0,0,width,height);
	cv.restore();
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {//不用管这个函数(画圆角矩形用)
	if (w < 2 * r) r = w / 2;
	if (h < 2 * r) r = h / 2;
	this.beginPath();
	this.moveTo(x+r, y);
	this.arcTo(x+w, y, x+w, y+h, r);
	this.arcTo(x+w, y+h, x, y+h, r);
	this.arcTo(x, y+h, x, y, r);
	this.arcTo(x, y, x+w, y, r);
	this.closePath();
	return this;
}

function drawRoundrect(x,y,r,color)//画一个圆角矩形。参数: 中心点坐标，半径(正方形边长的一半)
{
	cv.save();
	cv.fillStyle=color;
	cv.roundRect(x-r,y-r,2*r,2*r,r/3).fill();
	cv.restore();
}

function drawRects()//画全局变量rects里面的方块
{
	var rectSize=areaSize/n;//每个方块所占区域的边长
	for (var i=0;i<n;i++)
	{	
		for (var j=0;j<n;j++)
		{
			var u=rects[i][j];
			var v=rectsOld[i][j];
			//if (u==1) continue;//如果这时u的位置有细胞，就涂黑，否则上色
			var x=i;
			var y=j;
			var center={x:width/3-rectSize*(n/2-0.5-x),y:height/2-rectSize*(n/2-0.5-y)};
			var t=sin(-x/2-y/4+clock/16);//让它周期变形。。。
			var s=sin(-x/2-y/4+bgColorTimer/16);
			drawRoundrect(center.x+(u==1?s:t)*max(2,areaSize/n/20),center.y+(u==1?s:t)*max(2,areaSize/n/15),rectSize*0.45*(1+0.08*(u==1?s:t)*u),u==1?("rgba(255,255,255,"+(v==1?0.8:0.6)+")"):"rgba(255,255,255,"+(v==1?0.2:0.08)+")");
		}
	}
}

function writeInstructions() {
	cv.fillStyle = "rgba(255, 255, 255, 0.8)";

	cv.font = "bold 50px Courier New";
	cv.fillText('LIFE GAME', 0.64*width, 0.18*height);

	cv.font = "bold 20px Microsoft Yahei";
	cv.fillText('游戏操作说明：', 0.6*width, 0.27*height);
	cv.fillText('游戏目前状态：', 0.6*width, 0.7*height);

	cv.font = "15px Microsoft Yahei";
	cv.fillText('鼠标点击/拖动: 改变细胞生死状态', 0.6*width, 0.32*height);
	cv.fillText('空格: 开始/暂停', 0.6*width, 0.37*height);
	cv.fillText('↑/↓: 增加/减少格子数目', 0.6*width, 0.42*height);
	cv.fillText('←/→: 减慢/加快变化速度', 0.6*width, 0.47*height);
	cv.fillText('R: 重置', 0.6*width, 0.52*height);
	cv.fillText('Enter: 随机生成', 0.6*width, 0.57*height);
	cv.fillText('F5: 刷新', 0.6*width, 0.62*height);
	cv.fillText('格子数：'+n+'*'+n+'='+n*n+'个', 0.6*width, 0.75*height);
	var count=cellCount();
	cv.fillText('存活细胞数：'+count, 0.6*width,0.8*height);
	cv.fillText('细胞存活比：'+floor(count/n/n*10000)/100+' %',0.6*width,0.85*height);
	cv.fillText('变化速度：'+(pausing?'PAUSE':floor(6000/speed)/100), 0.6*width, 0.9*height);

}

/*********************绘图时钟***********************/
function clockStart(){
	timer=setInterval(function() {
		drawBG();
		drawRects();
		writeInstructions();
		if (clock%speed==0&&!pausing) 
			lifeChange();
		if (!pausing) clock++;
		bgColorTimer++;
	}, 1000/fps);//fps
}
clockStart();

/*********************事件监听**************************/
document.addEventListener('mousemove',function(e)//鼠标移动
{
	if (mouseDowned)
		changeTargetRect(e.x,e.y);
});

document.addEventListener('click',function(e)//鼠标单击
{
	changeTargetRect(e.x,e.y);
	mx=my=-1;
});

document.addEventListener('mousedown',function(e)//鼠标按下，配合鼠标移动用
{
	mouseDowned=true;
});

document.addEventListener('mouseup',function(e)//鼠标抬起，配合鼠标移动用
{
	mouseDowned=false;
});

document.addEventListener('keydown',function(e)//按下键盘
{
	switch(e.keyCode)
	{
	case 32:pausing^=true;break;//if (pausing) pausing=false;else pausing=true;
	case 38:incN();break;
	case 40:decN();break;
	case 13:randomRects();break;
	case 82:resetRects();break;
	case 37:speedDown();break;
	case 39:speedUp();break;
	}
	//console.log(speed);
});

function speedUp()
{
	if (speed<=1) {speed=1;return;}
	speed-=1+floor(speed/15);
}

function speedDown()
{
	speed+=1+floor(speed/15);
}

function randomRects()//随机分布细胞状态
{
	for (var i=0;i<n;i++)
		for (var j=0;j<n;j++)
		{
			rects[i][j]=ranInt(0,1);
			rectsOld[i][j]=0;
		}
}

function resetRects()//置零
{
	for (var i=0;i<n;i++)
		for (var j=0;j<n;j++)
		{
			rects[i][j]=0;
			rectsOld[i][j]=0;
		}
}

/*window.onmousewheel=document.onmousewheel=function(e)
{
	if (e.wheelDeltaY>0)
	{
		incN();
	}
	if (e.wheelDeltaY<0)
	{
		decN();
	}
}*/

function incN()//n++
{
	n++;
	for (var i=0;i<n-1;i++) 
	{
		rects[i][n-1]=0;
		rectsOld[i][n-1]=0;
	}
	if (n>nMax) 
	{
		rects.push(oneRowOfRect());
		rectsOld.push(oneRowOfRect());
		nMax=n;
	}
	else
	{
		for (var i=0;i<n;i++) 
		{
			rects[n-1][i]=0;
			rectsOld[n-1][i]=0;
		}
	}
}

function decN()//n--
{
	if (n>1)
		n--;
}

function changeTargetRect(x,y,t)//输入鼠标所处x、y坐标，计算并改变对应方块的状态。
{
	x-=width/3-areaSize/2;
	y-=height/2-areaSize/2;
	x/=areaSize/n;
	y/=areaSize/n;
	x=floor(x);
	y=floor(y);
	if (mx==x&&my==y) return;
	mx=x;
	my=y;
	if (x<n&&y<n&&x>=0&&y>=0)
	{
		rects[x][y]^=1;
	}
}

/*********************细胞变化**********************/
function lifeChange()//改变一次rects数组
{
	var newRects = [];
	for (i=0;i<n;i++) newRects.push(oneRowOfRect());//初始化rects数组，使之全部为0;
	for (var i = 0; i < n; i++)
	{
		for (var j = 0; j < n; j++)
		{	
			newRects[i][j] = cellChange(i, j);
		}
	}
	for (var i=0;i<n;i++)
		for (var j=0;j<n;j++)
		{
			rectsOld[i][j]=rects[i][j];
			rects[i][j] = newRects[i][j];
		}
}

function cellChange(x, y) {//输入xy坐标，返回下一时刻该位置细胞状态
	var sum = 0;
	var xl = (x - 1 + n) % n;
	var xr = (x + 1) % n;
	var yl = (y - 1 + n) % n;
	var yr = (y + 1) % n;
	//sum值代表该细胞周围的活细胞数
	sum = rects[xl][yl] + rects[xl][y] + rects[xl][yr] + rects[x][yl] + rects[x][yr] + rects[xr][yl] + rects[xr][y] + rects[xr][yr];	
	return sum==2?rects[x][y]:(sum==3?1:0);
}

function cellCount()
{
	var sum=0;
	for (var i = 0; i < n; i++)
	{
		for (var j = 0; j < n; j++)
		{
			sum+=rects[i][j];
		}
	}
	return sum;
}
