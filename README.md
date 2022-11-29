# Astroid

Dashboard for Nasa's NeoWs asteroid API. Select a date interval of up to 7 days, and view all recorded asteroid that approach the Earth during that time. You can see details like asteroid name, diameter, previous/next approaches, and other. 

![astroid](https://user-images.githubusercontent.com/97320785/204637772-2a744eaa-083a-4581-9d2a-ba97aa5ba4ea.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Clone down this repository. You will need `node` and `npm` installed globally on your machine.

You will also need to get an API key from [Nasa's website](https://api.nasa.gov/).

### Setup
Once in the project folder, run `npm install` in the terminal to install all dependencies.
Then, open `sample_apiconfig.ts` and replace `"Your key here"` with the API key string that you obtained previously. 
Finally, rename the file to `apiconfig.ts`.

### Deployment

To run a live version of the app, type `npm run dev` in the terminal.
By default, Next.JS should start on `localhost:3000`.

