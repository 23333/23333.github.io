/*******************清空上一次内容******************/
	$('body')[0].innerHTML='<audio id="music" src="music/PilgrimsOnALongJourney.mp3" autoplay="autoplay" loop="loop"></audio>';
	if (timer) window.clearInterval(timer);

/*******************添加canvas**********************/
	var width=document.documentElement.clientWidth;
	var height=document.documentElement.clientHeight;
	$('body').prepend('<canvas id="canv" tabindex="0" style="position:absolute;left:0px;top:0px;" width='+width+'px height='+height+'px>请换个浏览器。。</canvas>');
	var cv=$('#canv')[0].getContext('2d');

/*******************数学计算函数********************/
	var cos=Math.cos, sin=Math.sin, random=Math.random, PI=Math.PI, abs=Math.abs, atan2=Math.atan2, round=Math.round, floor=Math.floor, sqrt=Math.sqrt;
	
	function cube(x)
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

/*******************strings*************************/
	var _gamename='NEVER SEA';
	var _instructions='INSTROCTIONS';
	var _about='ABOUT';
	var _startgame='START GAME';
	var _pause='PAUSE';
	var _continue='CONTINUE';
	var _scoreis='YOUR SCORE IS: ';
	var _life='剩余生命: ';
	var _wudi='无敌';
	var _jiansu='减速';
	var _qingping='清屏';
	var _1up='1 UP';
	var _bianxiao='变小';
	
/*******************全局变量&常量声明***************/
	var mx,my,bg,pl,plSize,cursorSize,ballSize,bigBallSize,bSize,butterflySize,starSize,d1,d2,d3,t1,t2,score,u1,u2,
		fps,planeShape,butterflyLine,butterflyShape,diamondShape,Star_6,balls,bigBalls,butterflys,stars,diamonds,ballSpeed,
		bigBallSpeed,butterflySpeed,starSpeed,ballDensity,bigBallDensity,butterflyDensity,diamondDensity,ballStyle,instructionsContent,aboutContent,
		clock,died,level,judge,startBgColor=ranInt(0,359),bgColorTimer=0,life,wudi,wudiTimer,smallTimer,slowTimer,info,timer,flash,pause,pauseTimes;
		
	function prepossessing()
	{
		mx=width/7,my=height/2;//鼠标位置
		bg;//=cv.createLinearGradient(0,0,0,height);//bg.addColorStop(0,'#cbebdb');bg.addColorStop(1,'#55a5c5');//背景渐变色
		pl={x:width/9,y:height/2,vx:0,vy:0,ax:0,ay:0,arc:0};//飞机的初始运动参数
		plSize=20;//飞机大小
		cursorSize=6;//指针大小
		ballSize=4;
		bigBallSize=40;
		bSize=10;//蝴蝶判定点大小
		butterflySize=bSize-2;
		starSize=6;
		d1 = 25;d2 = d1/25*30;d3 = d1/25*27;t1 = 20;t2 = 40;//diamond大小的几个参数
		score=0;
		u1=6,u2=80;//控制飞机运动的两个阻尼参数, u1:越大表示加速度受速度的负影响越大 u2:越大表示速度越慢
		fps=60;//帧率
		//var planeShape=[{r:plSize,t:0},{r:plSize,t:rad(165)},{r:plSize/2,t:rad(180)},{r:plSize,t:rad(195)}];//飞机的极坐标数组
		planeShape=[{r:plSize*1,t:PI+3.14},{r:plSize*0.716,t:PI+-2.98},{r:plSize*0.443,t:PI+-2.49},{r:plSize*0.443,t:PI-0.65},{r:plSize*0.716,t:PI-0.25},{r:plSize*1,t:PI+0},//{r:plSize*1.692,t:PI+-0.11},{r:plSize*1.692,t:PI+0.11},
		{r:plSize*1,t:PI+0},{r:plSize*0.716,t:PI+0.25},{r:plSize*0.443,t:PI+0.65},{r:plSize*0.443,t:PI+2.49},{r:plSize*0.716,t:PI+2.98}];
		butterflyLine=[/*{r:2.4,t:rad(130)},{r:2.5,t:rad(140)},{r:2.5,t:rad(220)},{r:2.4,t:rad(230)},*/{r:3,t:rad(15)},{r:3,t:rad(345)}];//蝴蝶身上的线的极坐标
		butterflyShape=[{r:1,t:0},{r:2.7,t:rad(35)},{r:3.5,t:rad(45)},{r:3.2,t:rad(55)},{r:2.33,t:rad(95)},{r:1,t:rad(90)},{r:2,t:rad(120)},{r:2.1,t:rad(150)},{r:1,t:rad(180)},
						{r:2.1,t:rad(210)},{r:2,t:rad(240)},{r:1,t:rad(270)},{r:2.33,t:rad(265)},{r:3.2,t:rad(305)},{r:3.5,t:rad(315)},{r:2.7,t:rad(325)}];
		diamondShape = [{r:d1,t:PI+rad(90+t1+t2/2)},{r:d2,t:PI+rad(90+t2/2)},{r:d2,t:PI+rad(90-t2/2)},{r:d1,t:PI+rad(90-t1-t2/2)},{r:0,t:PI}];
		Star_6 = [{r:starSize,t:rad(90)},{r:starSize/2*1.5,t:rad(60)},{r:starSize,t:rad(30)},{r:starSize/2*1.5,t:rad(0)},{r:starSize,t:rad(-30)},{r:starSize/2*1.5,t:rad(-60)},{r:starSize,t:rad(-90)},
				{r:starSize/2*1.5,t:rad(-120)},{r:starSize,t:rad(-150)},{r:starSize/2*1.5,t:rad(-180)},{r:starSize,t:rad(-210)},{r:starSize/2*1.5,t:rad(-240)}];
		for (var i in butterflyShape) butterflyShape[i].r*=bSize;
		balls=[];         //以下四个存储画面中的炮弹
		bigBalls=[];
		butterflys=[];
		stars=[];
		diamonds=[];
		ballSpeed=4.2;
		bigBallSpeed=3.8;
		butterflySpeed=0.35;
		starSpeed=6;
		ballDensity=0.5;//每一帧新产生一个ball的概率
		bigBallDensity=0.08;//每一帧新产生一个泡泡的概率
		butterflyDensity=5;//每次每边产生蝴蝶个数
		starDensity=8;//每8个时钟产生一个
		diamondDensity=0.0012;//宝石掉落几率
		ballStyle='#eef';
		clock=0;
		died=false;
		level=0;
		judge={
		ball:cube(plSize/4+ballSize),
		bigBall:cube(plSize/4+bigBallSize),
			butterfly:cube(plSize/4+butterflySize),
			star:cube(plSize/4+starSize),
			diamond:cube(plSize/4+15)
		};
		life=5;
		wudi=false;
		window.clearTimeout(wudiTimer);
		window.clearTimeout(smallTimer);
		window.clearTimeout(slowTimer);
		flash=0;
		instructionsContent='<b style="font-size:22px;"><p>游戏说明</p></b><p>移动鼠标控制小鱼 躲避飞来的障碍</p><p>吃钻石道具可以随机获得特殊能力</p><p>按空格或回车键可以暂停(^^)/</p>';
		aboutContent='<b style="font-size:22px;"><p>关于</p></b><p>作者①: 周伯威 zhou_bw@yeah.net</p><p>作者②: 林杨湄 linym012@163.com</p><p>Thanks for playing(*´▽｀*)</p>';
		info='';//调试信息
		pause=false;
		pauseTimes=30;//最大暂停次数
	}
	prepossessing();
	drawBG();
	
