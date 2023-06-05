const axios = require("axios");
const redis = require("ioredis");

const sendMessage = async (req, res) => {
	try {
		const client = redis.createClient({
			host: process.env.REDIS_HOST,
			port: process.env.REDIS_PORT,
		});

		const previousResponse = await client.get(req.body?.user?.phone);

		let message = req.body.message.text.toLowerCase(); /* Remove case sensitivity */
        let forwardedMsg = "";

        if (!previousResponse)
        {
            switch (message) {
                case "hi":
                case "hey":
                case "hello":
                    forwardedMsg =
                        "hi, welcome to TechOn. How may we help you today?\n1. Customer support\n2. Sales";
                    break;
            }
        }
		

        if (previousResponse === "hi, welcome to TechOn. How may we help you today?\n1. Customer support\n2. Sales")
        {
            
            if (message === "1") {
                forwardedMsg = "we'll connect you to support shortly, is there anything else I can do for you?"
            }
            else 
            {
                forwardedMsg = "sales will reach out to you, is there anything else I can do for you?"
            }
        }

        if (previousResponse === "we'll connect you to support shortly, is there anything else I can do for you?" || previousResponse === "sales will reach out to you, is there anything else I can do for you?" )
        {
            
            if (message === "1") {
                forwardedMsg = "please type your query"
            }
            else 
            {
                forwardedMsg = "thanks for your time"
            }
        }
        
        if (previousResponse === "please type your query")
        {
            forwardedMsg = "thanks we'll look into it."
        }

		const payload = {
			to_number: req.body.user.phone,
			type: req.body.message.type,
			message: forwardedMsg,
		};

		const headers = {
			"x-maytapi-key": process.env.TOKEN,
		};
        
        const response = await axios.post(
			`https://api.maytapi.com/api/${process.env.PRODUCT_ID}/${process.env.PHONE_ID}/sendMessage`,
			payload,
			{
				headers: headers,
			}
		);

		await client.set(
			req.body?.user?.phone,
			forwardedMsg,
			"EX",
			"400"
		);

		return res.status(200).json(response.data);
	} catch (error) {
		console.log(error);
	}
};

module.exports = sendMessage;
