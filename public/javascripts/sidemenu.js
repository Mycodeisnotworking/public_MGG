/*$(function(){
    $("#sidemenu").load("/ejschunks/sidemenu.ejs");
  });
*/
function openMenu(){
    $(function(){
      document.getElementById("sidemenu").style.width='250px';
    });
  };

  function closeMenu(){
    $(function(){
      document.getElementById("sidemenu").style.width='0px';
    });
  };