/*******************开始游戏************************/
	
	$('body').append('<div id="startgame"><div class="title">'+_gamename+
		'</div><div id="instructions">'+_instructions+'</div>'+
		'<div id="about">'+_about+'</div>'+
		'<div id="startbutton" class="button">'+_startgame+'</div></div>');
	$('body').append('<div class="moreinfo" id="left"></div>');
	$('body').append('<div class="moreinfo" id="right"></div>');
	$('body').append('<div class="moreinfo" id="right2"></div>');
	$('#startgame').css('left',width/2-200+'px');
	$('#startgame').css('top',height/2-100+'px');
	$('#left').css('left','20px');
	$('#left').css('width',width/2-240+'px');
	$('#left').css('top',height/2-100+'px');
	$('#right').css('left',width/2+220+'px');
	$('#right').css('width',width/2-240+'px');
	$('#right').css('top',height/2-100+'px');
	$('#right2').css('left',width/2+220+'px');
	$('#right2').css('width',width/2-240+'px');
	$('#right2').css('top',height/2-100+'px');
	addHelpInfo();
	addAboutInfo();
	addRankingInfo();
	
/*******************各个绘图函数********************/
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

	function drawBG()//画背景
	{
		if (bgColorTimer%10==0)//变色
		{
			var b=hsvToRgb((startBgColor+bgColorTimer/10)%360,0.14,0.92);//上方低饱和度颜色
			var c=hsvToRgb((startBgColor+bgColorTimer/10)%360,0.57,0.77);//下方高饱和度颜色
			bg=cv.createLinearGradient(0,0,0,height);
			bg.addColorStop(0,'rgb('+b.r+','+b.g+','+b.b+')');
			bg.addColorStop(1,'rgb('+c.r+','+c.g+','+c.b+')');
		}
		cv.save();
		cv.fillStyle=bg;
		cv.fillRect(0,0,width,height);
		cv.restore();
	}

	function drawItem(p,x,y,d)//创建(而不是画)任意极坐标表示的多边形，p为极坐标的数组, x&y是该图形的基准位置，d为旋转角度。需在外部指定绘图样式
	{
		cv.beginPath();
		var len=p.length;
		cv.moveTo(x+p[0].r*cos(p[0].t+d), y+p[0].r*sin(p[0].t+d));
		for (var i=0;i<len-1;i++)
		{
			cv.lineTo(x+p[i+1].r*cos(p[i+1].t+d), y+p[i+1].r*sin(p[i+1].t+d));
		}
		//cv.moveTo(x+p[len-1].r*cos(p[len-1].t+d), y+p[len-1].r*sin(p[len-1].t+d));
		cv.lineTo(x+p[0].r*cos(p[0].t+d), y+p[0].r*sin(p[0].t+d));
		cv.closePath();
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
		cv.fillStyle='#e44';
		if (wudi&&((clock/4)&1)) cv.fillStyle='rgba(238,68,68,0.15)';
		drawItem(planeShape,pl.x,pl.y,pl.arc);
		cv.fill();
		var tail=8*cos(rad(clock*7));
		var tail0=0.05*cos(rad(clock*7));
		var fishTail = [{r:plSize*1,t:PI+0},{r:(1.67-tail0)*plSize,t:PI+rad(10+tail)},{r:(1.67+tail0)*plSize,t:PI+rad(-10+tail)}];//尾部两点坐标
		drawItem(fishTail,pl.x,pl.y,pl.arc);
		cv.fill();
		cv.beginPath(); 
		cv.arc(pl.x+plSize*0.5*cos(pl.arc), pl.y+plSize*0.5*sin(pl.arc), 0.1*plSize, 0, Math.PI*2, true); 
		cv.fillStyle = "#000000"; 
		cv.closePath();
		cv.fill();
		if (wudi)
		{
			cv.beginPath();
			var bigBallStyle=cv.createRadialGradient(pl.x,pl.y,0,pl.x,pl.y,plSize*1.3);
			bigBallStyle.addColorStop(0,"rgba(255,255,238,0)");
			bigBallStyle.addColorStop(0.84,"rgba(255,255,238,0.1)");
			bigBallStyle.addColorStop(1,"rgba(255,255,238,1)");
			cv.fillStyle=bigBallStyle;
			cv.arc(pl.x,pl.y,plSize*1.3,0,PI*2,true);//泡泡主体
			cv.closePath();
			cv.fill();
		}
		cv.restore();
	}

	function drawOneBall(x,y,r)//画个球!
	{
		cv.save();
		cv.beginPath();
		cv.fillStyle = ballStyle;
		cv.arc(x, y, r, 0, PI*2, true); 
		cv.closePath();
		cv.fill();
		cv.restore();
	}
	
	function drawBalls()
	{
		for (var i in balls)
		{
			drawOneBall(balls[i].pos.x,balls[i].pos.y,balls[i].size);
		}
	}

	function drawBigBallLightCircle(x,y,r)//画大泡泡上面发光的点儿
	{
		cv.save();
		cv.beginPath();
		var bigBallStyle=cv.createRadialGradient(x,y,0,x,y,r);
		bigBallStyle.addColorStop(0,"rgba(255,255,255,1)");
		bigBallStyle.addColorStop(0.8,"rgba(255,255,255,0.23)");
		bigBallStyle.addColorStop(1,"rgba(255,255,255,0)");
		cv.fillStyle=bigBallStyle;
		cv.arc(x,y,r,0,PI*2,true);
		cv.closePath();
		cv.fill();
		cv.restore();
	}

	function drawOneBigBall(x,y,r)//画大泡泡
	{
		cv.save();
		cv.beginPath();
		var bigBallStyle=cv.createRadialGradient(x,y,0,x,y,r);
		bigBallStyle.addColorStop(0,"rgba(238,238,255,0)");
		bigBallStyle.addColorStop(0.84,"rgba(238,238,255,0.1)");
		bigBallStyle.addColorStop(1,"rgba(238,238,255,1)");
		cv.fillStyle=bigBallStyle;
		cv.arc(x,y,r,0,PI*2,true);//泡泡主体
		cv.closePath();
		cv.fill();
		cv.restore();
		drawBigBallLightCircle(x-0.614*r,y-0.2*r,0.17*r);//泡泡上的光斑
		drawBigBallLightCircle(x-0.57*r,y-0.323*r,0.17*r);
		drawBigBallLightCircle(x-0.462*r,y-0.43*r,0.17*r);
		drawBigBallLightCircle(x-0.2*r,y-0.615*r,0.17*r);
		drawBigBallLightCircle(x+0.461*r,y+0.492*r,0.17*r);
		drawBigBallLightCircle(x+0.554*r,y+0.415*r,0.17*r);
	}

	function drawBigBalls()
	{
		for (var i in bigBalls)
		{
			drawOneBigBall(bigBalls[i].pos.x,bigBalls[i].pos.y,bigBalls[i].size);
		}
	}

	function drawOneButterfly(x,y,deg,color)//画蝴蝶
	{
		cv.save();
		cv.strokeStyle='white';
		cv.lineWidth=0.5;
		cv.beginPath();
		for (var i in butterflyLine) 
		{
			cv.moveTo(x,y);
			cv.lineTo(x+butterflyLine[i].r*bSize*cos(butterflyLine[i].t+deg),y+butterflyLine[i].r*bSize*sin(butterflyLine[i].t+deg));
		}
		cv.closePath();
		cv.stroke();
		cv.lineWidth=1;
		cv.fillStyle=color;
		cv.strokeStyle='#fff';
		drawItem(butterflyShape,x,y,deg);
		cv.stroke();
		cv.fill();
		cv.restore();
		var s=ballStyle;
		ballStyle='rgba(119,119,221,0.2)';
		drawOneBall(x,y,bSize);
		ballStyle='rgba(238,238,255,0.8)';
		drawOneBall(x,y,bSize-2);
		ballStyle=s;
	}

	function drawButterflys()
	{
		for (var i in butterflys)
		{
			drawOneButterfly(butterflys[i].x,butterflys[i].y,butterflys[i].deg,butterflys[i].color);
		}
	}
		
	function drawOneStar(x,y,deg)//画星星
	{
		cv.save();
		cv.fillStyle='rgba(255,255,128,0.9)';
		cv.strokeStyle='rgba(250,250,255,0.9)';
		cv.lineWidth=5;
		drawItem(Star_6,x,y,deg);
		cv.stroke();
		cv.fill();
		cv.restore();
	}

	function drawStars()
	{
		for (var i in stars)
		{
			drawOneStar(stars[i].x,stars[i].y,stars[i].deg);
		}
	}
	
	function drawOneDiamond(dia_x,dia_y)//画钻石
	{
		cv.save();
		cv.fillStyle='white';
		//var diamondStyle=cv.createRadialGradient(dia_x-5,dia_y-19,0,dia_x-5,dia_y-19,10);
		//diamondStyle.addColorStop(0,"rgba(255,255,255,0.9)");
		//diamondStyle.addColorStop(1,"rgba(244,244,255,0.9)");
		//cv.fillStyle=diamondStyle;
		cv.strokeStyle='rgba(72,233,236,1)';
		cv.lineWidth=1;
		drawItem(diamondShape,dia_x,dia_y,0);
		cv.stroke();
		cv.fill();
		var diamond_xy = [{},{},{},{},{}];
		cv.beginPath();
		cv.strokeStyle='rgba(72,233,236,1)';
		cv.lineWidth=1;
		for(i = 0; i<diamondShape.length;i++)
			diamond_xy[i] = xy(diamondShape[i]);
		cv.moveTo(dia_x+diamond_xy[0].x,dia_y+diamond_xy[0].y);
		cv.lineTo(dia_x+diamond_xy[3].x,dia_y+diamond_xy[3].y);
		cv.moveTo(dia_x+diamond_xy[2].x,dia_y+diamond_xy[2].y);
		cv.lineTo(dia_x+diamond_xy[4].x,dia_y+diamond_xy[4].y);
		cv.lineTo(dia_x+diamond_xy[1].x,dia_y+diamond_xy[1].y);
		cv.moveTo(dia_x,dia_y+diamond_xy[1].y);
		cv.lineTo(dia_x-d2*cos(t2/2)/2,dia_y+diamond_xy[0].y);
		cv.moveTo(dia_x,dia_y+diamond_xy[1].y);
		cv.lineTo(dia_x+d2*cos(t2/2)/2,dia_y+diamond_xy[0].y);
		cv.stroke();
		cv.restore();
	}
	
	function drawDiamonds()
	{
		for (var i in diamonds)
		{
			drawOneDiamond(diamonds[i].x,diamonds[i].y);
		}
	}
	
