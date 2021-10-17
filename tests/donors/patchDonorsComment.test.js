const {badhanAxios} = require('../../api');
const validate = require('jsonschema').validate;
const env = require('../../config/config');
const {processError} = require('../fixtures/helpers');

test('PATCH/donors/comment', async () => {
    try {
        let signInResponse = await badhanAxios.post('/users/signin', {
            phone: "8801521438557",
            password: env.MAHATHIR_PASSWORD
        });

        let response = await badhanAxios.patch('/donors/comment', {
            "donorId":env.DONOR_ID,
            "comment":"Developer of Badhan"
        },{
            headers: {
                "x-auth": signInResponse.data.token
            }
        });

        let validationResult = validate(response.data, {
            type: "object",
            additionalProperties: false,
            properties: {
                "status": {type: "string"},
                "statusCode": {const: 200},
                "message": {type: "string"},
            },
            required: ["status", "statusCode", "message"]
        });

        expect(validationResult.errors).toEqual([]);
        await badhanAxios.delete('/users/signout', {
            headers: {
                "x-auth": signInResponse.data.token
            }
        });
    } catch (e) {
        throw processError(e);
    }
})