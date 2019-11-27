const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
var request = require('request')

const PORT = process.env.PORT || 5000
const app = express().use(bodyParser.json(path.join(__dirname, 'public')));
const PAGE_TOKEN = process.env.PAGE_TOKEN


//BEGJIN Documentacion Facebook URL:https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start/
// Handles messages events paradise
function handleMessage(sender_psid, received_message) {
    //console.log('----------------handleMessage-------------------');
    let response;
    let response2;
    if (received_message.text) { //texto
        if (received_message.text === 'balerinas' || received_message.text === 'Balerinas') { //contenido multimedia
            console.log('----------------balerinas-------------------');
            response = block_balerinas();
            response2 = block_balerinas2();
        } else if (received_message.text === 'categorias' || received_message.text === 'Categorias') {
            console.log('----------------categorias-------------------');
            response = block_categorias();
            response2 = "";
        } else if (received_message.text === 'Plataformas' || received_message.text === 'plataformas') {
            console.log('----------------Plataformas-------------------');
            response = block_plataforma();
            response2 = "";
        } else if (received_message.text === 'Sandalias' || received_message.text === 'sandalias') {
            console.log('----------------Sandalias-------------------');
            response = block_sandalias();
            response2 = "";
        } else if (received_message.text === 'zapatillas' || received_message.text === 'Zapatillas') {
            console.log('----------------zapatillas-------------------');
            response = block_zapatillas();
            response2 = block_zapatillas2();
        } else if (received_message.text === 'Mocasines' || received_message.text === 'mocasines') {
            console.log('----------------Mocasines-------------------');
            response = block_mocasines();
            response2 = block_mocasines2();
        } else if (received_message.text === 'oxfords' || received_message.text === 'Oxfords') {
            console.log('----------------oxfords-------------------');
            response = block_oxfords();
            response2 = "";
        } else if (received_message.text === 'alpargatas' || received_message.text === 'Alpargatas') {
            console.log('----------------alpargatas-------------------');
            response = block_alpargatas();
            response2 = block_alpargatas2();
        }
    } else if (received_message.attachments) { //contenido multimedia
        //		var url =received_message.attachments[0].payload.url;

    }
    callSendAPI(sender_psid, response);
    callSendAPI(sender_psid, response2);

}

// Funcion q permite interactuar con los eventos de fb segun su plantilla
function handlePostback(sender_psid, received_postback) {
    let response;
    let response2
        // Get the payload for the postback
    let payload = received_postback.payload;

    // Set the response based on the postback payload
    if (payload === 'COMPRA') {
        console.log('----------------COMPRA-------------------');
        response = { "text": "nos puedes indicar la TALLA y el COLOR" }
    } else if (payload === 'no') {
        // 	response = { "text": "Oops, vuelve a subir la image." }
    } else if (payload === 'UBICACION') {
        console.log('----------------UBICACION-------------------');
        response = ubicacion();
    } else if (payload === 'TIENDA') {
        console.log('----------------TIENDA-------------------');
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "NUESTROS PRODUCTOS",
                        "image_url": "https://i.ibb.co/7vv08Hm/chat-bot.png",
                        "subtitle": "Ingresa los datos en nuestra plataforma y gestiona tu compra de manera online.",
                        "buttons": [{
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/tienda/",
                            "title": "TIENDA",
                            "webview_height_ratio": "full"
                        }],
                    }],
                }

            }

        }

        //response2=block_btn_entrega();		
    } else if (payload === 'COSTO_ENVIO') {
        console.log('----------------COSTO_ENVIO-------------------');
        response = { "text": "El costo de envío es de 10 soles lima ó 15 a provincia" }
    } else if (payload === 'TIME_ENTREGA') {
        console.log('----------------TIME_ENTREGA-------------------');
        response = { "text": "El envío demora regularmente entre 24 a 72 horas 🕒 (previo aviso)" }
        response2 = { "text": "NOTA: Los productos que se encuentra bajo estatus de RESERVA tienen un tiempo de entrega de 7 días " }
    } else if (payload === 'CATEGORIAS') {
        console.log('----------------CATEGORIAS-------------------');
        response = block_categorias();
    } else if (payload === 'ALPARGATAS') {
        console.log('----------------ALPARGATAS-------------------');
        response = block_alpargatas();
        response2 = block_alpargatas2();
    } else if (payload === 'BALERINAS') {
        console.log('----------------BALERINAS-------------------');
        response = block_balerinas();
        response2 = block_balerinas2();
    } else if (payload === 'MOCASINES') {
        console.log('----------------MOCASINES-------------------');
        response = block_mocasines();
        response2 = block_mocasines2();
    } else if (payload === 'ZAPATILLAS') {
        console.log('----------------ZAPATILLAS-------------------');
        response = block_zapatillas();
        response2 = block_zapatillas2();
    } else if (payload === 'OXFORDS') {
        console.log('----------------OXFORDS-------------------');
        response = block_oxfords();
        response2 = block_oxfords2();
    } else if (payload === 'PLATAFORMAS') {
        console.log('----------------PLATAFORMAS-------------------');
        response = block_plataforma();
    } else if (payload === 'SANDALIAS') {
        console.log('----------------SANDALIAS-------------------');
        response = block_sandalias();
    } //fin else

    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response)
    callSendAPI(sender_psid, response2)

}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    //	console.log('----------------callSendAPI-------------------');
    const requestBody = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };
    //console.log(requestBody);

    // Send the HTTP request to the Messenger Platform
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": process.env.PAGE_TOKEN },
        "method": "POST",
        "json": requestBody
    }, (err, res, body) => {
        if (!err) {
            //	console.log('message sent!')
        } else {
            //	console.error("Unable to send message:" + err);
        }
    });

}

