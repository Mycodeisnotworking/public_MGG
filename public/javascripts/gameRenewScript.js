var store = require('app-store-scraper');
var gplay = require('google-play-scraper');
var d_gplay=require('google-play-scraper-dev');
var db=require('./config');
const c = require('../../node_modules/google-play-scraper/lib/constants');
const dc=require('../../node_modules/google-play-scraper-dev/lib/constants');

const gplay_insert_query="insert into Game_Google_TB (title, description, descriptionHTML, summary, installs, minInstalls, score, scoretext, ratings, reviews, histogram, price, free, currency, pricetext, offersiap, size, androidversion, androidversiontext, developer, developerid, developeremail, developerwebsite, developeraddress, privacypolicy, developerinternalid, genre, genreid, familygenre, familygenreid, icon, headerimage, video, videoimage, contentrating, contentratingdescription, adsupported, released, updated, version, recentchanged, appid, url) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) on duplicate key update title=?, description=?, descriptionHTML=?, summary=?, installs=?, minInstalls=?, score=?, scoretext=?, ratings=?, reviews=?, histogram=?, price=?, free=?, currency=?, pricetext=?, offersiap=?, size=?, androidversion=?, androidversiontext=?, developer=?, developerid=?, developeremail=?, developerwebsite=?, developeraddress=?, privacypolicy=?, developerinternalid=?, genre=?, genreid=?, familygenre=?, familygenreid=?, icon=?, headerimage=?, video=?, videoimage=?, contentrating=?, contentratingdescription=?, adsupported=?, released=?, updated=?, version=?, recentchanged=?, appid=?, url=?;"
const gplay_screenshot_query="insert into SShots_Google_Received_TB (appid, screenshot) value (?, ?) on duplicate key update appid=?, screenshot=?;";
const gplay_comment_query="insert into Review_Google_Received_TB (appid, userid, username, userimage, reviewdate, score, scoretext, url, title, review, replydate, replytext, version, thumbsup, criterias) value(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) on duplicate key update appid= ?, userid= ?, username= ?, userimage= ?, reviewdate= ?, score= ?, scoretext= ?, url= ?, title= ?, review= ?, replydate= ?, replytext= ?, version= ?, thumbsup= ?, criterias= ?;"
const apple_insert_query="insert into Game_Apple_TB (id, appid, title, url, description, icon, genres, genreids, primarygenre, primarygenreid, contentrating, languages, size, requiredosversion, released, updated, releasenotes, version, price, currency, free, developerid, developer, developerurl, developerwebsite, score, reviews, currentversionscore, supporteddevices) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) on duplicate key update id=?, appid=?, title=?, url=?, description=?, icon=?, genres=?, genreids=?, primarygenre=?, primarygenreid=?, contentrating=?, languages=?, size=?, requiredosversion=?, released=?, updated=?, releasenotes=?, version=?, price=?, currency=?, free=?, developerid=?, developer=?, developerurl=?, developerwebsite=?, score=?, reviews=?, currentversionscore=?, supporteddevices=?";

const google_Num_default=60;
const google_Num_Max=120;
const google_Start_Min=0;
const goolge_Start_Max=500;

async function driver(){
    for(var categoryidx in dc.category){
        if(categoryidx.startsWith("GAME_")){
            for(var i=google_Start_Min;i<=goolge_Start_Max;i+=120){
                var rows= await d_gplay.list({
                    num: 120,
                    start: (i>=500)? 480:i,
                    fullDetail: true,
                    country: 'kr',
                    lang: 'ko',
                    category: dc.category[categoryidx]
                }).catch((err)=>{console.log(err);});
                var datas= await extractData(rows).catch((err)=>{console.log(err);});
                await insertData(datas).catch((err)=>{console.log(err);});
            }
        }
    }
}

