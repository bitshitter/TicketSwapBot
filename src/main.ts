'use strict';
import request from "request";
import userAgent from "random-useragent"
import logger from "./logger"
import cheerio from "cheerio"
import childProcessPromise from "child-process-promise";
const exec = childProcessPromise.exec;
import TelegramBot from "node-telegram-bot-api";
// replace the value below with the Telegram token you receive from @BotFather
const token = '1090928496:AAEWddgtn-jto5Uy-aSKPbPBladCZ0balGY';
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);
const extend = require('util')._extend;
const sessionID:string = "1TYluOdtA2gQSJgQKIX0U";
const ticketSwapMainURL:string = "https://www.ticketswap.com"

// const urlTicketPage:string = "https://www.ticketswap.com/event/thuishaven-w-maceo-plex/39bc81e5-8dd9-42a6-84fd-6b658326db9a"
const urlTicketPage:string = "https://www.ticketswap.com/event/awakenings-festival-2020-20th-anniversary/sunday-tickets/2e502d38-2820-47ed-89e5-ba18920932e0/1581170"
// const urlTicketPage:string = "https://www.ticketswap.com/event/awakenings-festival-2020-20th-anniversary/saturday-tickets/2e502d38-2820-47ed-89e5-ba18920932e0/1333459"

const classname:string = "eofif8h5";
// const formClassname:string = "";
let ticketPageList:Array<string> = [];
var counter = 0;
// session = the user session id
function makeRequest({ url, session }: {url:string, session:string}, opts:any): Promise<{response: string, body: any}>{
    logger.info("makeRequest")
    if(opts === null || opts === undefined){
        opts = {headers: ""}
    }
    
    console.log("opts", opts)
    var jar = request.jar();
    let cookie:any = request.cookie(`session=${session}`);
    jar.setCookie(cookie, url);
    var options = extend(opts, {
        url,
        jar,
        headers: extend({
            'User-Agent': userAgent.getRandom(),
        }, opts.headers || {}),
    });
    return new Promise(function(resolve, reject) {
        
        request(options, function(err:any, response:any, body:any) {
            if (err) {
                reject({ error: err });
            } else if(! /^2/.test('' + response.statusCode)) {
                reject({ 
                    error: body,
                    response: response 
                });
            } else {
                resolve({
                    response: response,
                    body: body,
                });
            }
        });
    });
}
function retry(){
    let rnd:number = 10 * Math.random();
    rnd = rnd * 100;
    if(counter >= 10) {
        rnd = 3696;
        counter = 0;
    }
    console.log(rnd)
    setTimeout(()=>{
        main()
    }, rnd);
}
function main(){
    counter++;
    logger.info("main")
    
makeRequest({url: urlTicketPage, session: sessionID}, {headers: ""})
.then(({response, body})=> {
    
    const $ = cheerio.load(body);
    // div.childNodes[0].childNodes[0].childNodes[0].href
    $(`.${classname} > ul > div > a`).each((index, element) =>  {
        ticketPageList.push(ticketSwapMainURL+ element.attribs.href)
    })
    logger.info(ticketPageList)
    logger.info(ticketPageList.length.toString())
    if(ticketPageList.length === 0) {
        retry();
        throw {error: "no tickets found"}
    }  
    logger.info("TICKETS FOUND!!!")
    // runFound(ticketPageList[0], options)
    exec(`open -a "Brave Browser" ${ticketPageList[0]}`);
    // exec(`start "Google Chrome" "${ticketPageList[0]}"`);
    bot.sendMessage("-1001268022128" ,'TICKET FOUND!!');
    bot.sendMessage("-1001268022128" ,'Check your cart in the TicketSwap APP');
})
.catch(({error, response})=>{
    logger.error(error)
    if(error === "Internal Server Error" || error == "Internal Server Error"){
        logger.info("ERROR === Internal Server Error");
        retry();
    }
    })
    // end main()
}
main();