function block_btn_entrega() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Despues de cumplir con los requerimientos, le realizaremos la entrega 🛵",
                "buttons": [{
                        "type": "postback",
                        "title": "¿Costo de Envío?",
                        "payload": "COSTO_ENVIO",
                    },
                    {
                        "type": "postback",
                        "title": "¿Tiempo de Entrega?",
                        "payload": "TIME_ENTREGA",
                    }
                ]
            }
        }
    }
}

function block_categorias() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "ALPARGATAS",
                    "image_url": "https://i.ibb.co/N7MmHHG/b-alpargatas.jpg",
                    "subtitle": "Tallas de 35 a 40",
                    "buttons": [{
                        "type": "postback",
                        "title": "Ver Modelos",
                        "payload": "ALPARGATAS",
                    }],
                }, {
                    "title": "BALERINAS",
                    "image_url": "https://i.ibb.co/djqKKgK/b-balerinas.jpg",
                    "subtitle": "Tallas de 35 a 40",
                    "buttons": [{
                        "type": "postback",
                        "title": "Ver Modelos",
                        "payload": "BALERINAS",
                    }],
                }, {
                    "title": "MOCASINES",
                    "image_url": "https://i.ibb.co/MSFSTSX/b-mocasines.jpg",
                    "subtitle": "Tallas de 35 a 40",
                    "buttons": [{
                        "type": "postback",
                        "title": "Ver Modelos",
                        "payload": "MOCASINES",
                    }],
                }, {
                    "title": "OXFORDS",
                    "image_url": "https://i.ibb.co/XVVMqW7/b-oxf.jpg",
                    "subtitle": "Tallas de 35 a 40",
                    "buttons": [{
                        "type": "postback",
                        "title": "Ver Modelos",
                        "payload": "OXFORDS",
                    }],
                }, {
                    "title": "PLATAFORMAS",
                    "image_url": "https://i.ibb.co/6tQvh2S/b-plataforma.jpg",
                    "subtitle": "Tallas de 35 a 40",
                    "buttons": [{
                        "type": "postback",
                        "title": "Ver Modelos",
                        "payload": "PLATAFORMAS",
                    }],
                }, {
                    "title": "ZAPATILLAS",
                    "image_url": "https://i.ibb.co/c3x3k0S/b-zapatillas.jpg",
                    "subtitle": "Tallas de 35 a 40",
                    "buttons": [{
                        "type": "postback",
                        "title": "Ver Modelos",
                        "payload": "ZAPATILLAS",
                    }],
                }, {
                    "title": "SANDALIAS",
                    "image_url": "https://i.ibb.co/BPDkGvJ/b-sandalias.jpg",
                    "subtitle": "Tallas de 35 a 40",
                    "buttons": [{
                        "type": "postback",
                        "title": "Ver Modelos",
                        "payload": "SANDALIAS",
                    }],
                }]
            }
        }
    }
}

