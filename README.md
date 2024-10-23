# Udacity - Full-stack JavaScript Developer - Project 1

Image Processing API

## Introduction

### Overview

### Functionality

## Result obtained

## Setup and Start

Please follow the steps below to setup and start the project.

### 1. Requirements

- NodeJS: should be LTS version (>= 20.18.0)
- Yarn: classic version (>= 1.22.22). This project uses Yarn as package manager, but you can use npm as well. But it is recommended to use Yarn.

### 2. Installation

1. Clone the repository

   ```bash
   git clone https://github.com/daomtthuan/udacity-full-stack-javascript-developer-project-1.git
   ```

2. Install package dependencies

   ```bash
   yarn install

   # or using npm
   npm install
   ```

### 3. Scripts

1. Start development server

   ```bash
   yarn dev

   # or using npm
   npm run dev
   ```

2. Build the server

   ```bash
   yarn build

   # or using npm
   npm run build
   ```

3. Start the server (after building)

   ```bash
    yarn start

    # or using npm
    npm run start
   ```

4. Run tests

   ```bash
    yarn test

    # or using npm
    npm run test
   ```

5. Lint the code

   ```bash
    yarn lint

    # or using npm
    npm run lint
   ```

### 4. API Endpoints

You can use postman or any other API testing tool to test the API endpoints.
Postman collection and environment are provided in the `~/test/postman` folder.

#### Storage

- **GET** `/api/storage/images`: Get all images in the storage

  **Example**:

  ```curl
  curl --location 'http://127.0.0.1:3000/api/storage/images'
  ```

- **GET** `/api/storage/images/:name`: Get an image by name

  **Path Params**:

  - **name**: `string` Image name

  **Example**:

  ```curl
  curl --location 'http://127.0.0.1:3000/api/storage/image/pinic'
  ```

- **POST** `/api/storage/upload`: Upload an image to the storage

  **Body**: form-data

  - **Key**: `image` **Value**: `File` image file
  - **Key**: `name` **Value**: `string` image name

  **Example**:

  ```curl
  curl --location 'http://127.0.0.1:3000/api/storage/upload' \
  --form 'name="pinic"' \
  --form 'image=@"/C:/Users/Thuan/Downloads/pexels-ruxandra-scutelnic-1470184397-28750711.jpg"'
  ```

- **DELETE** `/api/storage/images/:name`: Delete an image by name

  **Path Params**:

  - **name**: `string` Image name

  **Example**:

  ```curl
  curl --location --request DELETE 'http://127.0.0.1:3000/api/storage/image/pinic'
  ```

#### Processing

- **GET** `/api/processing/images/:name`: Get an image by name

  **Path Params**:

  - **name**: `string` Image name

  **Query Params**:

  - **width**: `number` Image width
  - **height**: `number` Image height

  **Example**:

  ```curl
  curl --location 'http://127.0.0.1:3000/api/image/pinic?width=200&height=200'
  ```
