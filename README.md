# Proxy Server and About Microservice

- An about service and proxy server that has been scaled for production. 
- Data is pulled from an About microservice via API requests, 10 Million records total.  
- Server Side Rendering (SSR) allows fully rendered HTML pages to be delivered on initial load.  
- HTML pages are cached in a Redis database.
- A series of load balancers and horizontally scaled nodes accomodate 600 RPS to random routes.
- Redis cache accomodates 1000 RPS for recently rendered pages.

## Deployment Architecture
![Server Design (1)](https://user-images.githubusercontent.com/71040019/123899600-5eef8800-d91c-11eb-8650-daf6c353eedf.jpeg)

## Related Projects

  - https://github.com/SDC-Builder/Tim-About-Service
  - https://github.com/SDC-Builder/Tim-Proxy-Server

## Local Development

- Run `npm install` from the root directory to install dependencies
- Run `npm build` to build the webpack bundle
- Run `npm start` to start the server. Server runs on port 3000



## Deployment Performance

Google PageSpeed insight score of 99

<img width="660" alt="Screen Shot 2021-06-21 at 11 42 21 PM" src="https://user-images.githubusercontent.com/71040019/123899243-a6c1df80-d91b-11eb-8578-b66656dd44ca.png">


600 RPS to random routes

![Screen Shot 2021-06-16 at 9 41 07 PM](https://user-images.githubusercontent.com/71040019/123904626-a890a080-d925-11eb-9c21-933fc8737c2b.png)

1000 RPS to previously rendered HTML routes

![Screen Shot 2021-06-20 at 9 11 01 PM](https://user-images.githubusercontent.com/71040019/123904569-8a2aa500-d925-11eb-9d2d-10e38fb8be20.png)

Screenshot of deployed page
<img width="1792" alt="Screen Shot 2021-06-20 at 10 41 30 PM" src="https://user-images.githubusercontent.com/71040019/123904308-1ee0d300-d925-11eb-8f44-5adf781b4112.png">