function block_oxfords() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Femme",
                        "image_url": "https://i.ibb.co/K6JGjRK/femme.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Femme",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/femme/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Femme
                    {
                        "title": "Dutty Gamu",
                        "image_url": "https://i.ibb.co/XxjGBDn/dutty-gamu.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Dutty Gamu",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/dutty-gamu/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Dutty Gamu
                    {
                        "title": "Bruna Print",
                        "image_url": "https://i.ibb.co/cQDyjZs/bruna-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Bruna Print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/bruna-snake/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Bruna Print
                    {
                        "title": "Maki Print",
                        "image_url": "https://i.ibb.co/s9V11bB/maki-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Maki Print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/maki-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Maki Print
                    {
                        "title": "Zipper",
                        "image_url": "https://i.ibb.co/6Xw05C5/zipper.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Zipper",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/zipper/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Zipper
                    {
                        "title": "Pante",
                        "image_url": "https://i.ibb.co/09TZYF1/pantera.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Pante",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/pante/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Pante
                    {
                        "title": "Oxxi",
                        "image_url": "https://i.ibb.co/cvCB0HH/oxxi.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Oxxi",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/oxxi/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Oxxi
                    {
                        "title": "Monk",
                        "image_url": "https://i.ibb.co/0XdsqWn/monk.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Monk",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/monk/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Monk
                    {
                        "title": "Maki",
                        "image_url": "https://i.ibb.co/yFp51L7/maki.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Maki",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/maki/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Maki
                    {
                        "title": "Lore",
                        "image_url": "https://i.ibb.co/BB6sbsb/loe.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Lore",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/Lore/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Lore
                ],
            }

        }

    }
}

function block_oxfords2() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Gamu",
                        "image_url": "https://i.ibb.co/0qTGttB/gamu.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Gamu",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/gamu/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Gamu
                    {
                        "title": "Dutty",
                        "image_url": "https://i.ibb.co/0nwWVbY/dutty.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Dutty",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/dutty/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Dutty
                    {
                        "title": "Classic",
                        "image_url": "https://i.ibb.co/5X0T48K/classic.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Classic",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/classic/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Classic
                    {
                        "title": "Bruna",
                        "image_url": "https://i.ibb.co/ZhgJpqN/bruna.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Bruna",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/bruna/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Bruna
                    {
                        "title": "Americana",
                        "image_url": "https://i.ibb.co/1dJBgmx/americana.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Americana",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/americana/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Americana
                ],
            }

        }
    }
}

function block_plataforma() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Polosy",
                        "image_url": "https://i.ibb.co/GcPFY4B/polosy-2.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Polosy",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/polosy/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Polosy
                    {
                        "title": "Ricky Mate Print",
                        "image_url": "https://i.ibb.co/tDNgYXN/ricki-mate-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Ricky Mate Print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/ricky-mate-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Ricky Mate Print
                    {
                        "title": "Ricky Mate",
                        "image_url": "https://i.ibb.co/0F9Th3w/ricky-mate.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Ricky Mate",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/ricky-mate/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Ricky Mate
                    {
                        "title": "Basic II",
                        "image_url": "https://i.ibb.co/Rc7bWc4/basic-2.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Basic II",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/basic-ii/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Basic II
                    {
                        "title": "Ricky Print",
                        "image_url": "https://i.ibb.co/yRY2R8b/rcicky-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Ricky Print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/ricky-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Ricky Print
                    {
                        "title": "Ricky",
                        "image_url": "https://i.ibb.co/HpjjdQH/ricky.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Ricky",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/ricky/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Ricky
                ],

            }

        }

    }
}

function block_sandalias() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Greccy",
                        "image_url": "https://i.ibb.co/LtJQB1N/grect.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Greccy",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/greccy/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Greccy
                ],
            }

        }
    }
}