/*********************创建子弹******************************/
	function addBall(degree)//一个随机产生的走直线的子弹，参数为角度，默认为向左(PI)
	{
		var d=(degree==undefined?PI:degree);
		var r=sqrt(dis2(width/2,height/2,0,0));
		var t=ran(-r,r);
		var b={size:ran(ballSize,1.3*ballSize),color:'#eef',speed:ballSpeed+ran(0,1),pos:{x:width/2+t*cos(d-PI/2)+r*cos(PI-d),y:height/2+t*sin(d-PI/2)-r*sin(PI-d)},degree:d};
		balls.push(b);
	}

	function addBigBall(degree)//大泡泡，特性与小球相同
	{
		var d=(degree==undefined?PI:degree);
		var r=sqrt(dis2(width/2,height/2,0,0));
		var t=ran(-r,r);
		var b={size:ran(bigBallSize,1.2*bigBallSize),color:'#eef',speed:bigBallSpeed+ran(0,1),pos:{x:width/2+t*cos(d-PI/2)+r*cos(PI-d),y:height/2+t*sin(d-PI/2)-r*sin(PI-d)},degree:d};
		bigBalls.push(b);
	}

	function addButterfly()//蝴蝶，路径为圆弧
	{
		var z=width/butterflyDensity;
		var u=ran(0,z);//随机偏移量
		var r=1.2*height;
		for (var i=0;i<butterflyDensity;i++)
		{
			var c;
			var t=[255,255,255];
			t[c=ranInt(0,2)]=244;
			t[(c+ranInt(1,2))%3]=ranInt(100,244);
			var clr='rgba('+t[0]+','+t[1]+','+t[2]+',0.4)';
			//var clr='rgba('+ranInt(255,255)+','+ranInt(222,255)+','+ranInt(222,255)+',0.4)';
			butterflys.push({x:u+r+i*z,y:r,cx:u+r+i*z,cy:0,r:r,color:clr,rspeed:rad(butterflySpeed-i*0.02),deg:rad(180-i*10),pos:rad(90-i*10)});
		}
		u=ran(0,z);
		for (var i=0;i<butterflyDensity;i++)
		{
			var c;
			var t=[255,255,255];
			t[c=ranInt(0,2)]=244;
			t[(c+ranInt(1,2))%3]=ranInt(100,244);
			//var clr='rgba('+ranInt(255,255)+','+ranInt(222,255)+','+ranInt(222,255)+',0.4)';
			var clr='rgba('+t[0]+','+t[1]+','+t[2]+',0.4)';
			butterflys.push({x:u+r+i*z,y:height-r,cx:u+r+i*z,cy:height,r:r,color:clr,rspeed:-rad(butterflySpeed-i*0.02),deg:rad(180+i*10),pos:rad(270+i*10)});
		}
	}
	
	function addStar()//星星，路径为直线，方向为追踪
	{
		var x=width+50;
		var y=height/2+height*cos(rad(clock)*5)*0.45;
		stars.push({x:x,y:y,deg:ran(0,1),aim:atan2(pl.y-y,pl.x-x)+(clock%3-1)*rad(3),rspeed:ran(rad(-10),rad(10))});
	}
	
	function addDiamond()
	{
		var a=width/10,b=9*a;
		var x=b-(cube(ran(a,b))-a*a)/(b*b-a*a)*(b-a);//使其分布在右侧较为密集
		diamonds.push({x:x,y:-50,speed:ran(1.5,2),func:ranInt(0,5)});
	}

