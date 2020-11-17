var sw = 20,  //方格的宽度
    sh = 20,  //高度
    tr = 30,  //行数
    td = 30;  //列数

var snake = null,
    food = null,
    game = null;


//方块构造函数
function Square(x, y, classname){
    this.xsw = x*sw;
    this.ysh = y*sh;
    this.class = classname;

    this.viewContent =document.createElement('div');
    this.viewContent.className = this.class;
    this.parent = document.getElementById('snakeWrap');
    // this.creat = creatSquare;
}

//在原型对象中创建一个create方法用于将方块写入浏览器
Square.prototype.create = function(){
    this.viewContent.style.position = 'absolute';
    this.viewContent.style.left = this.xsw +'px';
    this.viewContent.style.top = this.ysh +'px';
    this.viewContent.style.width = sw + 'px';
    this.viewContent.style.height = sh + 'px';

    this.parent.appendChild(this.viewContent);
}
//删除
Square.prototype.remove = function(){
    this.parent.removeChild(this.viewContent);
}



//蛇的构造函数
function Snake(){
    this.head = null;
    this.body = null;   //好像不是很有必要
    this.pos = [];
    this.nextPos = [];
    this.directionNum = {

        left:{
            x: -1,
            y: 0,
            rotate :180
        },
        up: {
            x: 0,
            y: 1,
            rotate: 90
        },
        right:{
            x: 1,
            y: 0,
            rotate : 0
        },
        down: {
            x: 0,
            y: -1,
            rotate: -90
        }
    }
}

//在原型对象中创建蛇的方法一：初始化方法
Snake.prototype.init = function(){
    //创建蛇头
    var head0 = new Square(2, 0, 'snakeHead');
    head0.create();
    this.head = head0;
    this.pos.push([2,0]);

    //创建两个身体
    var body1 =new Square(1, 0, 'snakeBody');
    body1.create();
    this.pos.push([1,0]);

    var body2 =new Square(0, 0, 'snakeBody');
    body2.create();
    this.pos.push([0,0]);

    // this.tail = this.body2;
    this.tail = this.pos[this.pos.length-1];

    //给蛇添加一个属性direction 确定蛇的移动方向，初始向右走
    this.direction = this.directionNum.right;
    
    //确定蛇的下一点位置
    this.nextPos=[this.head.xsw/sw + this.direction.x,
                    this.head.ysh/sh + this.direction.y];
    
}

//在原型对象中创建蛇的方法二：根据不同情况，判断蛇的下一步行动策略
Snake.prototype.judge = function(){

this.nextPos=[this.head.xsw/sw + this.direction.x,
                this.head.ysh/sh + this.direction.y];

    // 1.判断是否撞到自己
    var selfCollied =false;
    for(var i= 0 ;i< this.pos.length-1 ; i++){
        // console.log(this.pos[i][0]);
        // console.log(this.nextPos[0]);
        if(this.pos[i][0] == this.nextPos[0] && this.pos[i][1] == this.nextPos[1]){
            selfCollied = true;
        }
    }

    // this.pos.forEach(function(value){
    //     if(value[0]==this.nextPos[0] && value[1]==this.nextPos[1]){
    //         selfCollied = true;
    //     }
    // });
    if(selfCollied){
        this.die();  //小蛇死亡
    }

    // 2.判断是否撞墙

    if(this.nextPos[0] < 0 || this.nextPos[1] < 0 || this.nextPos[0] > tr-1 || this.nextPos[1] > td-1){
        this.die();
    }

    // 3.判断是否碰到食物
    if(this.nextPos[0]== food.pos[0] && this.nextPos[1]==food.pos[1]){
        this.eat();
        food.remove();
        createFood();
        game.score++;
    }

    // 前方什么都不是
    this.move();
}
//在原型对象中创建蛇的方法三：蛇的行动策略（移动、吃 、死亡）
Snake.prototype.move = function(){
    var arr = document.getElementsByClassName('snakeBody');
    for(var j=arr.length-1;j >0 ; j--){
        arr[j].style.left = arr[j-1].style.left;
        arr[j].style.top = arr[j-1].style.top;
    }
    arr[0].style.left = this.head.viewContent.style.left;
    arr[0].style.top = this.head.viewContent.style.top;

    //控制转向后及时移动 
    this.head.xsw = this.nextPos[0]*sw ;
    this.head.ysh = this.nextPos[1]*sh ;

    this.head.viewContent.style.left= this.head.xsw+'px';
    this.head.viewContent.style.top = this.head.ysh+'px';

    //用以判断碰撞自己的时候
    for(var j=this.pos.length-1; j >0;j--){
        this.pos[j][0] = this.pos[j-1][0];
        this.pos[j][1] = this.pos[j-1][1];
    }
    this.pos[0][0] = this.nextPos[0];
    this.pos[0][1] = this.nextPos[1];

    this.nextPos=[this.nextPos[0] + this.direction.x,
                    this.nextPos[1] + this.direction.y];
    
}
Snake.prototype.die = function(){
    game.over();
}
Snake.prototype.eat = function(){
    var newBody = new Square(this.head.xsw/sw, this.head.ysh/sh, 'snakeBody');
    newBody.create();
    this.pos[0]=[this.nextPos[0], this.nextPos[1]];
    this.pos.splice(1,0,[newBody.xsw/sw, newBody.ysh/sh]);

    this.move();
}


