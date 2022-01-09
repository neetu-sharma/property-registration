# property-registration project
Hyperledge-fabric based project
Commands to bootstrap the network(Terminal 1)
1. Go to the property registration project using command:
cd workspace/property-registration/network
2. Command to automatically create crypto-material, channel artifacts, start docker containers, to
create channel, to make peers join the channel and also update the anchor peers for each
organisation:
./fabricNetwork.sh
3.Log into the registrar chaincode container using command(Terminal 2):
docker exec -it registrar.chaincode /bin/bash
4. Start the nodejs application for registrar smart contract using command:
npm run start-dev-registrar
5. Log into the chaincode container using command(Terminal 3):
docker exec -it users.chaincode /bin/bash
6. Start the nodejs application for users smart contract using command:
npm run start-dev-users

7. Command to install and instantiate the chaincode(Terminal 1):
./fabricNetwork.sh instal -v 1.1
8. Commands to log into the peer containers in order to execute transactions(Terminal 4 and
terminal 5):
docker exec -it peer0.registrar.property-registration-network.com /bin/bash
docker exec -it peer0.users.property-registration-network.com /bin/bash

Commands to execute the transactions defined in the chaincode in sequential
order:
9. Commands to execute requestNewUser function to place registration request by
user1 and user2:
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:requestNewUser","user1", "user1@gmail.com", "9494243411",

"1001"]}'
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:requestNewUser","user2", "user2@gmail.com", "9994353321",

"1002"]}'

10. Commands to execute approveNewUser function to approve registration requests
by registrar:
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.registrar:approveNewUser","user1", "1001"]}'

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.registrar:approveNewUser","user2", "1002"]}'

11. Commands to execute propertyRegistrationRequest function to place
propertyregistration requests by user1:
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:propertyRegistrationRequest","user1", "1001", "001", "500"]}'

12.Commands to execute approvePropertyRegistration function to approve
propertyregistration request by registrar:
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.registrar:approvePropertyRegistration","001"]}'

13. Commands to execute updateProperty function to update property status by
user1:
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:updateProperty","user1","1001","001","onSale"]}'

14. Commands to execute rechargeAccount function to recharge account by user2:
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:rechargeAccount","user2", "1002", "upg1000"]}'

15. Commands to execute viewUser function to view account by user2(buyer):
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:viewUser","user1", "1001"]}'

16. Commands to execute viewUser function to view account by user1(seller):

peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:viewUser","user2", "1002"]}'

17. Commands to execute viewProperty function to view property by user2:
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:viewProperty","001"]}'

18. Commands to execute purchaseProperty function to purchase property by
user2(buyer):
peer chaincode invoke -o orderer.property-registration-network.com:7050 -C

registrationchannel -n regnet -c '{"Args":["org.property-registration-
network.regnet.users:purchaseProperty","001","user2","1002"]}'

