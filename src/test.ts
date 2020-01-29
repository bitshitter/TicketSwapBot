// function parseHTML(result:any) {
//     var $ = cheerio.load(result.body);

//     var form = $('#listing-reserve-form');
//     var _endpoint = form.data('endpoint');
//     var csrf = $('meta[name="csrf_token"]')[0].attribs.content;

//     let availableTickets = 0;
//     form.find('select[name="amount"] option').each(function(item) {
//         let value:any = $(item).attr('value');
//         value = parseInt(value, 10);

//         if (isNaN(value)) {
//             throw new TypeError('Expected option.value to be of type number');
//         }

//         if (value > availableTickets) {
//             availableTickets = value;
//         }
//     });

//     return {
//         form,
//         _endpoint,
//         availableTickets,
//         csrf,
//     };
// }

// function process({ form, csrf, availableTickets, _endpoint }:any, link:any, options:any) {
//     if (! _endpoint) {
//         logger.warn('Ticket already sold :(!');
//         return Promise.resolve({ alreadySold: true });
//     }

//     var endpoint = ticketSwapMainURL + _endpoint;
//     var token = form.find('input[name="token"]').attr('value');
//     var reserveToken = form.find('input[name="reserve[_token]"]').attr('value');

//     // var toReserve = Math.min(options.amount, availableTickets);
//     var toReserve = 1;

//     logger.info([
//             ``,
//             `Reserving ticket:`,
//             `token          : ${token}`,
//             ` reserve[_token] : ${reserveToken}`,
//             ` csrf_token      : ${csrf}`,
//             ` amount         : ${toReserve}`,
//             ``,
//         ].join('\n'));

//     return makeRequest({ url: endpoint, session: sessionID }, {
//         method: 'POST',
//         authenticated: true,
//         headers: {
//             'x-csrf-token': csrf,
//         },
//         form: {
//             'reserve[_token]': reserveToken,
//             token,
//             amount: 1,
//         }
//     })
//     .catch((err:any) => {
//         logger.error(err)
//         throw err;
//     });
// }

// function runFound(link:any, options:any) {
//     // STEP 1 submit form
//     // STEP 2 request /cart

//     makeRequest({ url: link, session: sessionID }, { authenticated: true })
//         .then(parseHTML)
//         .then((result:any) => process(result, link, options))
//         .then((result:any) => {
//             if (result.alreadySold) {
//                 return result;
//             }

//             logger.info("found a ticket, now opening your cart!"); // replace with telegram API
//             // exec('open -a "Google Chrome" https://www.ticketswap.nl/cart');
//             exec('start "Google Chrome" "https://www.ticketswap.com/cart"');

//             return {
//                 alreadySold: false,
//             };
//         });
// }