/*********************位置变化计算&碰撞判定********************/
	function ballMove()//根据球的速度，每一帧改变一下各球位置
	{
		for (var i=balls.length-1;i>=0;i--)
		{
			balls[i].pos.x+=balls[i].speed*cos(balls[i].degree);
			balls[i].pos.y+=balls[i].speed*sin(balls[i].degree);
			if (dis2(balls[i].pos.x,balls[i].pos.y,pl.x,pl.y)<judge.ball) kill();
			if (balls[i].pos.x<-50) balls.splice(i,1);//如果超出屏幕就删
		}
	}

	function bigBallMove()
	{
		for (var i=bigBalls.length-1;i>=0;i--)
		{
			bigBalls[i].pos.x+=bigBalls[i].speed*cos(bigBalls[i].degree);
			bigBalls[i].pos.y+=bigBalls[i].speed*sin(bigBalls[i].degree);
			if (dis2(bigBalls[i].pos.x,bigBalls[i].pos.y,pl.x,pl.y)<judge.bigBall) kill();
			if (bigBalls[i].pos.x<-50) bigBalls.splice(i,1);//如果超出屏幕就删
		}
	}

	function butterflyMove()//改变的是相对于圆心的角度
	{
		for (var i=butterflys.length-1;i>=0;i--)
		{
			butterflys[i].pos+=butterflys[i].rspeed;
			butterflys[i].deg=(butterflys[i].rspeed>0)?(butterflys[i].pos+rad(90)):(butterflys[i].pos-rad(90));
			butterflys[i].x=butterflys[i].cx+butterflys[i].r*cos(butterflys[i].pos);
			butterflys[i].y=butterflys[i].cy+butterflys[i].r*sin(butterflys[i].pos);
			if (dis2(butterflys[i].x,butterflys[i].y,pl.x,pl.y)<judge.butterfly) kill();
			if (butterflys[i].rspeed>0&&butterflys[i].y<-50||butterflys[i].rspeed<0&&butterflys[i].y>height+50) butterflys.splice(i,1);
		}
	}
	
	function starMove()
	{
		for (var i=stars.length-1;i>=0;i--)
		{
			stars[i].deg+=stars[i].rspeed;
			stars[i].x+=starSpeed*cos(stars[i].aim);
			stars[i].y+=starSpeed*sin(stars[i].aim);
			if (dis2(stars[i].x,stars[i].y,pl.x,pl.y)<judge.star) kill();
			if (stars[i].x<-50) stars.splice(i,1);
		}
	}
	
	function diamondMove()
	{
		for (var i=diamonds.length-1;i>=0;i--)
		{
			diamonds[i].y+=diamonds[i].speed;
			if (dis2(diamonds[i].x,diamonds[i].y-15,pl.x,pl.y)<judge.diamond) 
			{
				eatDiamond(diamonds[i].func);
				diamonds.splice(i,1);
			}
			else if (diamonds[i].y>height+50) diamonds.splice(i,1);
		}
	}
	
	function planeMove()
	{
		var dd=dis2(mx,my,pl.x,pl.y);
		pl.ax=(mx-(pl.x+plSize*cos(pl.arc)))-pl.vx/u1;//欠阻尼
		pl.ay=(my-(pl.y+plSize*sin(pl.arc)))-pl.vy/u1;
		var vv=dis2(pl.vx,pl.vy,0,0);
		pl.x+=pl.vx/u2;
		pl.y+=pl.vy/u2;
		pl.vx+=pl.ax;
		pl.vy+=pl.ay;
		pl.arc=atan2(100,-(my-(pl.y+plSize*sin(pl.arc))))-PI/2;
	}
	
	/*//下面这个版本的运动方法比较适合于飞机。。
	function planeMove()
	{
		var dd=dis2(mx,my,pl.x,pl.y);
		pl.ax=(mx-(pl.x+plSize*cos(pl.arc)))-pl.vx/u1;
		pl.ay=(my-(pl.y+plSize*sin(pl.arc)))-pl.vy/u1;
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
		//      这样做可以使机头稳定不乱晃，能精细控制
		var arc1=atan2(pl.vx,-pl.vy)-PI/2;
		pl.arc=(vv>10&&abs(arc1-pl.arc)<dd/plSize/plSize)?arc1:pl.arc;
		if (dd<2*plSize*plSize) pl.arc=atan2((mx-pl.x),-(my-pl.y))-PI/2;
	}
	*/