function block_balerinas() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Punto",
                        "image_url": "https://i.ibb.co/qB0961T/punto.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Punto",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Punto&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Punto
                    {
                        "title": "Lien",
                        "image_url": "https://i.ibb.co/rGnDtSd/lien.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Lien",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Lien&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Lien
                    {
                        "title": "Daly",
                        "image_url": "https://i.ibb.co/PZFRXtm/daly.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Daly",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/daly/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Daly
                    {
                        "title": "Daly print",
                        "image_url": "https://i.ibb.co/YPxjZxd/daly-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Daly",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/daly-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Daly print
                    {
                        "title": "Rizzy",
                        "image_url": "https://i.ibb.co/Nr9mYj3/rizzi.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Rizzy",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Rizzy&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Rizzy
                    {
                        "title": "Sneik",
                        "image_url": "https://i.ibb.co/Jz9RnGN/sneik.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Sneik",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Sneik&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Sneik
                    {
                        "title": "Lalo",
                        "image_url": "https://i.ibb.co/nrMYyfk/lalo.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Lalo",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Lalo&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Lalo
                    {
                        "title": "Pelu",
                        "image_url": "https://i.ibb.co/84T6YxV/pelu.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Pelu",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Pelu&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Pelu
                    {
                        "title": "Sogui",
                        "image_url": "https://i.ibb.co/DWMsYns/sogui.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Sogui",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Sogui&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Sogui
                    {
                        "title": "Gia",
                        "image_url": "https://i.ibb.co/x16qnwk/gia.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Gia",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Gia&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Gia
                ],
            }

        }
    }
}

function block_balerinas2() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Novvu",
                        "image_url": "https://i.ibb.co/MnTXwXL/novu.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Novvu",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Novvu&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Novvu
                    {
                        "title": "Pton",
                        "image_url": "https://i.ibb.co/sKY47Lq/pinton.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Pton",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Pton&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Pton
                    {
                        "title": "Taiga",
                        "image_url": "https://i.ibb.co/MNJqNhf/taiga.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Taiga",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Taiga&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Taiga
                    {
                        "title": "Cobita Mate",
                        "image_url": "https://i.ibb.co/9wZ56qj/cobita-mate.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Cobita Mate",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Cobita&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Cobita Mate
                    {
                        "title": "Cobita Charol",
                        "image_url": "https://i.ibb.co/TTXfF0f/cobita-charol.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Cobita Charol",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/?s=Cobita&post_type=product",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //
                ],
            }

        }
    }
}

function block_zapatillas() {
    return resp = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Fanny II",
                        "image_url": "https://i.ibb.co/DpLjGZv/fanny-2.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Fanny II",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/fanny-ii/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Fanny II
                    {
                        "title": "Dolce II",
                        "image_url": "https://i.ibb.co/jvkRQtB/dolce-II.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Dolce II",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/dolce-ii/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Dolce II cuadro
                    {
                        "title": "Fany",
                        "image_url": "https://i.ibb.co/DVcxwhQ/fanny.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Fany",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/fany/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Fany
                    {
                        "title": "Aqua Print",
                        "image_url": "https://i.ibb.co/TTc7Wyh/aqua-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Aqua Print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/aqua-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Aqua Print
                    {
                        "title": "Aqua",
                        "image_url": "https://i.ibb.co/phvSpn0/aqua.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Aqua",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/aqua/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Aqua
                    {
                        "title": "Flex Print",
                        "image_url": "https://i.ibb.co/LvpQcJy/Flex-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Flex Print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/flex-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Flex Print
                    {
                        "title": "Elastic Print",
                        "image_url": "https://i.ibb.co/VjJggLF/elastic-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Elastic Print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/elastic-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Elastic Print
                    {
                        "title": "Étnica",
                        "image_url": "https://i.ibb.co/PZ4Pvt9/etnica.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Étnica",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/etnica/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Étnica
                    {
                        "title": "Bonnie",
                        "image_url": "https://i.ibb.co/bXJ4h0d/bonie.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Bonnie",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/bonnie/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Bonnie
                    {
                        "title": "Evie",
                        "image_url": "https://i.ibb.co/hs8xSqz/evie.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Evie",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/evie/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Evie
                ],
            }

        }

    }
}



function ubicacion() {
    return response = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "UBICACION",
                    "image_url": "https://i.ibb.co/T85GpbB/splash.png",
                    "subtitle": "C.C. la Rotonda, Av. la Fontana 440, La Molina 15024",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.google.com/maps/place/Balerinasymas/@-12.0733821,-76.9569352,17z/data=!3m1!4b1!4m5!3m4!1s0x9105c73fddb22c01:0x7150f6b241864093!8m2!3d-12.0733821!4d-76.9547465",
                        "title": "TIENDA LA MOLINA",
                        "webview_height_ratio": "full"
                    }],
                }],
            }

        }

    }
}

function block_zapatillas2() {
    return resp = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Cassu",
                        "image_url": "https://i.ibb.co/Hg7HYrt/cassu.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Cassu",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/cassu/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Cassu
                    {
                        "title": "Cubic",
                        "image_url": "https://i.ibb.co/3N07FPt/cubic.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Cubic",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/cubic/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Cubic
                    {
                        "title": "Dolce",
                        "image_url": "https://i.ibb.co/6NqHY0T/dolce.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Dolce",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/dolce/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Dolce
                    {
                        "title": "Elastic",
                        "image_url": "https://i.ibb.co/b3pyL32/elastic.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Elastic",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/elastic/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Elastic
                    {
                        "title": "Exchaing",
                        "image_url": "https://i.ibb.co/zGQY6SF/exchaing.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Exchaing",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/exchaing/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Exchaing
                    {
                        "title": "Fuxon",
                        "image_url": "https://i.ibb.co/K6KkCyQ/fuxion.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Fuxon",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/fuxon/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Fuxon
                    {
                        "title": "Relax",
                        "image_url": "https://i.ibb.co/YdSLwnh/relax.png",
                        "buttons": [{
                                "type": "postback",
                                "title": "😍 Relax",
                                "payload": "COMPRA",
                            }, {
                                "type": "web_url",
                                "url": "https://www.balerinasymas.com/producto/relax/",
                                "title": "Mas Info",
                                "webview_height_ratio": "full",
                            }

                        ],
                    }, //Relax
                    {
                        "title": "Flex",
                        "image_url": "https://i.ibb.co/vc48shM/flex.png",
                        "buttons": [{
                                "type": "postback",
                                "title": "😍 Flex",
                                "payload": "COMPRA",
                            }, {
                                "type": "web_url",
                                "url": "https://www.balerinasymas.com/producto/flex/",
                                "title": "Mas Info",
                                "webview_height_ratio": "full",
                            }

                        ],
                    } //flex
                ],
            }
        }
    }
}

function block_alpargatas() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Paradise",
                        "image_url": "https://i.ibb.co/nCvMT0Z/paradise.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Paradise",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/paradise/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Paradise
                    {
                        "title": "Egipcia",
                        "image_url": "https://i.ibb.co/QdZ5ryD/egipcia.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 la Egipcia",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/32RfNqB",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Egipcia
                    {
                        "title": "Reinbou",
                        "image_url": "https://i.ibb.co/S7tmfwc/reinbou.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Reinbou",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2XVzr1s",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Reinbou
                    {
                        "title": "Taiga print",
                        "image_url": "https://i.ibb.co/7SGjD5z/taiga-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Taiga print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/taiga-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Taiga
                    {
                        "title": "Folaime",
                        "image_url": "https://i.ibb.co/fDsPwGK/folaime.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Folaime",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/folaime/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Folaime
                    {
                        "title": "Seda",
                        "image_url": "https://i.ibb.co/jMQzbs0/seda.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Seda",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/seda/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Seda
                    {
                        "title": "Matrix",
                        "image_url": "https://i.ibb.co/r5TT6S4/matrix.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Matrix",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2UxHxjD",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Matrix
                    {
                        "title": "Lassy",
                        "image_url": "https://i.ibb.co/wR9GbXT/lassy.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Lassy",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2SEZLvp",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Lassy
                    {
                        "title": "Tolteca",
                        "image_url": "https://i.ibb.co/GChPhKh/tolteca.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Tolteca",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2GccMGC",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Tolteca
                ],
            }

        }
    }
}

function block_mocasines() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Militar",
                        "image_url": "https://i.ibb.co/p4y3xKq/militar.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Militar",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/militar/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Militar
                    {
                        "title": "Lummy",
                        "image_url": "https://i.ibb.co/TwQWrNQ/lummy.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Lummy",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/lummy/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Lummy
                    {
                        "title": "Galacticas",
                        "image_url": "https://i.ibb.co/y5Z5pj9/galacticas.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Galacticas",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/galactica/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Galacticas
                    {
                        "title": "Duke print",
                        "image_url": "https://i.ibb.co/YQHywQh/duke-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Duke print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/duke-print/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Duke print
                    {
                        "title": "kovan",
                        "image_url": "https://i.ibb.co/d2fJ8Fn/kovan.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 kovan",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/kovan/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //kovan
                ],
            }

        }
    }

}

function block_mocasines2() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Loo",
                        "image_url": "https://i.ibb.co/THkk4pS/loo.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Loo",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/loo/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Loo
                    {
                        "title": "Top",
                        "image_url": "https://i.ibb.co/Ydjs82z/Top.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Top",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/top/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Top
                    {
                        "title": "Origi",
                        "image_url": "https://i.ibb.co/c81tLTm/origi.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Origi",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/origi/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Origi
                    {
                        "title": "Yesi",
                        "image_url": "https://i.ibb.co/HYP6Qcm/yesi.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Yesi",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/yesi/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Yesi
                    {
                        "title": "Cecy",
                        "image_url": "https://i.ibb.co/W5DwjQG/cecy.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Cecy",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "https://www.balerinasymas.com/producto/cecy/",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    } //Cecy
                ],
            }

        }
    }
}

function block_alpargatas2() {
    return response2 = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                        "title": "Cuadro",
                        "image_url": "https://i.ibb.co/MDyYJbz/cuadro.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Cuadro",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2O8ndz3",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Cuadro
                    {
                        "title": "Japy",
                        "image_url": "https://i.ibb.co/m05b5cN/jappy.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Japy",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2lb7GUK",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Japy
                    {
                        "title": "Laau",
                        "image_url": "https://i.ibb.co/B4bypFF/laau.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Laau",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2NIh4uz",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //Laau
                    {
                        "title": "Paradise print",
                        "image_url": "https://i.ibb.co/hcLYCM6/paradise-print.png",
                        "buttons": [{
                            "type": "postback",
                            "title": "😍 Paradise print",
                            "payload": "COMPRA",
                        }, {
                            "type": "web_url",
                            "url": "http://bit.ly/2NIh4uz",
                            "title": "Mas Info",
                            "webview_height_ratio": "full",
                        }],
                    }, //paradise print
                ],
            }
        }
    }
}

