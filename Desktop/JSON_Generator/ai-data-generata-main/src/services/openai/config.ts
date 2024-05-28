import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

interface Prompt {
  dataOf: string;
  amount: string;
  dataTypes: { value: string; type: string }[];
}

export async function createAnswer(prompt: Prompt) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0.1,
    messages: [
      {
        role: "system",
        content: `Imagine that you are an expert in the generating hierarchial JSON in Retail banking domain

        Generate a JSON structure for multiple use case which are listed here "{Use Case Names}". This structure should represent a hierarchy 
        for querying different use case. There is maximum "{number}" level of hierarchy. Fields which will be present at each level is "{fieldNames}". 
        
        We have list of keywords that can be the part of different level of hierarchy. Before creating a JSON always pick the names from these list for different hierarchy. 
        Strictly pick only those key words which is present in the user input. You can pick only one key word from any list at a time to create the hierarchy.

        List1 : "Account", "Profile"
        List2 : "Email", "physical address"
        List3 : "Checking Account", "Savings Account", "Mortgage", "Credit Card", "Line Of Credit", "Loan", "IRA", "CD"
        
        Also List1 contains the primary level of hierarchy always.
        Also "name" field should strictly contain only the keywords from above lists not usecase name.
        One list keywords should be present at same level of hierarchy, keywords from same list can't have parent child relation.
        Use case name should be present at the end of hierarchy only which is leaf node.
        If use case name(ucName) is not null then children should be empty because that is leaf node.
        name and ucname are different, name should strictly contains only the keywords present in the list.
        name and ucname can't be same.
        ucname should be present at the leaf or when the children is empty array otherwise it must be null. use case names should not be present in name field.
        
        Below are some fields and there default Values :
        
        askEntity should be true by default
        Entity Prompt should be "What you want to choose?"
        Use Case Name (ucName) will be null if it is not leaf node of the hierachy
        Default Value (defaultValue): Leave as null for the root entity.
        Entity ID (entityId): Leave as null for each hierarchy
        Child Entity ID (childEntityId): Leave as null for each hierarchy
        
        Example 1 : Suppose user utternace is "show debit card fund transfer limit", "show credit card fund transfer limit" and "show credit card credit limit" then the output should be
        
        Output JSON should be like : 
        [
          {
          "name": "fundTransferLimit",
          "askEntity" : true,
          "entityPrompt" : "What you want to choose?",
          "ucName" : null,
          "defaultValue" : null,
          "entityId" : "null",
          "childEntityId": "null",
          "children": [
              {
                  "name": "Debit Card",  
                  "askEntity" : true,
                  "entityPrompt" : "What you want to choose?", 
                  "ucName" : "show debit card fund transfer limit",
                  "defaultValue" : null,
                  "entityId" : "null",
                  "childEntityId": null,
                  "children": []
              },
              {
                "name": "Credit Card",  
                "askEntity" : true,
                "entityPrompt" : "What you want to choose?", 
                "ucName" : "show credit card fund transfer limit",
                "defaultValue" : null,
                "entityId" : "null",
                "childEntityId": null,
                "children": []
            }]
        },
        {
          "name": "creditLimit",
          "askEntity" : true,
          "entityPrompt" : "What you want to choose?",
          "ucName" : null,
          "defaultValue" : null,
          "entityId" : "null",
          "childEntityId": "null",
          "children": [
              {
                "name": "Credit Card",  
                "askEntity" : true,
                "entityPrompt" : "What you want to choose?", 
                "ucName" : "show Credit card fund transfer limit",
                "defaultValue" : null,
                "entityId" : "null",
                "childEntityId": null,
                "children": []
            }
        ]
      }
      ]
        
        Use Case Name : ${prompt.dataOf}
        number : ${prompt.amount}
        fieldNames {
                  ${prompt.dataTypes.map((type) => {
                    return `${type.value}: ${type.type}`;
                  })}
                }
        
                Output JSON should be like this Response {
                  data: Data[];
                }

        The JSON structure will adapt dynamically based on the use case name provided, generating a hierarchy that reflects the specific type of limit associated with that use case.`
     },
    ],
    max_tokens: 2048,
  });

  console.log("Hi"+ prompt.dataOf);
  return response.data.choices[0].message;
}
