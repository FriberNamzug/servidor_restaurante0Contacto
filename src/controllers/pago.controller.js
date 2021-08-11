import Usuario from "../models/usuario.model"

import mercadopago from "mercadopago";
mercadopago.configurations.setAccessToken("TEST-6038542353410572-063022-6d3140c53893b993fe33c56a74f37799-374333615"); 

export const create_preferences = (req,res) => {
    let preference = {
		items: [{
			title: req.body.description,
			unit_price: Number(req.body.price),
			quantity: Number(req.body.quantity),
		}],
		back_urls: {
			"success": "http://localhost:8080/feedback",
			"failure": "http://localhost:8080/feedback",
			"pending": "http://localhost:8080/feedback"
		},
		auto_return: 'approved',
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({id :response.body.id})
		}).catch(function (error) {
			console.log(error);
		});
}




export const feedback = (request,response) => {
	 response.json({
		Payment: request.query.payment_id,
		Status: request.query.status,
		MerchantOrder: request.query.merchant_order_id
	})
}

/////////////////////////////////////////////////////////////