/*********************设置绘图时钟周期**********************/
	function clockStart(){
		timer=setInterval(function() {
			if (!pause)
			{
				drawBG();
				drawCursor();
				//drawDiamond(100,100);
				planeMove();
				if (!died) drawPlane();
				ballMove();
				drawBalls();
				bigBallMove();
				drawBigBalls();
				butterflyMove();
				drawButterflys();
				starMove();
				drawStars();
				diamondMove();
				drawDiamonds();
				if (random()<diamondDensity) addDiamond();
				if (level<1)
				{
					if (random()<ballDensity) addBall(rad(ran(175,185)));
				}
				else
				{
					if (random()<ballDensity/2) addBall(rad(ran(175,185)));
				}
				if (level==1||level==4||level==5||level>6)
				{
					if (random()<bigBallDensity) addBigBall(rad(ran(175,185)));
				}
				if (level==2||level==5||level>=6)
				{	
					if (clock%100==0) addButterfly();
				}
				if (level==3||level==4||level>=6)
				{
					if (clock%starDensity==0) addStar();	
				}
				if (!died)
				{
					cv.save();
					var txt='Score: '+(clock+score)+'0  Life: ';
					for (var i=0;i<life;i++) txt+='❤';
					txt+='  Level: '+(level>5?'MAX':level+1);
					cv.font="20px Arial";
					cv.fillStyle="#d35";
					cv.fillText(txt,30,30);
					cv.restore();
				}
				//cv.fillText(clock+score,10,10);
				//cv.fillText('x:'+round(pl.x)+' y:'+round(pl.y)+' vx:'+round(pl.vx)+' vy:'+round(pl.vy)+' ax:'+round(pl.ax)+' ay:'+round(pl.ay)+' arc:'+round(pl.arc*180/PI),100,100);
				clock++;
				bgColorTimer++;
				if (clock%1200==1199) level++;
				if (flash==8||flash==7||flash==2||flash==1) 
				{
					cv.save();
					cv.fillStyle='rgba(255,255,255,0.5)';
					cv.fillRect(0,0,width,height);
					cv.restore();
					flash--;
				}
				else if (flash)
				{
					flash--;
				}
			}
		}, 1000/fps);//fps
	}