function menuButton() {
    //	console.log('----------------menuButton-------------------');
    var messageData = {
        locale: "es_LA",
        setting_type: "call_to_actions",
        composer_input_disabled: true,
        thread_state: "existing_thread",
        call_to_actions: [{
                type: "postback",
                title: "TIENDA",
                payload: "TIENDA"
            },
            {
                type: "postback",
                title: "MODELOS",
                payload: "CATEGORIAS"
            },
            {
                type: "postback",
                title: "UBICACION",
                payload: "UBICACION"
            }
        ]
    }
    request({
        uri: "https://graph.facebook.com/v2.6/me/thread_settings",
        qs: { "access_token": process.env.PAGE_TOKEN },
        method: "POST",
        json: messageData
    }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;

            console.log(`Successfully sent generic message with id ${messageId} to  ${recipientId}`);
        } else {
            console.error("Unable to send message.");
            //  console.error(response);
            console.error(error);
        }
    });
}

//END fb


/*
INDEX del server
*/
app.get('/', (req, res) => {
    res.status(200).send('bot de facebook')
});


/*
POST
URL:https://desolate-lowlands-59843.herokuapp.com/webhook
PARAMETROS:?hub.verify_token=stringtocken&hub.challenge=CHALLENGE_ACCEPTED&hub.mode=subscribe
*/
app.post('/webhook', (req, res) => {
    //	console.log('POST:----------------webhook-------------------');
    var data = req.body;
    if (data.object == 'page') {
        //menu de facebook
        menuButton();


        data.entry.forEach(entry => {
            var pageID = entry.id;
            var timeOfEvent = entry.time;
            //se reciben y procesan los mensajes
            var webhookEvent = entry.messaging[0];
            //entry.postback
            //Obtener id del mesaje de face
            const sender_psid = webhookEvent.sender.id;
            //console.log(`SENDER_PSID: ${sender_psid}`);

            //validar que estamos recibiedo un msj
            if (webhookEvent.message) {
                handleMessage(sender_psid, webhookEvent.message);

            } else if (webhookEvent.postback) {
                handlePostback(sender_psid, webhookEvent.postback);
            }

        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }





});

/*
Verificar la conexion correcta con el webhook de face por consola msj
*/
app.get('/webhook', (req, res) => {
    console.log('GET: webhook');
    const VERIFY_TOKEN = 'stringtocken';
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge']

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('CORRECTO WEBHOOK');
            res.status(200).send(challenge)
        } else {
            res.sendStatus(404);
        }
    } else {
        res.sendStatus(404);
    }

});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))