//创建食物
function createFood(){
    var x = null,
        y = null;
    var include = true;
console.log(snake.pos);
    while(include){
        x = Math.round(Math.random()*(td-1));
        y = Math.round(Math.random()*(tr-1));

        snake.pos.forEach(function(value){
            if(value[0] !=x && value[1] !=y){
                include=false;
            }
        })
    }
    food = new Square(x, y, 'food');
    food.create();
    // food.pos= [food.xsw/sw, food.ysh/sh];
    food.pos = [x, y];
    
}


//创建游戏构造函数
function Game(){
    this.score = 0;
    this.timer = null;
}
Game.prototype.init = function(){
    snake.init();
    createFood();
    
    document.onkeydown = function(ev){
        if(ev.key == 'ArrowLeft' && snake.direction != snake.directionNum.right){
            snake.direction = snake.directionNum.left;
        }else if(ev.key == 'ArrowDown' && snake.direction != snake.directionNum.down){
            snake.direction = snake.directionNum.up;
        }else if(ev.key == 'ArrowRight' && snake.direction != snake.directionNum.left){
            snake.direction = snake.directionNum.right;
        }else if(ev.key == 'ArrowUp' && snake.direction != snake.directionNum.up){
            snake.direction = snake.directionNum.down;
        }
        snake.head.viewContent.style.transform = 'rotate('+snake.direction.rotate+'deg)';
    }

    this.start();

}

//游戏的开始、暂停、结束
Game.prototype.start = function(){
    this.timer = setInterval(function(){snake.judge()},200);
}
Game.prototype.pause = function(){
    clearInterval(this.timer);
}
Game.prototype.over = function(){
    clearInterval(this.timer);
    alert('游戏结束，您的本次得分为:'+ this.score);

    // 游戏回到最初始的状态
    var snakeWrap = document.getElementById('snakeWrap');
    snakeWrap.innerHTML = '';
    snake = new Snake();
    game = new Game();

    var startBtnWrap = document.querySelector('.startBtn');
    startBtnWrap.style.display = 'block';
}


game = new Game();
snake = new Snake();

//开始游戏
var startBtn = document.querySelector('.startBtn button');
startBtn.onclick = function(){
    startBtn.parentNode.style.display = 'none';
    game.init();
}

//暂停游戏
var snakeWrap = document.getElementById('snakeWrap');
var pauseBtn = document.querySelector('.pauseBtn button');
snakeWrap.onclick = function() {
    game.pause();
    pauseBtn.parentNode.style.display='block';
}
pauseBtn.onclick = function() {
    game.start();
    pauseBtn.parentNode.style.display='none';
}

