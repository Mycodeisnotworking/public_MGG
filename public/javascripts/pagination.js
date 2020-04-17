class PageClass{
    constructor(contentContainerId, pageChunkId, numberOfElements){
        this.constructorDeclration="PageClass(contentContainerId, pageChunkId, numberOfElements)";
        if(contentContainerId==null || contentContainerId==undefined){
            throw this.errmsg(this.constructorDeclration, "contentContainerId");
        }
        if(pageChunkId==null || pageChunkId==undefined){
            throw this.errmsg(this.constructorDeclration, "pageChunkId");
        }
        var tmp=parseInt(numberOfElements);
        if(numberOfElements == null || numberOfElements == undefined){
            throw this.errmsg(this.constructorDeclration, "numberOfElements");
        }
        else if(tmp==NaN){
            throw this.errmsgNumberType(this.constructorDeclration, "numberOfElements")
        }
        this.contentContainerId=contentContainerId;//페이지 내용을 표시하는 컨테이너 
        this.pageChunkId=pageChunkId;//페이지 숫자를 표시하는 컨테이너
        this.numberOfElements=numberOfElements;//총 컨텐츠 수(게임 수와 동일함)

        this.currentPage=1;
        this.pageSize=5;//한 화면에보여주는 최대 페이지 수
        this.pageRows=5;//한 페이지에 존재하는 글의 개수
        this.totalPage=Math.ceil( numberOfElements / this.pageSize);
        this.half=Math.floor(this.pageSize/2);
    }

    errmsg(funcDeclaration, missingElement){
        return missingElement+"를 입력해주세요. fucntion "+funcDeclaration;
    }
    errmsgNumberType(funcDeclaration, notNumberElement){
        return "Type Erorr: "+notNumberElement+"는 숫자여야 합니다. "+funcDeclaration;
    }
    
    movePage(destPageIdx)
    {
        /*
            destPageIdx: 클릭한 인덱스 번호(0 ~ (pageSize-1) 의 값)
            ex) 페이지 컨테이너가 다음과 같을 때(pageSize=5)
            3 4 5 6 7 
            7 클릭 시
             => destPageIdx: 4
            3 클릭 시
             => destPageIdx: 0
        */
        if(destPageIdx==null || destPageIdx == undefined){
            throw "destPageIdx를 입력해주세요. function movepage(destPageIdx, paginationChunkId)";   
        }
        if(document.getElementById(this.pageChunkId+destPageIdx).innerHTML==""){
            return;
        }
        var nextCurrentPage=parseInt(document.getElementById(this.pageChunkId+destPageIdx).innerHTML);
        var isExceedLimit=false;//totalPage 이상 페이지가 넘어갈 경우 true.
        var pageElement;
        for(var i =0;i<this.pageSize;i++){
            /*
            pageSize 절반 이상 넘어가면 앞뒤로 배열이 생김
            pageSize = 5 인 경우
            currentPage=1인 기본 상태일 때
            1 2 3 4 5
            => 
            ex1) 2번 페이지 클릭 시
            1 2 3 4 5
            ex2) 4번 페이지 클릭 시
            2 3 4 5 6
            */
           
            if(nextCurrentPage > this.half){
                isExceedLimit=(nextCurrentPage+(i-this.half) > this.totalPage) ? true : false;
                pageElement=document.getElementById(this.pageChunkId+i);
                if(isExceedLimit){
                    pageElement.innerHTML="";
                    pageElement.style.border='0px';
                }
                else{
                    pageElement.style.border='1px solid black';
                    pageElement.innerHTML = nextCurrentPage+(i-this.half);
                }

            }
            else{
                isExceedLimit=(nextCurrentPage+i > this.totalPage) ? true : false;
                pageElement=document.getElementById(this.pageChunkId+i);
                if(isExceedLimit){
                    pageElement.innerHTML="";
                    pageElement.style.border='0px';
                }
                else{
                    pageElement.style.border='1px solid black';
                    document.getElementById(this.pageChunkId+i).innerHTML = nextCurrentPage+i;
                }
            }
        }

        for(var i =0 ; i < this.pageRows;i++){
            var turnPageOff=(this.pageRows*(this.currentPage-1))+i;
            var turnPageOn=this.pageRows*(nextCurrentPage-1)+i;
            document.getElementById(this.contentContainerId+turnPageOff).style.display='none';
            document.getElementById(this.contentContainerId+turnPageOn).style.display='block';
        }

        this.currentPage=nextCurrentPage;
    
    }
}