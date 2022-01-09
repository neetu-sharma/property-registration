'use strict';

const {Contract} = require('fabric-contract-api');

class usersContract extends Contract {	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.users');
	}
	
	/* ****** All custom functions are defined below ***** */
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('userscontract Smart Contract Instantiated');
	}
	
	/**
	 * Create a new user request to register on the network
	 * @param ctx - The transaction context object
	 * @param Name - Name of the user
	 * @param Email_ID - Email ID of the user
	 * @param Phone_Number - Phone number of the user
	 * @param Aadhar_Number -Aadhar number of the user
	 * @returns
	 */
	//This function is defined so that users can request the registrar to register them on the property-registration-network. 
	async requestNewUser(ctx, Name, Email_ID, Phone_Number, Aadhar_Number) {
		let msgSender = ctx.clientIdentity.getID();
		// Create a new composite key for the new user request
		console.log('regnet Smart Contract Instantiated');
		let userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.request', [Name + '-' + Aadhar_Number]);
			
		// Create a user object to be stored in blockchain
		let newUserObject = {
			Name: Name,
			Email_ID: Email_ID,
			Phone_Number: Phone_Number,
			Aadhar_Number: Aadhar_Number,
			User: msgSender,
			createdAt: new Date(),
			updatedAt: new Date(),
			};
			
		// Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(newUserObject));
		await ctx.stub.putState(userKey, dataBuffer);
		// Return value of new user object
		return newUserObject;
	}
		
			
	/**
	 *
	 * @param ctx
	 * @param Name
	 * @param Aadhar_Number
	 * @param Bank_Transaction_ID
	 * @returns {Object}
	 */
    //This function is defined so that user can recharge their account with ‘upgradCoins’.
	async rechargeAccount(ctx, Name, Aadhar_Number, Bank_Transaction_ID) {
	    let registereduserKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.user', [Name + '-' + Aadhar_Number]);
		let rechargeCoins;
		// Fetch registered user with given name and Aadhar number from blockchain
		let userbuffer = await ctx.stub
			    .getState(registereduserKey)
				.catch(err => console.log(err));
		let userobject = JSON.parse(userbuffer.toString());

		// Make sure that registered user already exist.
		if (userobject.length === 0) {
			throw new Error('Invalid Aadhar_Number: ' + Aadhar_Number + ' Name: ' + Name + '. Registered user does not exist.');
		} else {
						
		// Recharge coins based on bank transaction id
		switch (Bank_Transaction_ID) {
			case 'upg100':
			  rechargeCoins = 100;
			  break;
			case 'upg500':
			  rechargeCoins = 500;
			  break;
			case 'upg1000':
			  rechargeCoins = 1000;
			  break;
			default:
			  throw new Error('Invalid Bank Transaction ID');
		}
		userobject.upgradCoins += rechargeCoins;

		// Convert the JSON object to a buffer and send it to blockchain for storage
		let registereduserBuffer = Buffer.from(JSON.stringify(userobject));
		await ctx.stub.putState(registereduserKey, registereduserBuffer);
		// Return value of updated registered user object 
	    return userobject;
		}
	}

	/**
	 * @param ctx - The transaction context
	 * @param Name
	 * @param Aadhar_Number
	 * @returns
	 */
	// This function is defined to view the current state of any user from the blockchain by user or registrar.
	async viewUser(ctx, Name, Aadhar_Number) {
	    // Create the composite key required to fetch record from blockchain
	    let registereduserKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [Name + '-' + Aadhar_Number]);

	     // Fetch registered user with given name and Aadhar number from blockchain
		let registereduserBuffer = await ctx.stub
			    .getState(registereduserKey)
			    .catch(err => console.log(err));
		return JSON.parse(registereduserBuffer.toString());
	}
		
	/**
	 * Create a new property request to register on the network
	 * @param ctx - The transaction context object
     * @param Name - Name of the owner
	 * @param Aadhar_Number - Aadhar number of the owner
	 * @param Property_ID - ID of the property
	 * @param Price - Price of the property
	 * @returns
	 */
	//This function is defined so that user can register the details of their property on the property-registration-network. 
	async propertyRegistrationRequest (ctx, Name, Aadhar_Number, Property_ID, Price) {
		// Create a new composite key for the new property request
		let propertyrequestKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.request', [Property_ID]);
		let registereduserKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.user', [Name + '-' + Aadhar_Number]);

		// Fetch registered user with given name and Aadhar number from blockchain
		let userbuffer = await ctx.stub
				.getState(registereduserKey)
				.catch(err => console.log(err));
		let registereduserObject = JSON.parse(userbuffer.toString());

		// Make sure that user already exist
	    if (registereduserObject.length === 0) {
			throw new Error('Invalid Aadhar_Number: ' + Aadhar_Number + ' Invalid Name: ' + Name + '. User does not exist.');
		} 
		else {
		// Create a propertyrequest object to be stored in blockchain
		let newproperyRequestObject = {
			Name: Name,
			Aadhar_Number: Aadhar_Number,
			Property_ID: Property_ID,
			Owner: Name + '-' + Aadhar_Number,
			Price: Price,
			Status: "registered",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
			
		// Convert the JSON object to a buffer and send it to blockchain for storage
		let propertyRequestBuffer = Buffer.from(JSON.stringify(newproperyRequestObject));
		await ctx.stub.putState(propertyrequestKey, propertyRequestBuffer);
		// Return value of new pr0perty request object
		return newproperyRequestObject;
		}
	}

	/**
	 * update property on the network
	 * @param ctx - The transaction context object
	 * @param Name - Name of the owner
	 * @param Aadhar_Number - Aadhar number of the owner
	 * @param Property_ID - ID of the property
	 * @param Status -Status shows two values: ‘registered’ and ‘onSale’. 
	 * @returns
	 */
	//This function is used by the registered users in order to change the status of their property.
	async updateProperty(ctx, Name, Aadhar_Number, Property_ID, Status) {
		let propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property', [Property_ID]);

		// Fetch property with given property ID from blockchain
		let propertybuffer = await ctx.stub
		        .getState(propertyKey)
		        .catch(err => console.log(err));
	    // Convert the received property buffer to a JSON object
	    let propertyobj = JSON.parse(propertybuffer.toString());

	    // Make sure that user invoking the function is the owner of the property.
	    if (propertyobj === 0 ||  propertyobj.Owner !== Name + '-' + Aadhar_Number) {
			throw new Error('Invalid user not owner to update property status.');
		} else {
		let updatedpropertyObject = Object.assign(propertyobj, {Status,  updatedAt : new Date()});
		// Convert the JSON object to a buffer and send it to blockchain for storage
		let propertyBuffer = Buffer.from(JSON.stringify(updatedpropertyObject));
		await ctx.stub.putState(propertyKey, propertyBuffer);
		// Return value of updated property object
		return updatedpropertyObject;
		}
	}

	
	/**
	 * This function is defined to view the current state of any property registered on the ledger by user or registrar.
	 * @param ctx - The transaction context
	 * @param Property_ID - property ID for which to fetch details
	 * @returns
	 */
	 async viewProperty(ctx, Property_ID) {
		// Create the composite key required to fetch record from blockchain
		let propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.property', [Property_ID]);
		// Return value of registered property from blockchain
		let propertyBuffer = await ctx.stub
				.getState(propertyKey)
				.catch(err => console.log(err));
		return JSON.parse(propertyBuffer.toString());
	}

    /**
	 * purchase property on the network
     * @param ctx - The transaction context object
     * @param buyerName - Name of the buyer
	 * @param buyerAadhar - Aadhar number of the buyer
	 * @param Property_ID - ID of the property
	 * @returns
	 */
	//This function is defined so that registered users can purchase the property listed for sale on the network.
	
	async purchaseProperty (ctx, Property_ID, buyerName, buyerAadhar) {
		let propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.property', [Property_ID]);
		let registereduserKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.user', [buyerName + '-' + buyerAadhar]);

		// Fetch buyer with given name and adhar number from blockchain
	    let userbuffer = await ctx.stub
	            .getState(registereduserKey)
	            .catch(err => console.log(err));
	    // Convert the received buyer buffer to a JSON object
	   const buyer = JSON.parse(userbuffer.toString());
	
	    // Fetch property with given property ID from blockchain
	    let propertybuffer = await ctx.stub
	           .getState(propertyKey)
	           .catch(err => console.log(err));
        // Convert the received property buffer to a JSON object
        let propertyobj = JSON.parse(propertybuffer.toString());
	    let sellerName = propertyobj.Name;
	    let sellerAadhar = propertyobj.Aadhar_Number;
	    let sellerKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.user', [sellerName + '-' + sellerAadhar]);

	    // Fetch seller with given name and aadhar number from blockchain
	    let sellerbuffer = await ctx.stub
	           .getState(sellerKey)
	           .catch(err => console.log(err));
	    // Convert the received seller buffer to a JSON object
    	const seller = JSON.parse(sellerbuffer.toString());
	
	    //To check the status of the property by verifying whether it is listed for sale or not and buyer has a sufficient account balance.
		if (propertyobj.Status !== "onSale" || buyer.upgradCoins < propertyobj.price) {
			throw new Error('Either Property not listed for sale or buyer has insufficient balance.');
		} else {
			// update buyer account
			let buyerObject = Object.assign(buyer, {upgradCoins: buyer.upgradCoins - propertyobj.price, createdAt : new Date(), updatedAt : new Date()});
            // Convert the buyer JSON object to a buffer and send it to blockchain for storage
			let registereduserBuffer = Buffer.from(JSON.stringify(buyerObject));
			await ctx.stub.putState(registereduserKey, registereduserBuffer);
			
			// update propery details
			let updatedpropertyObject = Object.assign(propertyobj, {Name: buyerName, Aadhar_Number: buyerAadhar, Owner: buyerName + '-' + buyerAadhar, Status: "registered",  updatedAt : new Date()});
	    	// Convert the property JSON object to a buffer and send it to blockchain for storage
			let propertyBuffer = Buffer.from(JSON.stringify(propertyObject));
			await ctx.stub.putState(propertyKey, propertyBuffer);

			// update seller account
			let selleruserObject =Object.assign(seller, {upgradCoins: seller.upgradCoins + propertyobj.price, createdAt : new Date(), updatedAt : new Date()});
			// Convert the JSON object to a buffer and send it to blockchain for storage
			let selleruserBuffer = Buffer.from(JSON.stringify(selleruserObject));
			await ctx.stub.putState(sellerKey, selleruserBuffer);
			//Return value of updated buyer object, updated seller object and updated property object 
			return buyerObject, selleruserObject, updatedpropertyObject;	
		}
	}
		     
}
module.exports = usersContract;