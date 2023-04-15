# Atelier Reviews API

The reviews API provides endpoints for managing customer reviews for products.

## Getting Started
---
To get started, you will need Node.js, PostgreSQL, and Redis installed on your machine.
After clonning this repository, install the dependencies:
```
npm install
```
Fill in the variables of example.env
```
PORT=
DB_USER=
DB_HOST=
DB_NAME=
DB_PASSWORD=
DB_PORT=
REDIS_HOST=
REDIS_PORT=
LOADER_IO_KEY=
```
Start the server:
```
npm start
```
The server will start on port 3000 by default if PORT is not specified

## API documentation
---
### **List reviews**

Returns a list of reviews for a particular product. This list **_does not_** include any reported reviews.

**GET /reviews/**

Query Parameters

| Parameter   | Type     | Description                                                                         |
| ----------- | -------- | ----------------------------------------------------------------------------------- |
| page        | integer  | Selects the page of results to return. Default 1.                                   |
| count       | integer  | Specifies how many results per page to return. Default 5.                           |
| sort        | text     | Changes the sort order of reviews to be based on "newest", "helpful", or "relevant" |
| product_id  | integer  | Specifies the product for which to retrieve reviews.                                |

Response

Status: 200 OK

```
{
  "product": "23214",
  "page": 1,
  "count": 5,
  "results": [
    {
      "review_id": 133565,
      "rating": 5,
      "summary": "Odit et a quo quis tenetur culpa aliquam unde.",
      "recommend": true,
      "response": "null",
      "body": "Reiciendis qui autem quos dolorum ut. Qui libero maiores quasi aut. Est eos rerum doloremque veniam provident. Voluptas error impedit nisi sunt iste tempore tenetur qui. Vel odio illo sunt soluta quo et aut sed.",
      "date": "2021-04-10T04:07:45.000Z",
      "reviewer_name": "Lilliana_Stehr",
      "helpfulness": 7,
      "photos": [
        {
          "id": 63260,
          "url": "https://images.unsplash.com/photo-1510867759970-3d2ca293be77?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
        },
        // ...
      ]
    },
    // ...
  ]
}
```
<br/><br/>
### **Get Reviews Metadata**

Returns reviews metatdata for given product.

**GET /reviews/meta**

Query Parameters

| Parameter   | Type     | Description                                                         |
| ----------- | -------- | ------------------------------------------------------------------- |
| product_id  | integer  | Required ID of the product for which data should be returned        |

Response

```
{
    "product_id": 1,
    "ratings": {
        "4": 1,
        "5": 1
    },
    "recommended": {
        "true": 1,
        "false": 1
    },
    "characteristics": {
        "Fit": {
            "id": 1,
            "value": 4
        },
        "Length": {
            "id": 2,
            "value": 4
        },
        "Comfort": {
            "id": 3,
            "value": 5
        },
        "Quality": {
            "id": 4,
            "value": 4
        }
    }
}
```
<br/><br/>
### **Add a Review**

Adds a review for the given product.

**POST /reviews**

Body Parameters

| Parameter  | Type     | Description                                            |
| ---------- | -------- | ------------------------------------------------------ |
| product_id | integer  | Required ID of the product to post the review for      |
| rating     | int      | Integer (1-5) indicating the review rating            |
| summary    | text     | Summary text of the review                             |
| body       | text     | Continued or full text of the review                   |
| recommend  | bool     | Value indicating if the reviewer recommends the product|
| name       | text     | Username for question asker                            |
| email      | text     | Email address for question asker                       |
| photos     | [text]   | Array of text urls that link to images to be shown      |
| characteristics | object | Object of keys representing characteristic_id and values representing the review value for that characteristic. { "14": 5, "15": 5 //...} |

Response

Status: 201 CREATED
<br/><br/>
### **Mark Review as Helpful**

Updates a review to show it was found helpful.

**PUT /reviews/:review_id/helpful**

Parameters

| Parameter   | Type     | Description                                                         |
| ----------- | -------- | ------------------------------------------------------------------- |
| review_id   | integer  | Required ID of the review to update      |

Response

Status: 204 NO CONTENT
<br/><br/>
### **Report Review**

Updates a review to show it was reported. Note, this action does not delete the review, but the review will not be returned in the above GET request.

**PUT /reviews/:review_id/report**

Paraneters

| Parameter   | Type     | Description                                                         |
| ----------- | -------- | ------------------------------------------------------------------- |
| review_id   | integer  | Required ID of the review to update      |

Response

Status: 204 NO CONTENT