/*********************事件监听**************************/
	document.addEventListener('mousemove',function(e)
	{
		mx=e.x;
		my=e.y;
	});
	
	document.addEventListener('click',function(e)
	{
		if (e.target.id=='retry')
			retry();
		else if (e.target.id=='startbutton')
		{
			$('#startgame').remove();
			$('html').css({cursor:'none'});
			clockStart();
		}
		else if (e.target.id=='continue')
		{
			stopPause();
		}
	});
	
	document.addEventListener('keydown',startPause);
	
/*********************帮助&关于信息************************/
	$('#instructions').mouseenter(function()
	{
		$('#instructions').css('background','#66a');
		$('#left').fadeIn(500);
	});
	$('#instructions').mouseleave(function()
	{
		$('#instructions').css('background','#99c');
		$('#left').fadeOut(300);
	});
	$('#about').mouseenter(function()
	{
		$('#about').css('background','#66a');
		$('#right').fadeIn(500);
	});
	$('#about').mouseleave(function()
	{
		$('#about').css('background','#99c');
		$('#right').fadeOut(300);
	});
	
	function addHelpInfo()
	{
		$('#left').append(instructionsContent);
	}
	
	function addAboutInfo()
	{
		$('#right').append(aboutContent);
	}
	
	function addRankingInfo()
	{
		$('#right2').append();
	}
	
