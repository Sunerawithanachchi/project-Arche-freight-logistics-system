## TCP and http , http is the primary language of the web , it needs a connection to go from one end (a pc or a server) to another end (a pc or a server) it uses TCP for this, TCP make sure sending all the data , in correct order.

## SSH and SMTP for mail also use TCP to make sure security and no data loss when delivering.

## in logistic world , TCP is like fedex or DHL the logistic company , they don't know what's inside the box , they just make sure they deliver it to correct address in correct order , HTTP is like the label in the box , the guy in warehouse reads it if it says something 200 he takes it if it says something 400 (404 server not found) it rejects

## what happens when a client calls an API endpoint

It initiate an http request/response cycle .The client send request with a method and path server routes this request to the specific logic that interacts with database then returns a response with a status code and requested data payload

## http methods GET vs POST

GET Used to retrieve data
Should be idempotent (repeating it has no side effects)
Parameters usually in URL

POST Used to create or trigger actions
Not idempotent
Data usually in request body

## What an http code status communicate

100s processing , wait
200s successful , OK
300s redirect
400s wrong format/ client error
500 server side failure

## What REST means without buzzwords

View all cargo /cargo GET Server sends a list of all cargo.
Add new cargo /cargo POST Server adds your data to Postgres.
Update a truck /trucks/8 PUT Server updates Truck #8's location.
Fire a driver /drivers/12 DELETE Server removes Driver #12 from the DB.

## /health: A standard endpoint used for monitoring. It returns a simple JSON status to tell external tools that the service is running and ready to handle requests.

## Express middleware

##Express processes a request like a pipeline. Instead of one giant function, it uses small, modular blocks of code called Middleware. Each block does one job—like logging or parsing JSON—and then calls next() to hand off the request to the next block until it finally reaches the route handler and a response is sent.
Order Matters. Middleware defined at the top of app.js (like our logger) sees the request before middleware defined at the bottom.
