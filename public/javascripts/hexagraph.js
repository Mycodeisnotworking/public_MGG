/*
 새 클래스는 window.onload=function(){
     var drawer=new garphDrawer(canvasId, width, height, caliberateX, caliberateY);
     drawer.draw();
 }
 형식으로 호출하세요.
 window.onload 함수는 한 페이지당 하나의 함수만 호출 가능합니다.
 추가 작업이 필요한 경우 window.onload에 등록한 익명함수에 추가해서 사용하세요
*/
class graphDrawer{
    constructor(canvasId, width, height, caliberateX, caliberateY, score){
        this.canvas=document.getElementById(canvasId);
        this.caliberateWidth=caliberateX;
        this.caliberateHeight=caliberateY;
        this.width=width;
        this.height=height;
        this.score=score;
        this.centerX=this.caliberateWidth+width*0.5;
        this.centerY=this.caliberateHeight+height*0.5;
        this.distance=height*0.5;
    }
    draw(){
        if(this.canvas.getContext){
            //height=Root(3)/2 *width
            var ctx=this.canvas.getContext('2d');
            var count=1;
            var innerWidth;
            var innerHeight;
            var padWidth;
            var padHeight;
            for(count=0;count<5;count++){
                innerWidth=Math.round((1-0.2*count)*this.width);
                innerHeight=Math.round((1-0.2*count)*this.height);
                padWidth=Math.round((count/10)*this.width);
                padHeight=Math.round((count/10)*this.height);
                if(count==0){
                    ctx.lineWidth=2;
                }
                else{
                    ctx.lineWidth=0.5;
                    ctx.setLineDash([10,3]);
                }
                ctx.beginPath();
                ctx.moveTo(padWidth+innerWidth*0.5+this.caliberateWidth, padHeight+this.caliberateHeight);
                ctx.lineTo(padWidth+innerWidth+this.caliberateWidth, padHeight+innerHeight*0.25+this.caliberateHeight);
                ctx.lineTo(padWidth+innerWidth+this.caliberateWidth, padHeight+innerHeight*0.75+this.caliberateHeight);
                ctx.lineTo(padWidth+innerWidth*0.5+this.caliberateWidth, padHeight+innerHeight+this.caliberateHeight);
                ctx.lineTo(padWidth+this.caliberateWidth, padHeight+innerHeight*0.75+this.caliberateHeight);
                ctx.lineTo(padWidth+this.caliberateWidth, padHeight+innerHeight*0.25+this.caliberateHeight);
                ctx.closePath();
                ctx.stroke();
            }
            var scoreDistance=[];
            for(var i=0;i<6;i++){
                scoreDistance[i]=this.score[i]*0.2*this.distance;
            }
            ctx.setLineDash([]);
            ctx.lineWidth=1;
            ctx.strokeStyle = 'rgb(150, 0, 30)';
            ctx.beginPath();
            ctx.moveTo(Math.round(this.centerX), Math.round(this.centerY-scoreDistance[0]));
            ctx.lineTo(Math.round(this.centerX+scoreDistance[1]*0.866), Math.round(this.centerY-scoreDistance[1]*0.5));
            ctx.lineTo(Math.round(this.centerX+scoreDistance[2]*0.866), Math.round(this.centerY-scoreDistance[2]*0.5));
            ctx.lineTo(Math.round(this.centerX), Math.round(this.centerY+scoreDistance[3]));
            ctx.lineTo(Math.round(this.centerX-scoreDistance[4]*0.866), Math.round(this.centerY-scoreDistance[4]*0.5));
            ctx.lineTo(Math.round(this.centerX-scoreDistance[5]*0.866), Math.round(this.centerY-scoreDistance[5]*0.5));            
            ctx.closePath();
            ctx.stroke();
    
            ctx.font = '20px serif';
            ctx.fillText('게임성', 200, 30);
            ctx.fillText('창의성', 360, 115);
            ctx.fillText('과금유도', 360, 275);
            ctx.fillText('디자인', 200, 360);
            ctx.fillText('스토리', 40, 275);
            ctx.fillText('사운드', 40, 115);
        }
        else{
            console.log("Error: cannot find canvas context 2D");
        }
    }
}