/*********************暂停*********************************/
	function startPause(e)
	{
		if (e.keyCode!=13&&e.keyCode!=32&&e.keyCode!=80)
			return;
		if (pause) 
		{
			stopPause();
			return;
		}
		if ($('#die').length)
		{
			retry();
			return;
		}
		if ($('#startgame').length)
		{
			$('#startgame').remove();
			$('html').css({cursor:'none'});
			clockStart();
			return;
		}
		if (pauseTimes<0) 
			return;
		$('html').css({cursor:'default'});
		pause=true;
		pauseTimes--;
		$('body').append('<div id="pause"><div class="title">'+_pause+'</div><div id="instructions">'+_instructions+'</div>'+
		'<div id="about">ABOUT</div><div id="continue" class="button">'+_continue+'</div></div>');
		$('#pause').css('top',height/2-100+'px');
		$('#pause').css('left',width/2-200+'px');
		$('#instructions').mouseenter(function()
		{
			$('#instructions').css('background','#66a');
			$('#left').fadeIn(500);
		});
		$('#instructions').mouseleave(function()
		{
			$('#instructions').css('background','#99c');
			$('#left').fadeOut(300);
		});
		$('#about').mouseenter(function()
		{
			$('#about').css('background','#66a');
			$('#right').fadeIn(500);
		});
		$('#about').mouseleave(function()
		{
			$('#about').css('background','#99c');
			$('#right').fadeOut(300);
		});
		$('audio')[0].pause();
	}
	
	function stopPause()
	{
		pause=false;
		$('html').css({cursor:'none'});
		$('#pause').remove();
		$('#left').fadeOut(300);
		$('#right').fadeOut(300);
		$('audio')[0].play();
	}
	
