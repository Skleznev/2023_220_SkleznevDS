const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");
const {DynamoDBClient, PutItemCommand} = require("@aws-sdk/client-dynamodb");
const {marshall} = require("@aws-sdk/util-dynamodb");
const analyzeExpression = require("./analyzeExpression");

const dynamodb = new DynamoDBClient({
    region: process.env.REGION,
    endpoint: process.env.ENDPOINT_DB,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});



const client = new S3Client({
    region: process.env.REGION, 
    endpoint: process.env.ENDPOINT_S3,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const s3download = async (bucketName, keyName) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: keyName,
    });

    const response = await client.send(command);
    return JSON.parse(await response.Body.transformToString());
};

module.exports.handler = async function (event, context) {
    const bucket_id = event.messages[0].details.bucket_id
    const object_id = event.messages[0].details.object_id

    const data = await s3download(bucket_id, object_id)

    const result = analyzeExpression(data)

    const arr = object_id.split("/")

    const determinantId = arr[arr.length-1].split(".")[0]
    const algorithmId = arr[arr.length-2]

    const params = {
        TableName: "determinant",
        Item: marshall({
            "determinantId": determinantId,
            "algorithmId": algorithmId,
            "processors": result.processors,
            "ticks": result.ticks
        })
    };

    dynamodb.send(new PutItemCommand(params))
        .then(data => {
            console.log("Сериал успешно добавлен:", JSON.stringify(data, null, 2));
        })
        .catch(err => {
            console.error("Не удалось добавить запись. Ошибка JSON:", JSON.stringify(err, null, 2));
        })

    return {
        statusCode: 200,
        body: event,
    };
};
