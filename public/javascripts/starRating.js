var draggable=false;
$(()=>{
    $('#starBar_playability, #starBar_design, #starBar_story, #starBar_sound, #starBar_pay, #starBar_creativity, #starBar_valueForMoney').mousedown(()=>{
      draggable=true;
    });
    $('#starBar_playability, #starBar_design, #starBar_story, #starBar_sound, #starBar_pay, #starBar_creativity, #starBar_valueForMoney').mousemove((obj)=>{
        if(draggable){
            var x=event.offsetX;
            var starRating= ((x*5)/210).toFixed(2);
            if(starRating < 0){
                starRating=0;
            }
            var targetId=obj.currentTarget.id;
            var value;
            $('#'+targetId+' span').css('width', x);
            switch(targetId){
                case "starBar_playability":
                $('#playability').val(starRating);
                break;
                case "starBar_design":
                $('#design').val(starRating);
                break;
                case "starBar_story":
                $('#story').val(starRating);
                break;
                case "starBar_sound":
                $('#sound').val(starRating);
                break;
                case "starBar_pay":
                $('#billingpromotion').val(starRating);
                break;
                case "starBar_creativity":
                $('#creativity').val(starRating);
                break;
                case "starBar_valueForMoney":
                $('#vfm').val(starRating);
                break;
            }
        }
    });

    $('#starBar_playability, #starBar_design, #starBar_story, #starBar_sound, #starBar_pay, #starBar_creativity, #starBar_valueForMoney').mouseup(()=>{
        draggable=false;
    });
    $('#starBar_playability, #starBar_design, #starBar_story, #starBar_sound, #starBar_pay, #starBar_creativity,  #starBar_valueForMoney').mouseleave(()=>{
        draggable=false;
    });
});