function extractData (rows){
    return new Promise(async (resolve, reject)=>{
        var tuples=new Array();
        var screenshots=new Array();
        var comments=new Array();
    
        for(var item in rows){
            //insert
            var tuple=new Array();
            for(var idx in rows[item]){
                if(idx=="screenshots")
                {
                    try{
                        await getScreenshots(rows[item]["screenshots"], rows[item]["appId"], screenshots);
                    }
                    catch(err){
                        console.log(err);
                        reject(err);
                    }

                }
                else if(idx=="comments")
                {
                    if(rows[item]["comments"].length > 0){
                        try{
                            await getComments(rows[item]["appId"], comments);
                        }
                        catch(err){
                            console.log(err);
                            reject(err);
                        }
                    }
                    else{//review가 아예 없을 경우 현재 api에서 에러남 => 걸러주기
                    }
                }
                else if(idx=="histogram"){
                    if(rows[item]["histogram"] == undefined)    { tuple.push(null); }
                    else { tuple.push(JSON.stringify(rows[item]["histogram"])); }
                }
                else{
                    if(rows[item][idx] == undefined) {tuple.push(null);}
                    else { tuple.push(rows[item][idx]);}
                }
            }
            tuples.push(tuple);
        }

        resolve([tuples, screenshots, comments]);
    });
}

function getScreenshots(rows_screenshot, appId, screenshot_array){
    return new Promise((resolve, reject) =>{
        for(var shot in rows_screenshot){
            var screenshot=new Array();
            if(appId==undefined) { screenshot.push(null);}
            else    { screenshot.push(appId);    }
            if(rows_screenshot[shot]==undefined) {screenshot.push(null);}
            else    {screenshot.push(rows_screenshot[shot]); }
            screenshot_array.push(screenshot);
        }
        resolve();
    });
}

function getComments(appId, comments){
    return new Promise(async (resolve, reject)=>{
        var review_rows= await d_gplay.reviews({
            appId: appId,
            lang:"ko",
            country:'kr',
            num: 20
        })
        .catch(err=>{reject(err)});
    
        for(var cmt in review_rows){
            var comment=new Array();
            comment.push(appId);
            if(review_rows[cmt].id==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].id);}
            if(review_rows[cmt].userName==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].userName);}
            if(review_rows[cmt].userImage==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].userImage);}
            if(review_rows[cmt].date==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].date);}
            if(review_rows[cmt].score==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].score);}
            if(review_rows[cmt].scoreText==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].scoreText);}
            if(review_rows[cmt].url==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].url);}
            if(review_rows[cmt].title==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].title);}
            if(review_rows[cmt].text==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].text);}
            if(review_rows[cmt].replyDate==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].replyDate);}
            if(review_rows[cmt].replyText==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].replyText);}
            if(review_rows[cmt].version==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].version);}
            if(review_rows[cmt].thumbsUp==undefined){ comment.push(null); }
            else    { comment.push(review_rows[cmt].thumbsUp);}
            if(review_rows[cmt].criterias==undefined || review_rows[cmt].criterias==[]){ comment.push(null); }
            else    { comment.push(JSON.stringify(review_rows[cmt].criterias));}
            comments.push(comment);
        }
        resolve();
    });
}

function insertData(datas){
    return new Promise(async (resolve, reject)=>{
        for(var idx in datas[0]){
            try{
                await db.query(gplay_insert_query, datas[0][idx].concat(datas[0][idx]));
            }
            catch(err){
                console.log("================1st================");
                console.log("mysql Error: " + err);
                return reject(err);
            }
            console.log(datas[0][idx][41]+" inserted at Game_Google_TB");            
        }
        for(var idx_screen in datas[1]){
            try{
                db.query(gplay_screenshot_query, datas[1][idx_screen].concat(datas[1][idx_screen]));
            }
            catch(err){
                console.log("================2nd================");
                console.log(err);
                return reject(err);
            }
            console.log(datas[1][idx_screen][0]+" inserted at SShots_Google_Received_TB");            
        }
        for(var idx_comment in datas[2]){
            try{
                db.query(gplay_comment_query, datas[2][idx_comment].concat(datas[2][idx_comment]));                
            }
            catch(err){
                console.log("================3rd================");
                console.log(err);
                return reject(err);
            }
            console.log(datas[2][idx_comment][0]+" inserted at Review_Google_Received_TB");
        }

        resolve();
    });
}

driver();