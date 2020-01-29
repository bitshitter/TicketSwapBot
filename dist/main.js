'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const random_useragent_1 = __importDefault(require("random-useragent"));
const logger_1 = __importDefault(require("./logger"));
const cheerio_1 = __importDefault(require("cheerio"));
const child_process_promise_1 = __importDefault(require("child-process-promise"));
const exec = child_process_promise_1.default.exec;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
// replace the value below with the Telegram token you receive from @BotFather
const token = '1090928496:AAEWddgtn-jto5Uy-aSKPbPBladCZ0balGY';
// Create a bot that uses 'polling' to fetch new updates
const bot = new node_telegram_bot_api_1.default(token);
const extend = require('util')._extend;
const sessionID = "1TYluOdtA2gQSJgQKIX0U";
const ticketSwapMainURL = "https://www.ticketswap.com";
// const urlTicketPage:string = "https://www.ticketswap.com/event/thuishaven-w-maceo-plex/39bc81e5-8dd9-42a6-84fd-6b658326db9a"
const urlTicketPage = "https://www.ticketswap.com/event/awakenings-festival-2020-20th-anniversary/sunday-tickets/2e502d38-2820-47ed-89e5-ba18920932e0/1581170";
// const urlTicketPage:string = "https://www.ticketswap.com/event/awakenings-festival-2020-20th-anniversary/saturday-tickets/2e502d38-2820-47ed-89e5-ba18920932e0/1333459"
const classname = "eofif8h5";
// const formClassname:string = "";
let ticketPageList = [];
var counter = 0;
// session = the user session id
function makeRequest({ url, session }, opts) {
    logger_1.default.info("makeRequest");
    if (opts === null || opts === undefined) {
        opts = { headers: "" };
    }
    console.log("opts", opts);
    var jar = request_1.default.jar();
    let cookie = request_1.default.cookie(`session=${session}`);
    jar.setCookie(cookie, url);
    var options = extend(opts, {
        url,
        jar,
        headers: extend({
            'User-Agent': random_useragent_1.default.getRandom(),
        }, opts.headers || {}),
    });
    return new Promise(function (resolve, reject) {
        request_1.default(options, function (err, response, body) {
            if (err) {
                reject({ error: err });
            }
            else if (!/^2/.test('' + response.statusCode)) {
                reject({
                    error: body,
                    response: response
                });
            }
            else {
                resolve({
                    response: response,
                    body: body,
                });
            }
        });
    });
}
function retry() {
    let rnd = 10 * Math.random();
    rnd = rnd * 100;
    if (counter >= 10) {
        rnd = 3696;
        counter = 0;
    }
    console.log(rnd);
    setTimeout(() => {
        main();
    }, rnd);
}
function main() {
    counter++;
    logger_1.default.info("main");
    makeRequest({ url: urlTicketPage, session: sessionID }, { headers: "" })
        .then(({ response, body }) => {
        const $ = cheerio_1.default.load(body);
        // div.childNodes[0].childNodes[0].childNodes[0].href
        $(`.${classname} > ul > div > a`).each((index, element) => {
            ticketPageList.push(ticketSwapMainURL + element.attribs.href);
        });
        logger_1.default.info(ticketPageList);
        logger_1.default.info(ticketPageList.length.toString());
        if (ticketPageList.length === 0) {
            retry();
            throw { error: "no tickets found" };
        }
        logger_1.default.info("TICKETS FOUND!!!");
        // runFound(ticketPageList[0], options)
        exec(`open -a "Brave Browser" ${ticketPageList[0]}`);
        // exec(`start "Google Chrome" "${ticketPageList[0]}"`);
        bot.sendMessage("-1001268022128", 'TICKET FOUND!!');
        bot.sendMessage("-1001268022128", 'Check your cart in the TicketSwap APP');
    })
        .catch(({ error, response }) => {
        logger_1.default.error(error);
        if (error === "Internal Server Error" || error == "Internal Server Error") {
            logger_1.default.info("ERROR === Internal Server Error");
            retry();
        }
    });
    // end main()
}
main();
//# sourceMappingURL=main.js.map