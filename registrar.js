'use strict';

const {Contract} = require('fabric-contract-api');

class registrarContract extends Contract {	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.registrar');
	}
	
	/* ****** All custom functions are defined below ***** */
	
	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('registrar Smart Contract Instantiated');
	}
	
	/**
	 *
	 * @param ctx
	 * @param Name
	 * @param Aadhar_Number
	 * @returns {Object}
	 */
	//This function is defined so that registrar can register a new user on the ledger based on the request received. 
	async approveNewUser(ctx, Name, Aadhar_Number) {
		let msgSender = ctx.clientIdentity.getID();
		let userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.request', [Name + '-' + Aadhar_Number]);
		let registereduserKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [Name + '-' + Aadhar_Number]);

		// Fetch user request with given name and adhar number from blockchain
		let requestbuffer = await ctx.stub
				.getState(userKey)
				.catch(err => console.log(err));
		let userObject = JSON.parse(requestbuffer.toString());

		// To make sure that user request already exists.
		if (userObject.length === 0) {
		    throw new Error('Invalid Aadhar_Number: ' + Aadhar_Number + ' or Invalid Name: ' + Name + '. user request does not exist.');
		} else {
			let newregistereduserObject = Object.assign(userObject, {registrar : msgSender, upgradCoins : 0, createdAt : new Date(), updatedAt : new Date()});
			// Convert the JSON object to a buffer and send it to blockchain for storage
			let registereduserBuffer = Buffer.from(JSON.stringify(newregistereduserObject));
			await ctx.stub.putState(registereduserKey, registereduserBuffer);
			// Return value of newly registered user 
			return newregistereduserObject;
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
	 * @param ctx - The transaction context object
	 * @param Property_ID - ID of the property
	 * @returns
	 */
	//This function is defined so that registrar can create a new ‘Property’ asset on the network after approving request received for property registration.
	async approvePropertyRegistration(ctx, Property_ID) {
		let msgSender = ctx.clientIdentity.getID();
		let propertyrequestKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.request', [Property_ID]);
        let propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.property', [Property_ID]);

		// Fetch property request with given property ID from blockchain
		let request = await ctx.stub
				.getState(propertyrequestKey)
				.catch(err => console.log(err));
		let propertyObject = JSON.parse(request.toString());

		// Make sure that property registration request with given ID exist.
	    if (propertyObject.length === 0 ) {
		    throw new Error('property ID: ' + Property_ID  + '. property does not exist.');
	    } else {
		    let newpropertyObject = Object.assign(propertyObject, {registrar : msgSender, createdAt : new Date(), updatedAt : new Date()});
		
		    // Convert the JSON object to a buffer and send it to blockchain for storage
		    let propertyBuffer = Buffer.from(JSON.stringify(newpropertyObject));
		    await ctx.stub.putState(propertyKey, propertyBuffer);
		    // Return value of new 
		    return newpropertyObject;
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
	
}
module.exports = registrarContract;