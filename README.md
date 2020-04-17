# MGG

## mysql charset 설정법

### 현재 받아오는 데이터 중 일부가 이모지를 사용하기 때문에 필요
 - 이모지는 한 문자당 4byte, mysql 기본 문자는 3byte
 => varchar 사용시 최대값은 varchar(255)에서 varchar(191)이 된다(255 * 3 = 765, 191 * 4 = 764)
 
 아마도 윈도우에서 깔아 쓰고 있을 테니 그 기준으로 설명함
 * 해당 데이터베이스에서 아래의 코드를 먼저 실행해 볼 것
> SHOW GLOBAL VARIABLES WHERE Variable_name LIKE 'character\_set\_%' OR Variable_name LIKE 'collation%';

 결과가 다음과 같다면 아래를 실행할 필요 없다.<br>
 ![result](https://user-images.githubusercontent.com/21293525/66250961-c8148c80-e784-11e9-80eb-6023b933326c.JPG)

 * 잘못 만질경우 mysql이 켜지지 않을 수 있다. my.ini를 미리 복사한 후 하는 것을 추천.
 * 이 경우 utf 관련 설정만 하나씩 원래대로 돌려주면 됨

 1. C:\ProgramData\MySQL\MySQL Server 5.7 으로 이동한다
 2. my.ini 파일을 찾는다.
  * ![myinipath](https://user-images.githubusercontent.com/21293525/66250958-bc28ca80-e784-11e9-870f-157c54ed3335.JPG)
 3. 다음과 같이 내용을 수정한다.
 > [client]<br>
  default-character-set=utf8<br><br>
  [mysql]<br>
  default-character-set=utf8mb4<br><br>
  [mysqldump]<br>
  default-character-set=utf8<br><br>
  [mysqld]<br>
  skip-character-set-client-handshake<br>
  collation-server = utf8mb4_unicode_ci<br>
  init-connect = SET NAMES utf8mb4<br>
  character-set-server=utf8mb4<br>
 * 일부 설정은 이미 있는 경우도 있으니 주의해서 확인
 4. mysql 재기동 후 
 > SHOW GLOBAL VARIABLES WHERE Variable_name LIKE 'character\_set\_%' OR Variable_name LIKE 'collation%';<br>
 를 다시 실행하여 결과를 확인한다.
 
## Pagination 설명
### 한 페이지에서 여러 가지 pagination이 필요할 때 사용

### 사용법
 # a.ejs
 ~~~
 <script type="text/javascript" src="pagination.js가 위치한 경로"></script>
 <script type="text/javascript">
  var pageContainer=new PageClass("pageElement", "pageButton", 40);//40 => 해당 pagination으로 보여줄 element의 총 갯수
 </script>
 
 <div id="ElementContainer">

  <div id="pageElement1"> client에게 보여줄 내용들 </div>//보여주는 요소 한 묶음을 element라고 하겠음
  <div id="pageElement2"> client에게 보여줄 내용들 </div>
  ...
  <div id="pageElement5"> client에게 보여줄 내용들 </div>
 </div>

 <div id="paginationContainer>
 
  <a href="javascript:void(0)"  onclick="pageContainer.movePage('0')">
   <span id="pageButton0"> 1 </span>
  </a>&nbsp;
  <a href="javascript:void(0)"  onclick="pageContainer.movePage('1')">
   <span id="pageButton2"> 2 </span>
  </a>&nbsp;
  ...
  <a href="javascript:void(0)"  onclick="pageContainer.movePage('4')">
   <span id="pageButton4"> 5 </span>
  </a>&nbsp;
  
 </div>
 ~~~
 
규칙
 1. ejs 파일에서 element를 보여주기 위한 div 및 페이지 번호를 보여주는 div 생성 시
  이의 id를 이름 + 인덱스 로 구성한다.(div, section, p 등등 사용가능)
 2.  PageClass 생성 시 인덱스를 제외한 이름만 매개변수로 전달한다.
  => pageElement, pageButton
  
  그 외 변수들(수정 자유)
  pageSize;//한 화면에보여주는 최대 페이지 수. 기본값 5
  pageRows;//한 페이지에 존재하는 글의 개수. 기본값 5
  
  사용해보고 모르겠으면 문의바랍니다.
  
  ## hexagraph.js 설명
  
  ### 사용법
  hexagraph.js 추가 후
  =>
  ~~~
  <hexagraph.ejs>
   .
   .
   .
   <body>
 ...
 <canvas id="hexagraph" width="450" height="400"></canvas>
 ...
 <script type="text/javascript" src="hexagraph.js가 있는 경로"></script>
 <script type="text/javascript>
   window.onload=function(){
    var drawer=new graphDrawer(var drawer=new graphDrawer("hexagraph", 260, 300, 100, 40, score);
    drawer.draw();
   }
 </script>
 ~~~
  
 의 방식으로 사용<br>
 score(길이가 6인 배열)는 별도로 계산한 각 리뷰값들의 평균값<br>
 score는 이후에 데이터베이스 테이블을 새로 만들 예정. 지금은 받아온 리뷰의 평균값 계산해서 넣으세요<br>
 
  ### 주의사항
  window.onload 이벤트는 한 페이지당 하나의 함수만 등록할 수 있습니다.<br>
  hexagraph외에 onload시 필요한 기능이 있을 경우 함수로 만들어 이에 추가하십시오.<br>
  예시의 260, 300, 100, 40은 각각 육각형의 너비, 높이, 좌측여백, 상측여백입니다(단위: px)<br>
  육각형 외에 그리고 싶은 도형이 있는 경우 직접 hexagraph.js에 함수를 추가할 수 있습니다.<br>
  