/*********************吃钻石相关***************************/
	function eatDiamond(f)
	{
		if (!died)
			switch(f)
			{
			case 0: var s=ranInt(5,8);showInfo('Score +'+s+'000');func_addScore(s);break;
			case 1: showInfo(_jiansu);func_slow(2);break;
			case 2: showInfo(_1up);func_oneUp();break;
			case 3: showInfo(_wudi);func_wudi(6000);break;
			case 4: showInfo(_qingping);func_clear();break;
			case 5: showInfo(_bianxiao);func_small(2);break;
			}
	}
	
	function showInfo(s)//在小鱼上方显示文字
	{
		info=s;
		var t=clock;
		$('body').append('<div id="info'+t+'" class="info">'+s+'</div>');
		$('#info'+t).css('left',pl.x-100+'px');
		$('#info'+t).css('top',pl.y-50+'px');
		$('#info'+t).fadeOut(1500);
	}
	
	function func_addScore(s)
	{
		score+=s*100;//对玩家显示加了s千分
	}
	
	function func_slow(t)
	{
		var i;
		for (i in balls) balls[i].speed/=t;
		for (i in bigBalls) bigBalls[i].speed/=t;
		for (i in butterflys) butterflys[i].rspeed/=t;
		for (i in stars) stars[i].speed/=t;
		ballSpeed/=t;
		bigBallSpeed/=t;
		butterflySpeed/=t;
		starSpeed/=t;
		ballDensity/=t;
		bigBallDensity/=t;
		butterflyDensity/=t;
		starDensity*=t;
		slowTimer=setTimeout(function()
		{
			ballSpeed*=t;
			bigBallSpeed*=t;
			butterflySpeed*=t;
			starSpeed*=t;	
			ballDensity*=t;
			bigBallDensity*=t;
			butterflyDensity*=t;
			starDensity/=t;
		},8000);
		flash=8;
	}
	
	function func_oneUp()
	{
		life++;
	}
	
	function func_wudi(time)
	{
		if (wudiTimer) window.clearTimeout(wudiTimer);//清除之前无敌的计时器
		wudi=true;
		wudiTimer=setTimeout(function()
		{
			wudi=false;
		},time);
	}
	
	function func_clear()
	{
		balls=[];
		bigBalls=[];
		butterflys=[];
		stars=[];
		flash=8;
	}
	
	function func_small(t)
	{
		var i;
		//for (i in balls) balls[i].size/=t;
		for (i in bigBalls) bigBalls[i].size/=t;
		//ballSize/=t;
		bigBallSize/=t;
		bSize/=t;
		butterflySize/=t;
		starSize/=t;
		plSize/=t;
		for (i in butterflyShape) butterflyShape[i].r/=t;
		Star_6 = [{r:starSize,t:rad(90)},{r:starSize/2*1.5,t:rad(60)},{r:starSize,t:rad(30)},{r:starSize/2*1.5,t:rad(0)},{r:starSize,t:rad(-30)},{r:starSize/2*1.5,t:rad(-60)},{r:starSize,t:rad(-90)},{r:starSize/2*1.5,t:rad(-120)},{r:starSize,t:rad(-150)},{r:starSize/2*1.5,t:rad(-180)},{r:starSize,t:rad(-210)},{r:starSize/2*1.5,t:rad(-240)}];
		planeShape=[{r:plSize*1,t:PI+3.14},{r:plSize*0.716,t:PI+-2.98},{r:plSize*0.443,t:PI+-2.49},{r:plSize*0.443,t:PI-0.65},{r:plSize*0.716,t:PI-0.25},{r:plSize*1,t:PI+0},{r:plSize*1,t:PI+0},{r:plSize*0.716,t:PI+0.25},{r:plSize*0.443,t:PI+0.65},{r:plSize*0.443,t:PI+2.49},{r:plSize*0.716,t:PI+2.98}];
		judge={
			ball:cube(plSize/4+ballSize),
			bigBall:cube(plSize/4+bigBallSize),
			butterfly:cube(plSize/4+butterflySize),
			star:cube(plSize/4+starSize),
			diamond:cube(plSize/4+15)
		};
		smallTimer=setTimeout(function()
		{
			//ballSize*=t;
			bigBallSize*=t;
			bSize*=t;
			butterflySize*=t;
			starSize*=t;
			plSize*=t;
			for (i in butterflyShape) butterflyShape[i].r*=t;
			Star_6 = [{r:starSize,t:rad(90)},{r:starSize/2*1.5,t:rad(60)},{r:starSize,t:rad(30)},{r:starSize/2*1.5,t:rad(0)},{r:starSize,t:rad(-30)},{r:starSize/2*1.5,t:rad(-60)},{r:starSize,t:rad(-90)},{r:starSize/2*1.5,t:rad(-120)},{r:starSize,t:rad(-150)},{r:starSize/2*1.5,t:rad(-180)},{r:starSize,t:rad(-210)},{r:starSize/2*1.5,t:rad(-240)}];
			planeShape=[{r:plSize*1,t:PI+3.14},{r:plSize*0.716,t:PI+-2.98},{r:plSize*0.443,t:PI+-2.49},{r:plSize*0.443,t:PI-0.65},{r:plSize*0.716,t:PI-0.25},{r:plSize*1,t:PI+0},{r:plSize*1,t:PI+0},{r:plSize*0.716,t:PI+0.25},{r:plSize*0.443,t:PI+0.65},{r:plSize*0.443,t:PI+2.49},{r:plSize*0.716,t:PI+2.98}];
			judge={
				ball:cube(plSize/4+ballSize),
				bigBall:cube(plSize/4+bigBallSize),
				butterfly:cube(plSize/4+butterflySize),
				star:cube(plSize/4+starSize),
				diamond:cube(plSize/4+15)
			};
		},8000);
		flash=8;
	}
	
/*********************玩家挂了*****************************/
	function kill()
	{
		if (!wudi&&!died) 
		{
			life--;
			showInfo(_life+life);
			func_wudi(2500);
		}
		if (!life) 
		{
			die();
		}
	}

	function die()
	{
		if (died) return;
		died=true;
		$('html').css({cursor:'default'});
		$('body').append('<div id="die"><div class="title">GAME OVER</div><div id="score">YOUR SCORE IS '+(clock+score)+'0.</div>'+
		'<div id="ranking">RANKING</div><div id="retry" class="button">TRY AGAIN</div></div>');
		$('#die').css('top',height/2-100+'px');
		$('#die').css('left',width/2-200+'px');
		$('#ranking').mouseenter(function()
		{
			$('#ranking').css('background','#66a');
			$('#right2').fadeIn(500);
		});
		$('#ranking').mouseleave(function()
		{
			$('#ranking').css('background','#99c');
			$('#right2').fadeOut(300);
		});
	}
	
	function retry()
	{
		$('#die').remove();
		$('html').css({cursor:'none'});
		$('.info').remove();
		prepossessing();
		$('audio')[0].pause();
		$('audio')[0].currentTime=0;
		$('audio')[0].play();
	}
