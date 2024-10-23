import 'reflect-metadata';

import type { Agent } from 'supertest';

import FileSystem from 'fs';
import Path from 'path';
import Test from 'supertest';
import { container } from 'tsyringe';
import { v4 as UUID } from 'uuid';

import type { ImageDto } from '~Controllers/Types/ApiDto.type';

import App from '~Core/Modules/App';

describe('StorageController', () => {
  const DATA_TEST_DIR = Path.join(__dirname, 'Data');
  const BASE_URL = '/api/storage';
  const IMAGE_RESOURCE_DIR = Path.join(__dirname, '../../../resources/images');
  const TEST_IMAGE_NAME = 'road';

  beforeAll(() => {
    ['road.jpg'].forEach((fileName) => {
      const testImagePath = Path.join(DATA_TEST_DIR, fileName);
      const destTestImagePath = Path.join(IMAGE_RESOURCE_DIR, fileName);
      if (FileSystem.existsSync(destTestImagePath)) {
        return;
      }

      FileSystem.copyFileSync(testImagePath, destTestImagePath);
    });
  });

  let agent: Agent;
  beforeEach(() => {
    const app = container.resolve(App);
    agent = Test(app.instance);
  });

  afterAll(() => {
    ['road.jpg'].forEach((fileName) => {
      const destTestImagePath = Path.join(IMAGE_RESOURCE_DIR, fileName);
      if (!FileSystem.existsSync(destTestImagePath)) {
        return;
      }

      FileSystem.rmSync(destTestImagePath);
    });
  });

  it('should return images', async () => {
    const resImages = await agent.get(`${BASE_URL}/images`).expect(200);

    expect(resImages.body).toBeInstanceOf(Array);

    const names = new Set();
    resImages.body.forEach((image: ImageDto) => {
      expect(image).toHaveProperty('name');
      expect(image.name).not.toBe('');

      expect(names.has(image.name)).toBe(false);
      names.add(image.name);
    });
  });

  it('should return image', async () => {
    const resImage = await agent.get(`${BASE_URL}/image/${TEST_IMAGE_NAME}`).expect(200);

    expect(resImage.body).toHaveProperty('name');
    expect(resImage.body.name).toBe(TEST_IMAGE_NAME);
  });

  it('should return not found image', async () => {
    await agent.get(`${BASE_URL}/image/NOT_EXIST_NAME`).expect(404);
  });

  it('should upload an image', async () => {
    const filePath = Path.join(DATA_TEST_DIR, 'road.jpg');

    const imageName = UUID();
    const res = await agent.post(`${BASE_URL}/upload`).field('name', imageName).attach('image', filePath).expect(201);

    FileSystem.rmSync(Path.join(IMAGE_RESOURCE_DIR, `${imageName}.jpg`));

    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toBe(imageName);
  });

  it('should return conflict if image already exists', async () => {
    const filePath = Path.join(DATA_TEST_DIR, 'road.jpg');

    await agent.post(`${BASE_URL}/upload`).field('name', TEST_IMAGE_NAME).attach('image', filePath).expect(409);
  });

  it('should delete an image', async () => {
    await agent.delete(`${BASE_URL}/image/${TEST_IMAGE_NAME}`).expect(204);

    await agent.get(`${BASE_URL}/image/${TEST_IMAGE_NAME}`).expect(404);
  });

  it('should return not found if delete image not exists', async () => {
    await agent.delete(`${BASE_URL}/image/NOT_EXIST_NAME`).expect(404);
  });
});
